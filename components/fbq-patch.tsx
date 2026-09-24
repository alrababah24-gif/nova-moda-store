// @ts-nocheck
"use client"
import { useEffect } from "react"

export default function FbqPatch() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    let tries = 0
    const interval = setInterval(() => {
      tries++
      // @ts-ignore
      const fbq = window.fbq
      if (fbq && !fbq._patched) {
        const orig = fbq
        const patched: any = function(...args: any[]) {
          try {
            // لو في currency غلط حوله ل USD
            if (args[1] && args[2] && typeof args[2] === 'object' && args[2].currency) {
              let c = String(args[2].currency).toUpperCase().trim()
              // قائمة العملات اللي بيكسل فيسبوك بقبلها 100% بدون مشاكل
              const allowed = ['USD','EUR','GBP','CAD','AUD']
              if (!allowed.includes(c)) {
                args[2].currency = 'USD'
              }
              if (args[2].value != null) {
                args[2].value = Number(Number(args[2].value).toFixed(2))
              }
            }
            // PageView ما لازم يكون معه currency
            if (args[1] === 'PageView' && args[2] && args[2].currency) {
              delete args[2].currency
              delete args[2].value
            }
            return orig.apply(this, args)
          } catch (e) {
            return orig.apply(this, args)
          }
        }
        patched._patched = true
        // انسخ الخصائص
        Object.keys(orig).forEach(k => { patched[k] = orig[k] })
        // @ts-ignore
        window.fbq = patched
        console.log('✅ fbq patched - JOD -> USD')
        clearInterval(interval)
      }
      if (tries > 100) clearInterval(interval)
    }, 100)
    return () => clearInterval(interval)
  }, [])
  return null
}
