// @ts-nocheck
// FINAL FIX - بيطفي #418 - بيعرض نفس الشي بالسيرفر والبراوزر
"use client"
import Link from "next/link"
import { useCart } from "./cart-provider"

export function SiteHeader() {
  const cart = useCart()
  // مهم: قبل ما يتحمل المتصفح نعرض 0 ثابت عشان السيرفر والكلاينت نفس الشي
  const count = cart?.mounted ? cart.count : 0

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur" suppressHydrationWarning>
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto" suppressHydrationWarning>
        <Link href="/" className="font-bold text-xl">Nova Moda</Link>
        <nav className="flex items-center gap-6 text-sm" suppressHydrationWarning>
          <Link href="/products">المنتجات</Link>
          <Link href="/cart" className="relative" suppressHydrationWarning>
            السلة
            <span suppressHydrationWarning className="absolute -top-2 -right-3 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {count}
            </span>
          </Link>
        </nav>
      </div>
      {/* بانر التوصيل - لازم suppressHydrationWarning عشان 0 د.أ */}
      <div suppressHydrationWarning className="text-center text-xs py-1 bg-gray-50">التوصيل 0 د.أ</div>
    </header>
  )
}

export default SiteHeader
