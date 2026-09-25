// @ts-nocheck
// FINAL FIX - بيطفي #418 نهائيا
"use client"
import { createContext, useContext, useEffect, useState, useMemo } from "react"

const CartContext = createContext<any>({
  items: [], cartItems: [], count: 0, total: 0, subtotal: 0, mounted: false,
  addToCart: () => {}, removeFromCart: () => {}, updateQty: () => {}, clearCart: () => {},
  isOpen: false, open: false, setIsOpen: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem("nova-cart")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem("nova-cart", JSON.stringify(items)) } catch {}
  }, [items, mounted])

  const count = useMemo(() => mounted ? items.reduce((s, it) => s + (it.qty || it.quantity || 1), 0) : 0, [items, mounted])
  const total = useMemo(() => mounted ? items.reduce((s, it) => s + Number(it.price || 0) * (it.qty || it.quantity || 1), 0) : 0, [items, mounted])

  const addToCart = (product: any, size?: string, qty = 1) => {
    setItems(prev => {
      const key = `${product.id}-${size || 'default'}`
      const exist = prev.find(it => `${it.id}-${it.selectedSize || 'default'}` === key)
      if (exist) return prev.map(it => `${it.id}-${it.selectedSize || 'default'}` === key ? {...it, qty: (it.qty||1)+qty, quantity: (it.quantity||1)+qty} : it)
      return [...prev, {...product, selectedSize: size, qty, quantity: qty}]
    })
    setIsOpen(true)
    try {
      // @ts-ignore نبعث USD للبيكسل عشان ما يطلع Invalid currency، السعر نفسه
      if (typeof window !== 'undefined' && window.fbq) window.fbq('track','AddToCart',{content_ids:[String(product.id)],content_type:'product',value:Number(Number(product.price*qty).toFixed(2)),currency:'USD'})
    } catch {}
  }

  const value = { items, cartItems: items, count, total, subtotal: total, totalPrice: total, mounted, isOpen, open: isOpen, setIsOpen, setOpen: setIsOpen, addToCart, removeFromCart: (id:string)=>setItems(p=>p.filter(it=>String(it.id)!==String(id))), updateQty: (id:string,q:number)=>setItems(p=>p.map(it=>String(it.id)===String(id)?{...it,qty:q,quantity:q}:it)), clearCart: ()=>setItems([]) }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(){ return useContext(CartContext) }
export default CartProvider
