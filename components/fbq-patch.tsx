// @ts-nocheck
// باتش يركب قبل ما يتحمل فيسبوك - بحل Invalid currency نهائيا
"use client"
import { useEffect } from "react"

export default function FbqPatch() {
  useEffect(() => {
    // حاول فورا
    const install = () => {
      // @ts-ignore
      const fbq = window.fbq
      if (!fbq || fbq._patched_v3) return true
      const original = fbq
      const patched: any = function(...args: any[]) {
        try {
          if (args[0] === 'track' && args[2] && typeof args[2] === 'object') {
            // PageView ممنوع يكون معه currency
            if (args[1] === 'PageView') {
              delete args[2].currency
              delete args[2].value
            }
            // اي عملة غير USD حولها USD
            if (args[2].currency) {
              const c = String(args[2].currency).trim().toUpperCase()
              if (c !== 'USD') {
                console.log(`🔧 Fixed currency ${c} -> USD for ${args[1]}`)
                args[2].currency = 'USD'
              }
            }
            if (args[2].value != null) {
              args[2].value = Number(Number(args[2].value).toFixed(2))
            }
          }
          return original.apply(this, args)
        } catch(e) {
          return original.apply(this, args)
        }
      }
      patched._patched_v3 = true
      // انسخ كل الخصائص
      for (const k in original) patched[k] = original[k]
      patched.loaded = original.loaded
      patched.version = original.version
      patched.queue = original.queue
      // @ts-ignore
      window.fbq = patched
      console.log('✅ fbq patched v3 - JOD blocked')
      return true
    }

    // جرب كل 20ms لمدة 15 ثانية
    let tries = 0
    const id = setInterval(() => {
      tries++
      if (install() || tries > 750) clearInterval(id)
    }, 20)

    return () => clearInterval(id)
  }, [])

  // سكريبت يشتغل حتى قبل الـ React
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            try{
              var origQ = window._fbq || [];
              var patchFn = function(fbq){
                if(!fbq || fbq._patched_v3) return;
                var orig = fbq;
                var patched = function(){
                  var a = Array.prototype.slice.call(arguments);
                  try{
                    if(a[0]==='track' && a[2] && typeof a[2]==='object'){
                      if(a[1]==='PageView'){ delete a[2].currency; delete a[2].value; }
                      if(a[2].currency){
                        var c = String(a[2].currency).toUpperCase().trim();
                        if(c!=='USD'){ a[2].currency='USD'; }
                      }
                      if(a[2].value!=null){ a[2].value = Number(Number(a[2].value).toFixed(2)); }
                    }
                  }catch(e){}
                  return orig.apply(this,a);
                };
                patched._patched_v3=true;
                for(var k in orig) patched[k]=orig[k];
                window.fbq = patched;
              };
              // راقب fbq
              Object.defineProperty(window, 'fbq', {
                get: function(){ return this._fbq_inst; },
                set: function(v){ this._fbq_inst=v; patchFn(v); },
                configurable:true
              });
            }catch(e){}
          })();
        `,
      }}
    />
  )
}
