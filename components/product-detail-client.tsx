// @ts-nocheck
"use client"
import { useState } from "react"

export default function ProductDetailClientFINAL({ product }: any) {
  const [imgError, setImgError] = useState<Record<string, boolean>>({})
  const images = product?.images || product?.image_urls || []

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        {images.map((img: string, i: number) => {
          if (imgError[img]) return null
          // استخدم img عادي بدل Next Image عشان ImageKit 400 ما يوقف الصفحة
          return (
            <img
              key={i}
              src={img}
              alt={product?.name || 'product'}
              className="w-full h-auto object-cover rounded"
              loading="lazy"
              onError={() => setImgError(prev => ({ ...prev, [img]: true }))}
            />
          )
        })}
        {images.length === 0 && (
          <div className="bg-gray-100 h-[400px] flex items-center justify-center">لا يوجد صور</div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product?.name}</h1>
        <p className="text-xl mt-2">{product?.price} {product?.currency || 'JOD'}</p>
      </div>
    </div>
  )
}
