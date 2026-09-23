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
    const checkFbq = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "ViewContent", {
          content_ids: [productId],
          content_name: productName,
          content_type: "product",
          value: value,
          currency: currency,
        });
        clearInterval(checkFbq);
      }
    }, 500);

    setTimeout(() => clearInterval(checkFbq), 10000);

    return () => clearInterval(checkFbq);
  }, [productId, productName, value, currency])

  return null
}
