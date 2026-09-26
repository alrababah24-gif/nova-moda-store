// @ts-nocheck
// FINAL - JOD للزبون و JOD للبيكسل والكتالوج - عشان يطابق 100%
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import FacebookViewContent from "@/components/facebook-viewcontent"
import { useCart } from "@/components/cart-provider"
import { imageKitUrl } from "@/lib/utils"

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
    <>
      <FacebookViewContent product={product} />
      <div className="grid md:grid-cols-[1.05fr_1fr] gap-8">
        <div>
          <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#f6f6f6]">
            {mounted && (
              <Image
                src={imageKitUrl(images[activeImg], 1600)}
                alt={product?.name || "product"}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            )}
          </div>
          {mounted && images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-auto">
              {images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 ${activeImg===i ? "border-black":"border-transparent"}`}>
                  <Image src={imageKitUrl(img, 200)} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-1">
          <Link href="/shop" className="text-sm text-gray-500">← العودة للمنتجات</Link>
          <h1 className="text-[22px] font-bold mt-3">{product?.name}</h1>
          <div className="mt-3 flex gap-3">
            <span className="text-xl font-bold">{price} JOD</span>
            {compareAt > price && <span className="text-sm text-gray-400 line-through">{compareAt} JOD</span>}
          </div>
          {sizes.length > 0 && (
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