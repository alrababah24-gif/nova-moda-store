"use client"
import { useEffect } from "react"

export default function FacebookViewContent({ 
  productId, 
  productName, 
  value, 
  currency = "JOD" 
}: { 
  productId: string
  productName: string
  value: number
  currency?: string
}) {
  useEffect(() => {
    const fire = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "ViewContent", {
          content_ids: [productId],
          content_name: productName,
          content_type: "product",
          value: value,
          currency: currency,
        })
        console.log("✅ ViewContent fired:", productId)
        return true
      }
      return false
    }

    // حاول فوراً
    if (!fire()) {
      // لو fbq لسه ما حمل، استنى
      const interval = setInterval(() => {
        if (fire()) clearInterval(interval)
      }, 500)
      setTimeout(() => clearInterval(interval), 10000)
      return () => clearInterval(interval)
    }
  }, [productId, productName, value, currency])

  return null
}
