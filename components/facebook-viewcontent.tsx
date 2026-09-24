// @ts-nocheck
"use client"
import { useEffect } from "react"

// ملف واحد لكل البيكسل - بيمنع Invalid currency نهائيا
export default function FacebookPixelGlobal() {
  useEffect(() => {
    if (typeof window === "undefined") return
    // @ts-ignore
    if (!window.fbq) return
    try {
      // PageView بدون currency أبدا
      // @ts-ignore
      window.fbq('track', 'PageView')
      console.log("✅ PageView fired")
    } catch {}
  }, [])
  return null
}

// دالة موحدة لكل الأحداث - تدعم JOD و USD
export function trackFbEvent(name: string, data: any = {}) {
  if (typeof window === "undefined") return
  // @ts-ignore
  if (!window.fbq) return

  let payload: any = { ...data }

  // إذا في currency تأكد انه Uppercase وبدون مسافة
  if (payload.currency) {
    payload.currency = String(payload.currency).trim().toUpperCase()
    // JOD لازم 3 خانات - حول القيمة
    if (payload.currency === 'JOD' && typeof payload.value === 'number') {
      payload.value = Number(payload.value.toFixed(3))
    }
    // لو القيمة نص حولها لرقم
    if (typeof payload.value === 'string') {
      payload.value = Number(payload.value)
    }
  }

  // @ts-ignore
  window.fbq('track', name, payload)
  console.log(`✅ ${name} fired`, payload.currency || '', payload.value || '')
}
