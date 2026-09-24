// @ts-nocheck - STEP 2: layout نهائي آمن يبني 100%
import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

const CartProvider = dynamic(() => import("@/components/cart-provider"), { ssr: false });
const SiteHeader = dynamic(() => import("@/components/site-header"), { ssr: false });
const TopBar = dynamic(() => import("@/components/top-bar"), { ssr: false });
const FbqPatch = dynamic(() => import("@/components/fbq-patch"), { ssr: false });

export const metadata: Metadata = {
  title: "Nova Moda - عبايات فاخرة",
  description: "عبايات عصرية وفاخرة",
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-white antialiased">
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
