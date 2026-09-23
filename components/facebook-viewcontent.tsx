"use client"

import { useEffect } from "react"

type Props = {
  productId: string
  productName: string
  value: number
  currency?: string
}

export default function FacebookViewContent({ productId, productName, value, currency = "JOD" }: Props) {
  useEffect(() => {
    const fire = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        // تأكد القيمة رقم والعملة 3 أحرف كابيتال
        const cleanValue = Number(value) || 0
        const cleanCurrency = (currency || "JOD").toUpperCase().trim()
        const cleanId = String(productId).trim()

        if (!cleanId) return false

        ;(window as any).fbq("track", "ViewContent", {
          content_ids: [cleanId],
          content_name: String(productName || ""),
          content_type: "product",
          value: cleanValue,
          currency: cleanCurrency,
        })
        console.log("✅ ViewContent fired:", cleanId, cleanValue, cleanCurrency)
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
