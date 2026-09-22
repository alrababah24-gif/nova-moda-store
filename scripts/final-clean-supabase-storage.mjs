import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));

const CONFIRM = process.argv.includes("--confirm");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("استخدم نفس نافذة CMD التي وضعت فيها SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const storageMarker = "/storage/v1/object/";

function collectStorageUrls(value, label, found) {
  if (typeof value === "string") {
    if (value.includes(storageMarker) && value.includes(new URL(supabaseUrl).host)) {
      found.push({ label, url: value });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectStorageUrls(v, `${label}[${i}]`, found));
  }
}

async function verifyDatabaseHasNoStorageReferences() {
  const found = [];

  const [products, brands, settings] = await Promise.all([
    supabase.from("products").select("id,name,images"),
    supabase.from("brands").select("id,name,logo_url,cover_image"),
    supabase.from("store_settings").select("id,logo_url"),
  ]);

  if (products.error) throw products.error;
  if (brands.error) throw brands.error;
  if (settings.error) throw settings.error;

  for (const p of products.data || []) {
    collectStorageUrls(p.images, `products:${p.id}:${p.name}:images`, found);
  }
  for (const b of brands.data || []) {
    collectStorageUrls(b.logo_url, `brands:${b.id}:${b.name}:logo_url`, found);
    collectStorageUrls(b.cover_image, `brands:${b.id}:${b.name}:cover_image`, found);
  }
  for (const s of settings.data || []) {
    collectStorageUrls(s.logo_url, `store_settings:${s.id}:logo_url`, found);
  }

  if (found.length) {
    console.error("\nSTOP: ما زالت هناك روابط Supabase Storage مستخدمة في قاعدة البيانات:");
    for (const item of found) console.error(`- ${item.label}`);
    console.error("\nلم يتم حذف أي bucket أو ملف.");
    process.exit(2);
  }

  console.log("✓ Database check: no active Supabase Storage URLs in products/brands/store settings.");
}

async function listAllFiles(bucket, prefix = "") {
  const files = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const item of data) {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
      // Supabase folders have id === null.
      if (item.id === null) {
        files.push(...await listAllFiles(bucket, itemPath));
      } else {
        files.push(itemPath);
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }
  return files;
}

async function removeFiles(bucket, files) {
  for (let i = 0; i < files.length; i += 100) {
    const batch = files.slice(i, i + 100);
    const { error } = await supabase.storage.from(bucket).remove(batch);
    if (error) throw error;
    console.log(`  ✓ deleted ${batch.length} object(s) from ${bucket}`);
  }
}

async function main() {
  console.log("=== Nova Moda: final Supabase Storage cleanup ===");
  await verifyDatabaseHasNoStorageReferences();

  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) throw bucketError;

  const targets = new Set(["product-images", "brand-assets"]);
  const targetBuckets = (buckets || []).filter((b) => targets.has(b.id || b.name));
  const otherBuckets = (buckets || []).filter((b) => !targets.has(b.id || b.name));

  if (!targetBuckets.length) {
    console.log("✓ product-images / brand-assets buckets are already gone.");
  }

  const inventory = [];
  for (const bucket of targetBuckets) {
    const name = bucket.id || bucket.name;
    const files = await listAllFiles(name);
    inventory.push({ name, files });
    console.log(`- ${name}: ${files.length} remaining object(s)`);
  }

  if (otherBuckets.length) {
    console.log("\nملاحظة: توجد buckets أخرى ولن يلمسها هذا السكربت:");
    for (const b of otherBuckets) console.log(`- ${b.id || b.name}`);
  }

  if (!CONFIRM) {
    console.log("\nAUDIT ONLY — لم يتم حذف أي شيء.");
    console.log("إذا النتيجة طبيعية شغّل:");
    console.log("node scripts/final-clean-supabase-storage.mjs --confirm");
    return;
  }

  for (const { name, files } of inventory) {
    if (files.length) await removeFiles(name, files);
    const { error } = await supabase.storage.deleteBucket(name);
    if (error) throw error;
    console.log(`✓ deleted bucket: ${name}`);
  }

  console.log("\nDONE.");
  console.log("Supabase Storage الخاص بصور Nova Moda تم تعطيله وتنظيفه.");
  console.log("Database/Auth/Orders/Products/Stock were NOT deleted.");
}

main().catch((error) => {
  console.error("\nCleanup failed:", error?.message || error);
  console.error("تم إيقاف العملية. لا تحذف شيئاً يدوياً.");
  process.exit(1);
});
