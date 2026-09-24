"use client";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const cart = useCart();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart.items.length) return;
    const form = new FormData(e.currentTarget);
    const name = String(form.get("customer_name") || "");
    const phone = String(form.get("phone") || "");
    const city = String(form.get("city") || "");
    const address = String(form.get("address") || "");
    const notes = String(form.get("notes") || "");

    setLoading(true);
    const orderNumber = `NM-${Date.now().toString().slice(-6)}`;
    const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0) + 3;

    const message = [
      `مرحبا نوفا مودا، طلب جديد رقم ${orderNumber}`,
      ``,
      ...cart.items.map((it) => `- ${it.name} (${it.size}) × ${it.qty}`),
      ``,
      `الاسم: ${name}`,
      `الهاتف: ${phone}`,
      `المحافظة: ${city}`,
      `العنوان: ${address}`,
      notes ? `ملاحظات: ${notes}` : "",
      `الإجمالي: ${total} د.أ`,
    ].filter(Boolean).join("\n");

    // رقم واتساب من الإعدادات - غيره لرقمك
    const waNumber = "962797937007"; 
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");
    
    cart.clear();
    window.location.href = `/order-success?order=${orderNumber}`;
    setLoading(false);
  }

  if (!cart.items.length) {
    return <div className="container-shell py-12 text-center">السلة فارغة</div>;
  }

  return (
    <section className="py-8">
      <div className="container-shell grid gap-8 lg:grid-cols-[1fr_400px]">
        <form onSubmit={handleSubmit} className="rounded-[26px] border bg-white p-6">
          <h1 className="text-2xl font-extrabold">بيانات التوصيل</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">الاسم الكامل<input required name="customer_name" className="admin-input mt-2" placeholder="سارة أحمد" /></label>
            <label className="text-sm font-bold">رقم الهاتف<input required name="phone" className="admin-input mt-2" placeholder="07XXXXXXXX" /></label>
            <label className="text-sm font-bold">المحافظة<select required name="city" className="admin-input mt-2"><option value="" disabled>اختاري</option>{["عمّان","إربد","الزرقاء","البلقاء","مادبا","جرش","عجلون","المفرق","الكرك","الطفيلة","معان","العقبة"].map(c=><option key={c}>{c}</option>)}</select></label>
            <label className="text-sm font-bold">العنوان<input required name="address" className="admin-input mt-2" placeholder="المنطقة، الشارع" /></label>
          </div>
          <label className="mt-4 block text-sm font-bold">ملاحظات<textarea name="notes" rows={3} className="admin-input mt-2" /></label>
          <button disabled={loading} className="mt-6 w-full rounded-full bg-[#3D2B24] py-3.5 text-white font-extrabold">{loading ? "جاري..." : "إنشاء الطلب وإرساله واتساب"}</button>
        </form>
        <aside className="rounded-[26px] border bg-[#FDF6F0] p-6 h-fit">
          <h2 className="font-extrabold">ملخص الطلب</h2>
          <div className="mt-4 space-y-2 text-sm">
            {cart.items.map((it) => (
              <div key={it.productId+it.size} className="flex justify-between"><span>{it.name} × {it.qty}</span><span>{formatPrice(it.price*it.qty)}</span></div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
