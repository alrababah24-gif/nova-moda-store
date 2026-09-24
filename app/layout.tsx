// @ts-nocheck
// ULTIMATE LAYOUT - بطفي #418 + _rsc 404 + بشغل الباتش
import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CartProvider = dynamic(() => import("@/components/cart-provider").then(m=>m.CartProvider||m.default), { ssr: false, loading: () => null });
const SiteHeader = dynamic(() => import("@/components/site-header").then(m=>m.SiteHeader||m.default), { ssr: false, loading: () => null });
const TopBar = dynamic(() => import("@/components/top-bar").then(m=>m.TopBar||m.default), { ssr: false, loading: () => null });
const FbqPatch = dynamic(() => import("@/components/fbq-patch"), { ssr: false });

export const metadata: Metadata = { title: "Nova Moda", description: "عبايات" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-white antialiased">
        <FbqPatch />
        <div suppressHydrationWarning>
          <TopBar />
          <CartProvider>
            <SiteHeader />
            <main suppressHydrationWarning>{children}</main>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
