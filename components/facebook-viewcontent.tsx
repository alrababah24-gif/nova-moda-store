// @ts-nocheck
"use client"
import { useEffect } from "react"
export default function FacebookViewContent({ product }: any) {
  useEffect(() => {
    if (typeof window === "undefined") return
    const fbq = (window as any).fbq
    if (!fbq) return
    const cleanId = String(product?.id || product?.product_id || "").trim()
    const price = Number(product?.price) || 0
    if (!cleanId) return
    fbq('track', 'ViewContent', {
      content_ids: [cleanId],
      content_type: 'product',
      content_name: String(product?.name || cleanId).slice(0,100),
      value: Number(price.toFixed(2)),
      currency: 'USD',
    })
    console.log("ViewContent fired USD", cleanId, price)
  }, [product?.id])
  return null
}
