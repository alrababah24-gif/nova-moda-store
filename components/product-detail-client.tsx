// @ts-nocheck
// EMERGENCY - صفحة منتج بدون بيكسل وبدون مشاكل ImageKit
"use client"
import { useState } from "react"
import Link from "next/link"

export function ProductDetailClient({ product }: any) {
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const images = product?.images || product?.image_urls || product?.imageUrl ? [product.imageUrl] : []
  const finalImages = Array.isArray(images) && images.length ? images : (product?.images || [])

  const price = product?.price || 0

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Link href="/products" className="text-sm text-gray-500">← رجوع</Link>
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="space-y-3">
          {finalImages.length > 0 ? finalImages.map((src: string, i: number) => {
            if (!src || failed[src]) return null
            return (
              <img
                key={i}
                src={src}
                alt={product?.name || 'product'}
                className="w-full rounded-2xl bg-gray-50"
                onError={() => setFailed(p => ({...p, [src]: true}))}
              />
            )
          }) : <div className="h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center">لا يوجد صور</div>}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product?.name || 'منتج'}</h1>
          <div className="text-xl mt-3 font-bold">{price} JOD</div>
          <p className="mt-6 text-sm text-gray-600 whitespace-pre-line">{product?.description || ''}</p>
          <button className="mt-8 w-full h-12 rounded-full bg-black text-white">أضف للسلة</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailClient
