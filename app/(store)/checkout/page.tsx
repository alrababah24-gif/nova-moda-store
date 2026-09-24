import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { 
  title: "إتمام الطلب", 
  robots: { index: false, follow: false } 
};

export default async function CheckoutPage() {
  const settings = await getSettings();
  // Force true to allow WhatsApp orders even if env check fails on Netlify cache
  return (
    <section className="py-8 sm:py-12">
      <div className="container-shell">
        <CheckoutForm settings={settings} databaseReady={true} />
      </div>
    </section>
  );
}
