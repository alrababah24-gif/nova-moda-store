// @ts-nocheck
// EMERGENCY - هيدر بدون سلة عشان ما يوقع الموقع
"use client"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/" className="font-bold text-xl tracking-tight">Nova Moda</Link>
        <div className="flex gap-6 text-sm">
          <Link href="/products">المنتجات</Link>
          <Link href="/cart">السلة</Link>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
