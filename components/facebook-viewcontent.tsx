"use client"
import { useEffect } from "react"

type Props = {
  id?: string | number
  name?: string
  price?: number | string
  product_id?: string | number
  productName?: string
  value?: number
  currency?: string
  product?: any
}

export default function FacebookViewContent(props: Props) {
  const fire = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      // يدعم الطريقتين: <FacebookViewContent product={product} /> أو <FacebookViewContent id={...} />
      const p = props.product || props
      const rawId = p.id || p.product_id || props.id || props.product_id || ""
      const cleanId = String(rawId).trim()
      if (!cleanId) return false

      const prodName = p.name || p.productName || p.title || props.name || props.productName || cleanId
      const priceVal = Number(p.price ?? p.value ?? props.price ?? props.value ?? 0)

      ;(window as any).fbq('track', 'ViewContent', {
        content_ids: [cleanId],
        content_type: 'product',
        content_name: String(prodName),
        value: priceVal,
        currency: p.currency || props.currency || 'JOD'
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
  }, [props.id, props.product_id, props.name, props.productName, props.price, props.value, props.product])

  return null
}
