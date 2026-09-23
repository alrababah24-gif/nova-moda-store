import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import MetaPixel from "@/components/meta-pixel"

const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400","500","700"] })

export const metadata: Metadata = {
  title: "نوفا مودا - عبايات",
  description: "متجر عبايات",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <MetaPixel />
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
