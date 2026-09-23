"use client"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import FacebookViewContent from "@/components/facebook-viewcontent"
import { useCart } from "@/components/cart-provider"

export function ProductDetailClient({ product, settings }: any) {
  const [size, setSize] = useState("")
  const [qty, setQty] = useState(1)
  const [img, setImg] = useState(0)
  const cart = useCart()

  const images = product?.images?.length ? product.images : ["/placeholder.svg"]
  const sizes = product?.sizes || []
  const price = product?.price || 0

  return (
    <>
      <FacebookViewContent
        productId={product?.slug || product?.id || "unknown"}
        productName={product?.name || ""}
        value={Number(price)}
        currency="JOD"
      />

      <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] p-6">
        <div>
          <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
            <Image src={images[img]} alt={product?.name || ""} fill className="object-cover" />
          </div>
          <div className="flex gap-2 mt-3 overflow-auto">
            {images.map((im: string, i: number) => (
              <button key={i} onClick={() => setImg(i)} className={`relative w-20 h-20 rounded-xl overflow-hidden border ${img===i?"border-black":"border-transparent"}`}>
                <Image src={im} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Link href="/products" className="text-sm text-gray-500">← العودة</Link>
          <h1 className="text-2xl font-bold mt-3">{product?.name}</h1>
          <div className="text-xl font-bold mt-2">{price} JOD</div>
          
          {sizes.length > 0 && (
            <div className="mt-6">
              <div className="text-sm mb-2">المقاس</div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s: string) => (
                  <button key={s} onClick={()=>setSize(s)} className={`px-4 h-10 rounded-full border text-sm ${size===s?"bg-black text-white":"bg-white"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <button onClick={()=>cart.addItem(product, size, "", qty)} className="mt-6 w-full h-12 bg-[#3D2B24] text-white rounded-full">
            أضيفي للسلة
          </button>
        </div>
      </div>
    </>
  )
}
