// @ts-nocheck
"use client"
import { useEffect } from "react"

export default function FacebookViewContent({ product }: any) {
  useEffect(() => {
    if (!product) return
    const id = String(product.id || product.product_id || "").trim()
    if (!id) return
    const price = Number(product.price || 0)
    const name = String(product.name || id)

    // نتأكد انه البيكسل جاهز
    const tryFire = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        ;(window as any).fbq('track', 'ViewContent', {
          content_ids: [id],
          content_type: 'product',
          content_name: name,
          value: Number(price.toFixed(2)),
          currency: 'USD', // مهم: USD وليس JOD عشان يروح تحذير Invalid currency
        })
        console.log("✅ ViewContent fired:", id, price)
      }
    }

    // جرب فورا وبعد شوي عشان نتأكد ان fbq حمل
    tryFire()
    const t = setTimeout(tryFire, 1000)
    return () => clearTimeout(t)
  }, [product])

  return null
}
