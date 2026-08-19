import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OrdersView } from "@/components/account/orders-view";
export const metadata:Metadata={title:"طلباتي",robots:{index:false,follow:false}};
export default function OrdersPage(){return <section className="container-shell py-10 sm:py-14"><Link href="/account" className="inline-flex items-center gap-2 text-xs font-extrabold text-[var(--muted)]"><ArrowRight size={14}/>حسابي</Link><div className="mt-5 mb-7"><p className="text-[10px] font-extrabold tracking-[.2em] text-[var(--brand-strong)]">ORDER TRACKING</p><h1 className="mt-2 text-[34px] font-extrabold sm:text-[44px]">طلباتي</h1><p className="mt-2 text-sm leading-7 text-[var(--muted)]">كل طلب بحالته الحالية وتفاصيل القطع والتوصيل.</p></div><OrdersView/></section>}
