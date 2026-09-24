// @ts-nocheck
"use client"
import { useCart } from "./cart-provider"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default function SiteHeader() {
  const cart = useCart() as any
  const count = cart?.count ?? cart?.cartCount ?? 0
  const mounted = cart?.mounted ?? false

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">Nova Moda</Link>
        <Link href="/cart" className="relative">
          <ShoppingBag className="h-6 w-6" />
          {/* مهم جدا لحل React #418 - لا تعرض العدد إلا بعد التحميل */}
          <span suppressHydrationWarning className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {mounted ? count : 0}
          </span>
        </Link>
      </div>
    </header>
  )
}
