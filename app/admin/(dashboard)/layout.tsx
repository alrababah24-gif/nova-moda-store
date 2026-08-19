import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "لوحة الإدارة", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, profile, permissions } = await requireAdmin();
  return <AdminShell userEmail={user.email} fullName={profile.full_name||undefined} role={profile.role} permissions={permissions}>{children}</AdminShell>;
}
