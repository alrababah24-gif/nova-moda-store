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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnvFile(path.resolve(process.cwd(), ".env.local"));

if (!process.argv.includes("--confirm")) {
  console.log("Safety stop: هذا الأمر يحذف فقط ملفات Supabase التي تم ترحيلها بنجاح.");
  console.log("بعد فحص الموقع شغّل: npm run media:cleanup:supabase -- --confirm");
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY مطلوبان في .env.local");

const backupDir = path.resolve(process.cwd(), "migration-backups");
if (!fs.existsSync(backupDir)) throw new Error("لا يوجد مجلد migration-backups");
const files = fs.readdirSync(backupDir).filter((name) => name.startsWith("imagekit-migration-") && name.endsWith(".json")).sort();
if (!files.length) throw new Error("لا يوجد ملف backup للترحيل");
const latest = path.join(backupDir, files.at(-1));
const backup = JSON.parse(fs.readFileSync(latest, "utf8"));

function parseStorageUrl(value) {
  try {
    const u = new URL(value);
    const marker = "/storage/v1/object/public/";
    const index = u.pathname.indexOf(marker);
    if (index < 0) return null;
    const rest = decodeURIComponent(u.pathname.slice(index + marker.length));
    const slash = rest.indexOf("/");
    if (slash < 1) return null;
    return { bucket: rest.slice(0, slash), objectPath: rest.slice(slash + 1) };
  } catch {
    return null;
  }
}

const groups = new Map();
for (const item of backup.mappings || []) {
  const parsed = parseStorageUrl(item.oldUrl);
  if (!parsed) continue;
  if (!groups.has(parsed.bucket)) groups.set(parsed.bucket, new Set());
  groups.get(parsed.bucket).add(parsed.objectPath);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
for (const [bucket, paths] of groups) {
  const list = [...paths];
  for (let i = 0; i < list.length; i += 100) {
    const batch = list.slice(i, i + 100);
    const { error } = await supabase.storage.from(bucket).remove(batch);
    if (error) throw error;
    console.log(`✓ Deleted ${batch.length} files from ${bucket}`);
  }
}
console.log("Supabase Storage cleanup completed. Database/auth/orders were NOT touched.");
