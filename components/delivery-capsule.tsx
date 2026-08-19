import { Clock3, PackageCheck, Truck } from "lucide-react";
import type { StoreSettings } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function DeliveryCapsule({settings}:{settings:StoreSettings}){
  return <div className="pointer-events-none fixed left-1/2 top-[78px] z-40 -translate-x-1/2 md:top-[94px]"><div className="pointer-events-auto flex items-center gap-2 rounded-b-[20px] border border-t-0 border-[var(--line)] bg-[color:var(--surface-glass)] px-3.5 py-2 shadow-[0_14px_35px_rgba(61,43,36,.10)] backdrop-blur-xl sm:gap-3 sm:px-4"><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-strong)]"><Truck size={15}/></div><div className="whitespace-nowrap"><p className="text-[10px] font-extrabold tracking-wide text-[var(--muted)]">{settings.top_bar_text}</p><p className="text-[11px] font-extrabold sm:text-xs">{formatPrice(settings.delivery_price)} <span className="text-[var(--muted)]">• 24–48 ساعة</span></p></div><PackageCheck size={15} className="hidden text-[var(--brand-strong)] sm:block"/><Clock3 size={14} className="text-[var(--muted)] sm:hidden"/></div></div>
}
