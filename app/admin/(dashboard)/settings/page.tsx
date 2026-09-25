import { SettingsManager } from "@/components/admin/settings-manager";
import { fallbackSettings } from "@/data/fallback";
import { requireAdmin } from "@/lib/auth";
import type { Product, StoreSettings } from "@/lib/types";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin("settings");
  const [{ data: settings }, { data: products }] = await Promise.all([
    supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false }),
  ]);

  return <SettingsManager
    settings={{ ...fallbackSettings, ...(settings || {}) } as StoreSettings}
    products={(products || []) as unknown as Product[]}
  />;
}
