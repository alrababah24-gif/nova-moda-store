"use client"
import { useEffect } from "react"

export default function MetaPixel() {
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // @ts-ignore
    if (window.fbq) return

    // تحميل فيسبوك بيكسل
    // @ts-ignore
    !(function(f:any,b:any,e:any,v:any,n:any,t:any,s:any){
      if(f.fbq) return
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}
      if(!f._fbq) f._fbq=n
      n.push=n
      n.loaded=!0
      n.version='2.0'
      n.queue=[]
      t=b.createElement(e)
      t.async=!0
      t.src=v
      s=b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t,s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

    // @ts-ignore
    window.fbq('init', '1676852253417182')
    // @ts-ignore
    window.fbq('track', 'PageView')
    console.log("✅ PageView fired")
  }, [])

  return null
}

