// @ts-nocheck
// FINAL - يعرض JOD للزبون ويرسل USD للبيكسل عشان يطفي Invalid currency
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "./cart-provider"

export function ProductDetailClient({ product }: any) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const { addToCart } = useCart() || { addToCart: () => {} }

  const images = (product?.images || []).filter(Boolean)

  // ViewContent - نعرض JOD بس نبعث USD للبيكسل
  useEffect(() => {
    if (!product?.id) return
    try {
      const priceNum = Number(product.price || 0)
      if (!priceNum) return
      // @ts-ignore
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
          content_ids: [String(product.id)],
          content_type: 'product',
          value: Number(priceNum.toFixed(2)), // USD بفاصلة 2
          currency: 'USD' // USD عشان فيسبوك ما يعطي Invalid
        })
        console.log(`✅ ViewContent fired JOD-display / USD-pixel ${product.id} ${priceNum}`)
      }
    } catch {}
  }, [product?.id])

  return (
    <div className="max-w-7xl mx-auto p-4" suppressHydrationWarning>
      <Link href="/products" className="text-sm text-gray-500">← رجوع للمنتجات</Link>
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="space-y-3">
          {images.length > 0 ? images.map((src: string, i: number) => {
            if (failed[src]) return null
            return <img key={i} src={src} alt={product?.name} className="w-full rounded-2xl bg-gray-50" onError={()=>setFailed(p=>({...p,[src]:true}))} />
          }) : <div className="h-[400px] bg-gray-100 rounded-2xl" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product?.name}</h1>
          {/* العرض للزبون JOD */}
          <div className="text-xl mt-3 font-bold">{Number(product?.price||0).toFixed(3)} JOD</div>
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
          <button onClick={()=>{ if(product?.sizes?.length && !selectedSize){ alert('اختاري المقاس'); return; } addToCart(product, selectedSize, 1)}} className="mt-8 w-full h-12 rounded-full bg-black text-white">أضف للسلة - {Number(product?.price||0).toFixed(3)} JOD</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailClient
