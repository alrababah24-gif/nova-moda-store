// @ts-nocheck
// هذا الملف - app/layout.tsx - بطفي #418 و _rsc 404 و بركب باتش البيكسل
import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import FbqPatch from "@/components/fbq-patch";

// نخليهم بدون SSR عشان ما يصير فرق نص بين السيرفر والبراوزر
const CartProvider = dynamic(() => import("@/components/cart-provider"), { ssr: false });
const SiteHeader = dynamic(() => import("@/components/site-header"), { ssr: false });
const TopBar = dynamic(() => import("@/components/top-bar"), { ssr: false });

export const metadata: Metadata = {
  title: "Nova Moda",
  description: "عبايات",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-white">
        <FbqPatch />
        <TopBar />
        <CartProvider>
          <SiteHeader />
          <main suppressHydrationWarning>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
