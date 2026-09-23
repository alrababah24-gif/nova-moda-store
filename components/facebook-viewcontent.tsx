"use client"
import { useEffect } from "react"

export default function FacebookViewContent(props: any) {
  // يقبل أي اسم للـ props عشان ما يفشل الـ Build
  const productId = props.productId || props.id || props.content_id || "unknown"
  const productName = props.productName || props.name || props.content_name || ""
  const value = props.value || props.price || 0
  const currency = props.currency || "JOD"

  useEffect(() => {
    const fire = () => {
      // @ts-ignore
      if (typeof window !== "undefined" && window.fbq) {
        // @ts-ignore
        window.fbq("track", "ViewContent", {
          content_ids: [productId],
          content_name: productName,
          content_type: "product",
          value: Number(value),
          currency: currency,
        })
        console.log("✅ ViewContent fired:", productId)
        return true
      }
      return false
    }

    if (!fire()) {
      const interval = setInterval(() => {
        if (fire()) clearInterval(interval)
      }, 500)
      setTimeout(() => clearInterval(interval), 10000)
      return () => clearInterval(interval)
    }
  }, [productId, productName, value, currency])

  return null
}
