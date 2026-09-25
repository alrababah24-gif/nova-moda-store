import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));

const dryRun = process.argv.includes("--dry-run");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const imagekitEndpoint = (process.env.IMAGEKIT_URL_ENDPOINT || "").replace(/\/$/, "");

const missing = [
  ["NEXT_PUBLIC_SUPABASE_URL", supabaseUrl],
  ["SUPABASE_SERVICE_ROLE_KEY", serviceKey],
  ["IMAGEKIT_PRIVATE_KEY", imagekitPrivateKey],
  ["IMAGEKIT_URL_ENDPOINT", imagekitEndpoint],
].filter(([, value]) => !value).map(([key]) => key);

if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  console.error("ضع القيم الناقصة في .env.local ثم أعد تشغيل الأمر.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.resolve(process.cwd(), "migration-backups");
const backupFile = path.join(backupDir, `imagekit-migration-${stamp}.json`);
const backup = {
  createdAt: new Date().toISOString(),
  completed: false,
  dryRun,
  products: [],
  brands: [],
  settings: [],
  mappings: [],
};
const migrated = new Map();

function saveBackup() {
  if (dryRun) return;
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
}

function isSupabaseStorageUrl(value) {
  return Boolean(value && typeof value === "string" && value.includes("/storage/v1/object/public/"));
}

function isAlreadyImageKit(value) {
  return Boolean(value && imagekitEndpoint && value.startsWith(imagekitEndpoint));
}

function fileNameFromUrl(value, fallback = "image.jpg") {
  try {
    const url = new URL(value);
    const last = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || fallback);
    const clean = last.replace(/[^a-zA-Z0-9._-]+/g, "-");
    return clean.includes(".") ? clean : `${clean}.jpg`;
  } catch {
    return fallback;
  }
}

function authHeader() {
  return `Basic ${Buffer.from(`${imagekitPrivateKey}:`).toString("base64")}`;
}

async function sendUpload(fileValue, fileName, folder) {
  const form = new FormData();
  form.append("file", fileValue);
  form.append("fileName", fileName);
  form.append("folder", folder);
  form.append("useUniqueFileName", "true");
  return fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: authHeader() },
    body: form,
  });
}

async function uploadUrl(oldUrl, folder) {
  if (!oldUrl || isAlreadyImageKit(oldUrl) || !isSupabaseStorageUrl(oldUrl)) return oldUrl;
  if (migrated.has(oldUrl)) return migrated.get(oldUrl);

  const fileName = fileNameFromUrl(oldUrl, `${Date.now()}.jpg`);
  if (dryRun) {
    console.log(`[DRY] ${fileName} -> ${folder}`);
    migrated.set(oldUrl, oldUrl);
    return oldUrl;
  }

  // Fast path: let ImageKit fetch the public Supabase URL directly.
  let response = await sendUpload(oldUrl, fileName, folder);
  let payload = await response.json().catch(() => ({}));

  // Fallback: download once locally and upload bytes if remote-URL ingestion fails.
  if (!response.ok || !payload.url) {
    const source = await fetch(oldUrl, { cache: "no-store" });
    if (!source.ok) throw new Error(`تعذر تنزيل الملف القديم: ${oldUrl}`);
    const blob = new Blob([await source.arrayBuffer()], { type: source.headers.get("content-type") || "image/jpeg" });
    response = await sendUpload(blob, fileName, folder);
    payload = await response.json().catch(() => ({}));
  }

  if (!response.ok || !payload.url) throw new Error(payload.message || `ImageKit upload failed for ${oldUrl}`);

  migrated.set(oldUrl, payload.url);
  backup.mappings.push({ oldUrl, newUrl: payload.url, fileId: payload.fileId || null });
  saveBackup();
  console.log(`✓ ${fileName}`);
  return payload.url;
}

async function getSourceData() {
  const [productsResult, brandsResult, settingsResult] = await Promise.all([
    supabase.from("products").select("id,name,slug,images").order("created_at", { ascending: true }),
    supabase.from("brands").select("id,name,logo_url,cover_image").order("created_at", { ascending: true }),
    supabase.from("store_settings").select("id,logo_url").eq("id", 1).maybeSingle(),
  ]);
  if (productsResult.error) throw productsResult.error;
  if (brandsResult.error) throw brandsResult.error;
  if (settingsResult.error) throw settingsResult.error;
  return {
    products: productsResult.data || [],
    brands: brandsResult.data || [],
    settings: settingsResult.data || null,
  };
}

async function main() {
  console.log(dryRun ? "=== DRY RUN: لا رفع ولا تعديل قاعدة البيانات ===" : "=== Supabase Storage -> ImageKit migration ===");
  const source = await getSourceData();

  // Save the exact old URLs before touching the database.
  backup.products = source.products.map((p) => ({ id: p.id, name: p.name, oldImages: Array.isArray(p.images) ? p.images : [], newImages: null }));
  backup.brands = source.brands.map((b) => ({ id: b.id, name: b.name, oldLogoUrl: b.logo_url, newLogoUrl: null, oldCoverImage: b.cover_image, newCoverImage: null }));
  if (source.settings) backup.settings = [{ id: source.settings.id, oldLogoUrl: source.settings.logo_url, newLogoUrl: null }];
  saveBackup();

  for (const product of source.products) {
    const oldImages = Array.isArray(product.images) ? product.images : [];
    const newImages = [];
    for (const image of oldImages) newImages.push(await uploadUrl(image, "/nova-moda/products"));
    const record = backup.products.find((item) => item.id === product.id);
    if (record) record.newImages = newImages;
    const changed = newImages.some((value, index) => value !== oldImages[index]);
    if (changed && !dryRun) {
      const { error } = await supabase.from("products").update({ images: newImages, updated_at: new Date().toISOString() }).eq("id", product.id);
      if (error) throw error;
      saveBackup();
      console.log(`  DB ✓ ${product.name}`);
    }
  }

  for (const brand of source.brands) {
    const logoUrl = await uploadUrl(brand.logo_url, "/nova-moda/brands");
    const coverImage = await uploadUrl(brand.cover_image, "/nova-moda/brands");
    const record = backup.brands.find((item) => item.id === brand.id);
    if (record) { record.newLogoUrl = logoUrl; record.newCoverImage = coverImage; }
    if (!dryRun && (logoUrl !== brand.logo_url || coverImage !== brand.cover_image)) {
      const { error } = await supabase.from("brands").update({ logo_url: logoUrl, cover_image: coverImage, updated_at: new Date().toISOString() }).eq("id", brand.id);
      if (error) throw error;
      saveBackup();
      console.log(`  DB ✓ brand ${brand.name}`);
    }
  }

  if (source.settings) {
    const logoUrl = await uploadUrl(source.settings.logo_url, "/nova-moda/store");
    if (backup.settings[0]) backup.settings[0].newLogoUrl = logoUrl;
    if (!dryRun && logoUrl !== source.settings.logo_url) {
      const { error } = await supabase.from("store_settings").update({ logo_url: logoUrl, updated_at: new Date().toISOString() }).eq("id", 1);
      if (error) throw error;
      saveBackup();
      console.log("  DB ✓ store logo");
    }
  }

  if (dryRun) {
    console.log("\nDry run completed. إذا النتيجة طبيعية شغّل: npm run media:migrate");
    return;
  }

  backup.completed = true;
  saveBackup();
  console.log(`\nMigration completed. Unique files moved: ${backup.mappings.length}`);
  console.log(`Safety backup: ${backupFile}`);
  console.log("لا تحذف Supabase Storage الآن. افحص الموقع أولاً، ثم استخدم cleanup command.");
}

main().catch((error) => {
  saveBackup();
  console.error("\nMigration failed:", error?.message || error);
  console.error("لم يتم حذف أي ملف من Supabase Storage. يمكنك تشغيل rollback إذا لزم.");
  process.exit(1);
});
