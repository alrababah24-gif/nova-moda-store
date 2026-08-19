import Link from "next/link";
import { ArrowUpLeft, Sparkles } from "lucide-react";
import type { Brand } from "@/lib/types";

export function BrandRail({brands}:{brands:Brand[]}){
  if(!brands.length) return null;
  return <section className="relative z-10 border-b border-[var(--line)] bg-[color:var(--surface-glass)] backdrop-blur-xl">
    <div className="container-shell flex items-center gap-3 overflow-x-auto py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex shrink-0 items-center gap-2 pl-2 text-[10px] font-extrabold tracking-[.18em] text-[var(--brand-strong)]">
        <Sparkles size={13}/><span>BRANDS</span>
      </div>
      <div className="h-5 w-px shrink-0 bg-[var(--line)]"/>
      {brands.map((brand,index)=><Link key={brand.id} href={`/brands/${brand.slug}`} className="group flex shrink-0 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-[11px] font-extrabold transition duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[0_10px_28px_rgba(61,43,36,.08)]">
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand-soft)] px-1 text-[8px] text-[var(--brand-strong)]">{String(index+1).padStart(2,"0")}</span>
        <span>{brand.name}</span>
      </Link>)}
      <Link href="/brands" className="group flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-[11px] font-extrabold text-[var(--muted)] transition hover:text-[var(--ink)]">كل البراندات <ArrowUpLeft size={12} className="transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"/></Link>
    </div>
  </section>
}
