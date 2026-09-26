// @ts-nocheck
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useAccount } from "@/components/account/account-provider";
import type { StoreSettings } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function CheckoutForm({
  settings,
  databaseReady,
}: {
  settings: StoreSettings;
  databaseReady: boolean;
}) {
  const cart = useCart();
  const { user } = useAccount();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cart.items.length) return;

    const form = new FormData(event.currentTarget);

    const payload = {
      customer_name: String(form.get("customer_name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      city: String(form.get("city") || "").trim(),
      address: String(form.get("address") || "").trim(),
      notes: String(form.get("notes") || "").trim(),

      items: cart.items.map((item) => ({
        productId: String(item.id || ""),
        size: String(item.size || item.selectedSize || "غير محدد"),
        color: item.color ? String(item.color) : undefined,
        qty: Number(item.qty ?? item.quantity ?? 1),
      })),
    };

    setLoading(true);
    setError("");

    try {
      if (!databaseReady) {
        const demoNumber = `DEMO-${Date.now().toString().slice(-6)}`;

        const message = [
          `مرحبا نوفا مودا، أريد تأكيد طلب تجريبي رقم ${demoNumber}`,
          ...cart.items.map(
            (item) =>
              `- ${item.name} (${item.size || item.selectedSize || ""}) × ${
                item.qty ?? item.quantity ?? 1
              }`
          ),
          `الاسم: ${payload.customer_name}`,
          `الهاتف: ${payload.phone}`,
          `المحافظة: ${payload.city}`,
        ].join("\n");

        window.open(
          `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
            message
          )}`,
          "_blank",
          "noopener,noreferrer"
        );

        if (user) {
          try {
            const key = "nova-moda-demo-orders";
            const current = JSON.parse(
              localStorage.getItem(key) || "[]"
            );

            const demoOrder = {
              id: `demo-${Date.now()}`,
              order_number: demoNumber,
              status: "جديد",
              total,
              created_at: new Date().toISOString(),
              city: payload.city,
              address: payload.address,
              order_items: cart.items.map((item) => {
                const qty = Number(item.qty ?? item.quantity ?? 1);
                const price = Number(item.price || 0);

                return {
                  product_name: item.name,
                  size: item.size || item.selectedSize || "",
                  color: item.color || null,
                  qty,
                  unit_price: price,
                  line_total: price * qty,
                };
              }),
            };

            localStorage.setItem(
              key,
              JSON.stringify([demoOrder, ...current].slice(0, 20))
            );
          } catch {}
        }

        cart.clear();

        router.push(
          `/order-success?order=${encodeURIComponent(
            demoNumber
          )}&demo=1`
        );

        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "تعذر إنشاء الطلب");
      }

      window.open(
        `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(
          data.whatsappMessage
        )}`,
        "_blank",
        "noopener,noreferrer"
      );

      cart.clear();

      router.push(
        `/order-success?order=${encodeURIComponent(
          data.orderNumber
        )}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ غير متوقع"
      );
    } finally {
      setLoading(false);
    }
  }

  const total = cart.subtotal + settings.delivery_price;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[26px] border border-[#EEDFD4] bg-white p-5 soft-shadow sm:p-7"
      >
        <div className="mb-6">
          <p className="text-xs font-extrabold text-[#A27E6C]">
            الخطوة الأخيرة
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            بيانات التوصيل
          </h1>

          <p className="mt-2 text-sm leading-7 text-[#7F6B62]">
            اكتبي البيانات بشكل واضح، وسنرسل تفاصيل الطلب على واتساب بعد الإنشاء.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold">
            الاسم الكامل

            <input
              required
              name="customer_name"
              defaultValue={user?.fullName || ""}
              className="admin-input mt-2"
              placeholder="مثال: سارة أحمد"
            />
          </label>

          <label className="text-sm font-bold">
            رقم الهاتف

            <input
              required
              name="phone"
              inputMode="tel"
              defaultValue={user?.phone || ""}
              className="admin-input mt-2"
              placeholder="07XXXXXXXX"
            />
          </label>

          <label className="text-sm font-bold">
            المحافظة

            <select
              required
              name="city"
              defaultValue={user?.city || ""}
              className="admin-input mt-2"
            >
              <option value="" disabled>
                اختاري المحافظة
              </option>

              {[
                "عمّان",
                "إربد",
                "الزرقاء",
                "البلقاء",
                "مادبا",
                "جرش",
                "عجلون",
                "المفرق",
                "الكرك",
                "الطفيلة",
                "معان",
                "العقبة",
              ].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-bold">
            العنوان التفصيلي

            <input
              required
              name="address"
              defaultValue={user?.address || ""}
              className="admin-input mt-2"
              placeholder="المنطقة، الشارع، أقرب معلم"
            />
          </label>
        </div>

        <label className="mt-4 block text-sm font-bold">
          ملاحظات الطلب

          <textarea
            name="notes"
            rows={4}
            className="admin-input mt-2 resize-none"
            placeholder="أي ملاحظة بخصوص المقاس أو التوصيل..."
          />
        </label>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <button
          disabled={loading || !cart.items.length}
          className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#3D2B24] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#573C32] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              جاري إنشاء الطلب...
            </>
          ) : (
            <>
              <MessageCircle size={17} />
              إنشاء الطلب وإرساله واتساب
            </>
          )}
        </button>

        <div className="mt-5 grid gap-2 text-xs text-[#7F6B62] sm:grid-cols-3">
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} />
            بياناتك محفوظة بأمان
          </span>

          <span className="flex items-center gap-2">
            <Truck size={15} />
            توصيل 24–48 ساعة
          </span>

          <span className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            تأكيد قبل التجهيز
          </span>
        </div>
      </form>

      <aside className="h-fit rounded-[26px] border border-[#EEDFD4] bg-[#FDF6F0] p-5 lg:sticky lg:top-[165px] sm:p-6">
        <h2 className="text-lg font-extrabold">
          ملخص الطلب
        </h2>

        <div className="mt-5 space-y-3">
          {cart.items.map((item) => (
            <div
              key={`${item.id}-${item.size || item.selectedSize || ""}-${
                item.color ?? ""
              }`}
              className="flex items-start justify-between gap-3 border-b border-[#E6D7CC] pb-3 text-sm"
            >
              <div>
                <p className="font-bold leading-6">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-[#8C7A72]">
                  {item.size || item.selectedSize || ""}
                  {item.color ? ` • ${item.color}` : ""}
                  {" × "}
                  {item.qty ?? item.quantity ?? 1}
                </p>
              </div>

              <strong className="shrink-0">
                {formatPrice(
                  Number(item.price || 0) *
                    Number(item.qty ?? item.quantity ?? 1)
                )}
              </strong>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#7F6B62]">
              المجموع
            </span>

            <strong>
              {formatPrice(cart.subtotal)}
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-[#7F6B62]">
              التوصيل
            </span>

            <strong>
              {formatPrice(settings.delivery_price)}
            </strong>
          </div>

          <div className="flex justify-between border-t border-[#DCCABD] pt-4 text-lg">
            <strong>الإجمالي</strong>

            <strong>
              {formatPrice(total)}
            </strong>
          </div>
        </div>

        {!databaseReady && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900">
            وضع العرض التجريبي مفعّل. بعد ربط Supabase سيُحفظ الطلب في لوحة الإدارة تلقائياً.
          </div>
        )}
      </aside>
    </div>
  );
}
