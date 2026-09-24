// @ts-nocheck
// FINAL JOD - صفحة منتج بتدعم JOD 3 خانات وما بتوقع الموقع
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "./cart-provider"

export function ProductDetailClient({ product }: any) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const { addToCart } = useCart() || { addToCart: () => {} }

  const images = product?.images || product?.image_urls || []
  const finalImages = Array.isArray(images) ? images.filter(Boolean) : []

  // Facebook Pixel ViewContent - JOD صحيح
  useEffect(() => {
    if (!product?.id) return
    try {
      const priceNum = Number(product.price || 0)
      if (!priceNum) return
      const value = Number(priceNum.toFixed(3)) // JOD لازم 3 خانات
      // @ts-ignore
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
          content_ids: [String(product.id)],
          content_type: 'product',
          value: value,
          currency: 'JOD'
        })
        console.log(`✅ ViewContent fired JOD ${product.id} ${value}`)
      }
    } catch {}
  }, [product?.id])

  const handleAdd = () => {
    if (product?.sizes?.length && !selectedSize) {
      alert("اختاري المقاس")
      return
    }
    addToCart(product, selectedSize, 1)
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Link href="/products" className="text-sm text-gray-500">← رجوع للمنتجات</Link>
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="space-y-3">
          {finalImages.length > 0 ? finalImages.map((src: string, i: number) => {
            if (!src || failed[src]) return null
            return (
              <img
                key={i}
                src={src}
                alt={product?.name || 'product'}
                className="w-full rounded-2xl bg-gray-50 object-cover"
                onError={() => setFailed(p => ({...p, [src]: true}))}
              />
            )
          }) : <div className="h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">لا يوجد صور</div>}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product?.name}</h1>
          <div className="text-xl mt-3 font-bold">{Number(product?.price || 0).toFixed(3)} JOD</div>
          {product?.sizes?.length > 0 && (
            <div className="mt-6">
              <div className="text-sm mb-2">المقاس</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 h-9 rounded-full border text-sm ${selectedSize===s?'bg-black text-white border-black':'bg-white'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <p className="mt-6 text-sm text-gray-600 whitespace-pre-line">{product?.description || ''}</p>
          <button onClick={handleAdd} className="mt-8 w-full h-12 rounded-full bg-black text-white font-medium">أضف للسلة</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailClient
