import { SettingsManager } from "@/components/admin/settings-manager";
import { fallbackSettings } from "@/data/fallback";
import { requireAdmin } from "@/lib/auth";
import type { StoreSettings } from "@/lib/types";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin("settings");
  const { data } = await supabase.from("store_settings").select("*").eq("id", 1).maybeSingle();
  return <SettingsManager settings={{ ...fallbackSettings, ...(data || {}) } as StoreSettings}/>;
}
