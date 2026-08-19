"use client";
import { Facebook, Instagram } from "lucide-react";
import type { StoreSettings } from "@/lib/types";

export function SocialDock({settings}:{settings:StoreSettings}){
  const links=[{href:settings.instagram,label:"Instagram",icon:Instagram},{href:settings.facebook,label:"Facebook",icon:Facebook}].filter(x=>Boolean(x.href));
  return <div className="fixed bottom-5 left-4 z-40 flex flex-col gap-2 sm:bottom-6 sm:left-5">{links.map(({href,label,icon:Icon})=><a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="social-float grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface-glass)] shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:text-[var(--brand-strong)]"><Icon size={16}/></a>)}</div>
}
