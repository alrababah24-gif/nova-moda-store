// @ts-nocheck
// FINAL - JOD للزبون و JOD للبيكسل والكتالوج - عشان يطابق 100%
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "./cart-provider"

export function ProductDetailClient({ product }: any) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const { addToCart } = useCart() || { addToCart: () => {} }

  const images = (product?.images || []).filter(Boolean)
  const priceJOD = Number(product?.price || 0)

  // ViewContent - JOD
  useEffect(() => {
    if (!product?.id ||!priceJOD) return
    try {
      // @ts-ignore
      if (typeof window!== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
          content_ids: [String(product.id)], // لازم يطابق id في الكتالوج 100%
          content_type: 'product',
          value: Number(priceJOD.toFixed(3)), // JOD = 3 خانات
          currency: 'JOD' // نفس عملة الكتالوج
        })
      }
    } catch {}
  }, [product?.id, priceJOD])

  const handleAddToCart = () => {
    if(product?.sizes?.length &&!selectedSize){
      alert('اختاري المقاس');
      return;
    }
    addToCart(product, selectedSize, 1)

    try {
      // @ts-ignore
      if (typeof window!== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [String(product.id)],
          content_type: 'product',
          value: Number(priceJOD.toFixed(3)),
          currency: 'JOD'
        })
      }
    } catch {}
  }

  return (
    <div className="max-w-7xl mx-auto p-4" suppressHydrationWarning>
      <Link href="/products" className="text-sm text-gray-500">← رجوع للمنتجات</Link>
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="space-y-3">
          {images.length > 0? images.map((src: string, i: number) => {
            if (failed[src]) return null
            return <img key={i} src={src} alt={product?.name} className="w-full rounded-2xl bg-gray-50" onError={()=>setFailed(p=>({...p,[src]:true}))} />
          }) : <div className="h- bg-gray-100 rounded-2xl" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product?.name}</h1>
          <div className="text-xl mt-3 font-bold">{priceJOD.toFixed(3)} JOD</div>
          {product?.sizes?.length > 0 && (
            <div className="mt-6">
              <div className="text-sm mb-2">المقاس</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button key={s} onClick={()=>setSelectedSize(s)} className={`px-4 h-9 rounded-full border text-sm ${selectedSize===s?'bg-black text-white':'bg-white'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <p className="mt-6 text-sm text-gray-600 whitespace-pre-line">{product?.description||''}</p>
          <button onClick={handleAddToCart} className="mt-8 w-full h-12 rounded-full bg-black text-white">
            أضف للسلة - {priceJOD.toFixed(3)} JOD
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailClient