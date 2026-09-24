"use client"
import { useEffect } from "react"

export default function FacebookViewContent(props: any) {
  const fire = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      const p = props.product || props
      const cleanId = String(p.id || p.product_id || "").trim()
      if (!cleanId) return false

      const prodName = p.name || p.title || cleanId
      const priceVal = Number(p.price ?? 0)

      // استخدم USD عشان فيسبوك ما يعطي تحذير Invalid currency
      ;(window as any).fbq('track', 'ViewContent', {
        content_ids: [cleanId],
        content_type: 'product',
        content_name: String(prodName),
        value: Number(priceVal.toFixed(2)),
        currency: 'USD',
      })
      console.log("✅ ViewContent fired:", cleanId, priceVal)
      return true
    }
    return false
  }

  useEffect(() => {
    if (!fire()) {
      const interval = setInterval(() => {
        if (fire()) clearInterval(interval)
      }, 500)
      setTimeout(() => clearInterval(interval), 10000)
      return () => clearInterval(interval)
    }
  }, [props.product, props.id])

  return null
}
