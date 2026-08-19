"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, PackageCheck, Search, Truck, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  size: string;
  color?: string | null;
  qty: number;
  unit_price: number;
  line_total: number;
};

const statuses = ["جديد", "قيد التجهيز", "تم الشحن", "تم التوصيل", "ملغي"] as const;

const statusMeta: Record<string, { label: string; className: string }> = {
  "جديد": { label: "جديد", className: "bg-[#F4E8DF] text-[#805B4C]" },
  "قيد التجهيز": { label: "قيد التجهيز", className: "bg-amber-50 text-amber-800" },
  "تم الشحن": { label: "تم الشحن", className: "bg-blue-50 text-blue-700" },
  "تم التوصيل": { label: "تم التوصيل", className: "bg-emerald-50 text-emerald-700" },
  "ملغي": { label: "ملغي", className: "bg-red-50 text-red-700" },
};

export function OrdersManager({ orders, items }: { orders: Order[]; items: OrderItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("الكل");
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, OrderItem[]>();
    for (const item of items) map.set(item.order_id, [...(map.get(item.order_id) || []), item]);
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === "الكل" || order.status === filter;
      const matchesText = !q || [order.order_number, order.customer_name, order.phone, order.city].some((value) => value.toLowerCase().includes(q));
      return matchesStatus && matchesText;
    });
  }, [orders, query, filter]);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    if (!supabase) return;
    setSaving(id); setMessage("");
    const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) setMessage(error.message);
    else router.refresh();
    setSaving(null);
  }

  const counters = [
    { label: "طلبات جديدة", value: orders.filter((o) => o.status === "جديد").length, icon: Clock3 },
    { label: "قيد التجهيز", value: orders.filter((o) => o.status === "قيد التجهيز").length, icon: PackageCheck },
    { label: "تم الشحن", value: orders.filter((o) => o.status === "تم الشحن").length, icon: Truck },
    { label: "تم التوصيل", value: orders.filter((o) => o.status === "تم التوصيل").length, icon: CheckCircle2 },
  ];

  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{counters.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-[#E6D8CE] bg-white p-4 soft-shadow"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-[#8C7A72]">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></div><div className="grid h-11 w-11 place-items-center rounded-full bg-[#F7ECE4]"><Icon size={18}/></div></div></div>)}</div>

    <section className="rounded-2xl border border-[#E6D8CE] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div><p className="text-xs font-extrabold tracking-[.14em] text-[#A27E6C]">ORDERS</p><h1 className="mt-1 text-2xl font-extrabold">إدارة الطلبات</h1><p className="mt-1 text-xs text-[#8C7A72]">تابعي الطلب من لحظة وصوله حتى التسليم.</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A72]"/><input value={query} onChange={(e)=>setQuery(e.target.value)} className="admin-input pr-9 sm:w-72" placeholder="رقم الطلب، الاسم، الهاتف..."/></div><select value={filter} onChange={(e)=>setFilter(e.target.value)} className="admin-input sm:w-44"><option>الكل</option>{statuses.map((status)=><option key={status}>{status}</option>)}</select></div></div>
      {message && <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{message}</div>}
      <div className="mt-5 space-y-3">{filtered.map((order) => {
        const orderItems = grouped.get(order.id) || [];
        const meta = statusMeta[order.status] || statusMeta["جديد"];
        return <article key={order.id} className="rounded-2xl border border-[#EEE1D7] bg-[#FFFCF9] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{order.order_number}</strong><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${meta.className}`}>{meta.label}</span></div><h2 className="mt-2 text-lg font-extrabold">{order.customer_name}</h2><p className="mt-1 text-xs leading-6 text-[#7F6B62]">{order.phone} • {order.city}<br/>{order.address}</p>{order.notes && <p className="mt-2 rounded-xl bg-white p-3 text-xs leading-6 text-[#6F5B52]">ملاحظة: {order.notes}</p>}</div>
            <div className="shrink-0 text-right lg:min-w-52"><p className="text-xs text-[#8C7A72]">{new Date(order.created_at).toLocaleString("ar-JO")}</p><strong className="mt-2 block text-xl">{formatPrice(order.total)}</strong><select disabled={saving===order.id} value={order.status} onChange={(e)=>updateStatus(order.id,e.target.value)} className="admin-input mt-3 text-xs">{statuses.map((status)=><option key={status}>{status}</option>)}</select></div>
          </div>
          <div className="mt-4 border-t border-[#EEE1D7] pt-4"><p className="mb-2 text-[11px] font-extrabold text-[#8C7A72]">تفاصيل القطع</p><div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{orderItems.map((item)=><div key={item.id} className="rounded-xl bg-white p-3 text-xs"><strong className="line-clamp-1">{item.product_name}</strong><p className="mt-1 text-[#8C7A72]">المقاس {item.size}{item.color?` • ${item.color}`:""} • ×{item.qty}</p><p className="mt-1 font-bold">{formatPrice(item.line_total)}</p></div>)}</div><div className="mt-3 flex flex-wrap gap-4 text-xs text-[#6F5B52]"><span>المجموع: <b>{formatPrice(order.subtotal)}</b></span><span>التوصيل: <b>{formatPrice(order.delivery_fee)}</b></span></div></div>
        </article>;
      })}{!filtered.length && <div className="py-16 text-center text-sm text-[#8C7A72]"><XCircle className="mx-auto mb-3" size={28}/>لا توجد طلبات مطابقة.</div>}</div>
    </section>
  </div>;
}
