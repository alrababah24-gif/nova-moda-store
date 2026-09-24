import { CheckoutForm } from "@/components/checkout-form";
import { getStoreSettings } from "@/lib/settings";

// نجبر الصفحة تشتغل دائماً حتى لو Supabase مش مربوط
export default async function CheckoutPage() {
  let settings;
  try {
    settings = await getStoreSettings();
  } catch {
    // fallback إذا فشل جلب الإعدادات
    settings = {
      whatsapp: "962797937007",
      delivery_price: 3,
    } as any;
  }

  return (
    <section className="py-8">
      <div className="container-shell">
        <CheckoutForm settings={settings} databaseReady={true} />
      </div>
    </section>
  );
}
