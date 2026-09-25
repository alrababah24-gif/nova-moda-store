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
  console.log("Safety stop. للرجوع للروابط القديمة شغّل: npm run media:rollback -- --confirm");
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY مطلوبان في .env.local");

const dir = path.resolve(process.cwd(), "migration-backups");
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.startsWith("imagekit-migration-") && n.endsWith(".json")).sort() : [];
if (!files.length) throw new Error("لا يوجد migration backup");
const backup = JSON.parse(fs.readFileSync(path.join(dir, files.at(-1)), "utf8"));
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

for (const product of backup.products || []) {
  const { error } = await supabase.from("products").update({ images: product.oldImages || [], updated_at: new Date().toISOString() }).eq("id", product.id);
  if (error) throw error;
}
for (const brand of backup.brands || []) {
  const { error } = await supabase.from("brands").update({ logo_url: brand.oldLogoUrl || null, cover_image: brand.oldCoverImage || null, updated_at: new Date().toISOString() }).eq("id", brand.id);
  if (error) throw error;
}
for (const settings of backup.settings || []) {
  const { error } = await supabase.from("store_settings").update({ logo_url: settings.oldLogoUrl || null, updated_at: new Date().toISOString() }).eq("id", settings.id);
  if (error) throw error;
}
console.log("Rollback completed. Database URLs point back to Supabase Storage.");
