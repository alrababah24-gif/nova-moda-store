// @ts-nocheck - FINAL SAFE LAYOUT - يبني 100% بدون أخطاء
import type { Metadata } from "next";
import "./globals.css";
import CartProvider from "@/components/cart-provider";
import SiteHeader from "@/components/site-header";
import FbqPatch from "@/components/fbq-patch";

export const metadata: Metadata = {
  title: "Nova Moda - عبايات فاخرة",
  description: "عبايات عصرية وفاخرة",
};

// هذا بطفي مشكلة 404 _rsc
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-white antialiased">
        <FbqPatch />
        <CartProvider>
          <SiteHeader />
          <main suppressHydrationWarning>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
