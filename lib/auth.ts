import { redirect } from "next/navigation";
import type { Profile, StaffPermissions, StaffRole } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type StaffPermissionKey = keyof StaffPermissions;

const presetPermissions: Record<Exclude<StaffRole,"customer">, StaffPermissions> = {
  owner: { catalog:true, orders:true, content:true, customers:true, settings:true, staff:true },
  admin: { catalog:true, orders:true, content:true, customers:true, settings:true, staff:false },
  editor: { catalog:true, orders:false, content:true, customers:false, settings:false, staff:false },
};

export function permissionsForProfile(profile: Pick<Profile,"role"|"permissions"> | null | undefined): StaffPermissions {
  if (!profile || profile.role === "customer") return {};
  return { ...presetPermissions[profile.role], ...(profile.permissions || {}) };
}

export function hasStaffPermission(profile: Pick<Profile,"role"|"permissions"> | null | undefined, permission?: StaffPermissionKey) {
  if (!profile || profile.role === "customer") return false;
  if (!permission) return true;
  return Boolean(permissionsForProfile(profile)[permission]);
}

export async function requireStaff(permission?: StaffPermissionKey) {
  if (!isSupabaseConfigured()) redirect("/admin/login?setup=1");
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login?setup=1");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase.from("profiles").select("id,email,role,full_name,permissions").eq("id", user.id).maybeSingle();
  const profile = data as Profile | null;
  if (!hasStaffPermission(profile, permission)) redirect("/admin/login?error=unauthorized");

  return { supabase, user, profile: profile as Profile, permissions: permissionsForProfile(profile) };
}

// Backward-compatible name used by existing admin pages.
export async function requireAdmin(permission?: StaffPermissionKey) {
  return requireStaff(permission);
}
