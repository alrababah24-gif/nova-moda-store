"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, ExternalLink, FileText, Home, LogOut, MessageSquareText, PackageCheck, Settings, Tags, Users, UserCog } from "lucide-react";
import type { ReactNode } from "react";
import type { StaffPermissions, StaffRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href:"/admin", label:"نظرة عامة", icon:Home },
  { href:"/admin/brands", label:"البراندات", icon:Tags, permission:"catalog" as const },
  { href:"/admin/products", label:"المنتجات", icon:Boxes, permission:"catalog" as const },
  { href:"/admin/orders", label:"الطلبات", icon:PackageCheck, permission:"orders" as const },
  { href:"/admin/content", label:"المحتوى", icon:FileText, permission:"content" as const },
  { href:"/admin/customers", label:"العملاء", icon:Users, permission:"customers" as const },
  { href:"/admin/messages", label:"الرسائل", icon:MessageSquareText, permission:"customers" as const },
  { href:"/admin/team", label:"فريق الإدارة", icon:UserCog, permission:"staff" as const },
  { href:"/admin/settings", label:"الإعدادات", icon:Settings, permission:"settings" as const },
];

const roleLabel:Record<StaffRole,string>={customer:"عميل",editor:"محرر",admin:"مدير",owner:"المالك"};

export function AdminShell({ children, userEmail, fullName, role="admin", permissions={} }: { children: ReactNode; userEmail?: string; fullName?: string; role?: StaffRole; permissions?: StaffPermissions }) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout(){const supabase=createClient(); if(supabase) await supabase.auth.signOut(); router.replace("/admin/login"); router.refresh();}
  const visibleLinks=links.filter(link=>!link.permission || permissions[link.permission]);

  return <div className="min-h-screen bg-[#F7F1EC] text-[#3D2B24]">
    <header className="sticky top-0 z-40 border-b border-[#E7D9CF] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#E6D8CE] bg-[#FFF9F4]"><Image src="/brand/nova-moda-mark-clean.png" alt="Nova Moda" width={52} height={52} className="h-10 w-10 object-contain"/></span><div><div className="flex items-center gap-2"><strong className="block text-sm">لوحة إدارة نوفا مودا</strong><span className="rounded-full bg-[#F6EBE3] px-2 py-1 text-[9px] font-extrabold text-[#805B4C]">{roleLabel[role]}</span></div><span className="hidden text-[11px] text-[#8C7A72] sm:block">{fullName||userEmail}</span></div></div>
        <div className="flex items-center gap-2"><Link href="/" target="_blank" className="flex h-10 items-center gap-2 rounded-full border border-[#E6D8CE] bg-white px-3 text-xs font-bold"><ExternalLink size={14}/>المتجر</Link><button onClick={logout} className="grid h-10 w-10 place-items-center rounded-full border border-[#E6D8CE] text-red-600" aria-label="تسجيل الخروج"><LogOut size={16}/></button></div>
      </div>
    </header>
    <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[230px_1fr]">
      <aside className="h-fit rounded-[22px] border border-[#E6D8CE] bg-white p-2 lg:sticky lg:top-[92px]"><nav className="flex gap-2 overflow-x-auto lg:block">{visibleLinks.map(({href,label,icon:Icon})=>{const active=href==="/admin"?pathname===href:pathname.startsWith(href);return <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-bold transition lg:mb-1 lg:w-full ${active?"bg-[#3D2B24] text-white shadow-sm":"hover:bg-[#FDF6F0]"}`}><Icon size={16}/>{label}</Link>})}</nav></aside>
      <div className="min-w-0">{children}</div>
    </div>
  </div>;
}
