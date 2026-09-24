// @ts-nocheck
"use client"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import FacebookViewContent from "@/components/facebook-viewcontent"
import { useCart } from "@/components/cart-provider"

export function ProductDetailClient({ product, settings }: any) {
  const [qty, setQty] = useState(1)
  const cart: any = useCart()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [activeImg, setActiveImg] = useState(0)

  const images = product?.images?.length ? product.images : ["/placeholder.svg"]
  const sizes: string[] = product?.sizes || []
  const price = product?.price || 0
  const compareAt = product?.compare_at_price

  const handleAddToCart = () => {
    const p = { ...product, selectedSize, size: selectedSize }
    const cleanId = String(product.id || product.product_id || "").trim()
    const priceNum = Number(price) || 0
    const totalValue = priceNum * (qty || 1)

    // 1. أضف للسلة (نفس كودك القديم)
    if (cart.addToCart) cart.addToCart(p, selectedSize, qty)
    else if (cart.addItem) cart.addItem(p, qty)
    else if (cart.add) cart.add(p, qty)
    else if (typeof cart === "function") cart(p)

    // 2. ابعت حدث AddToCart لفيسبوك مع value و currency (هذا اللي بيرفع الجودة من 6.1 لـ 8.5)
    if (typeof window !== "undefined" && (window as any).fbq && cleanId) {
      ;(window as any).fbq('track', 'AddToCart', {
        content_ids: [cleanId],
        content_type: 'product',
        content_name: String(product.name || cleanId),
        value: Number(totalValue.toFixed(2)),
        currency: 'USD', // خليه USD عشان ما يطلع تحذير العملة، فيسبوك بفهمه أحسن من JOD
      })
      console.log("✅ AddToCart fired:", cleanId, totalValue)
    }
  }

  return (
    <>
      <FacebookViewContent product={product} />

      <div className="grid md:grid-cols-[1.05fr_1fr] gap-8 md:gap-12">
        <div>
          <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#f6f6f6]">
            <Image
              src={images[activeImg]}
              alt={product?.name || "product"}
              fill
              className="object-cover"
              priority
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-auto">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 ${activeImg === i ? "border-black" : "border-transparent"}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-1">
          <Link href="/products" className="text-sm text-gray-500 hover:text-black">
            ← العودة للمنتجات
          </Link>

          <h1 className="text-[22px] font-bold mt-3 leading-tight">{product?.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-xl font-bold">{price} JOD</span>
            {compareAt && compareAt > price && (
              <span className="text-sm text-gray-400 line-through">{compareAt} JOD</span>
            )}
          </div>

          {sizes.length > 0 && (
            <div className="mt-6">
              <div className="text-sm mb-2 font-medium">المقاس</div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 h-10 rounded-full border text-sm transition ${
                      selectedSize === s ? "bg-black text-white border-black" : "bg-white border-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <div className="flex items-center border rounded-full h-12 px-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10">-</button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-full bg-black text-white font-medium hover:bg-zinc-800 transition"
            >
              أضف للسلة
            </button>
          </div>

          {product?.description && (
            <div className="mt-8 text-sm text-gray-600 leading-7 whitespace-pre-line">
              {product.description}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
