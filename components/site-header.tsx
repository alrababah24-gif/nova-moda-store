// @ts-nocheck
// FINAL JOD - هيدر كامل مع عدد السلة وما بوقع #130
"use client"
import Link from "next/link"
import { useCart } from "./cart-provider"

export function SiteHeader() {
  let count = 0
  let mounted = false
  try {
    const cart = useCart()
    count = cart?.count || 0
    mounted = cart?.mounted || false
  } catch { mounted = false }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/" className="font-bold text-xl tracking-tight">Nova Moda</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:opacity-60">المنتجات</Link>
          <Link href="/cart" className="relative hover:opacity-60">
            السلة
            {mounted && count > 0 && <span className="absolute -top-2 -right-3 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
