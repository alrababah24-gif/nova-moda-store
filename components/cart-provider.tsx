// @ts-nocheck
// FINAL JOD - فيه السلة كاملة + ما بوقع #418
"use client"
import { createContext, useContext, useEffect, useState, useMemo } from "react"

const CartContext = createContext<any>({
  items: [],
  cartItems: [],
  count: 0,
  total: 0,
  subtotal: 0,
  mounted: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  isOpen: false,
  open: false,
  setIsOpen: () => {},
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
    try {
      localStorage.setItem("nova-cart", JSON.stringify(items))
    } catch {}
  }, [items, mounted])

  const count = useMemo(() => items.reduce((s, it) => s + (it.qty || it.quantity || 1), 0), [items])
  const total = useMemo(() => items.reduce((s, it) => s + Number(it.price || 0) * (it.qty || it.quantity || 1), 0), [items])

  const addToCart = (product: any, size?: string, qty = 1) => {
    const id = `${product.id}-${size || 'default'}`
    setItems(prev => {
      const exist = prev.find(it => `${it.id}-${it.selectedSize || 'default'}` === id)
      if (exist) return prev.map(it => `${it.id}-${it.selectedSize || 'default'}` === id ? {...it, qty: (it.qty||1)+qty, quantity: (it.quantity||1)+qty} : it)
      return [...prev, {...product, selectedSize: size, qty, quantity: qty}]
    })
    setIsOpen(true)
    
    // Facebook Pixel - JOD صحيح 3 خانات
    try {
      const val = Number(Number(product.price * qty).toFixed(3))
      // @ts-ignore
      if (typeof window !== 'undefined' && window.fbq) window.fbq('track','AddToCart',{content_ids:[String(product.id)],content_type:'product',value:val,currency:'JOD'})
    } catch {}
  }

  const removeFromCart = (id: string) => setItems(prev => prev.filter(it => String(it.id) !== String(id)))
  const clearCart = () => setItems([])

  const value = {
    items, cartItems: items, count, total, subtotal: total, totalPrice: total,
    mounted, isOpen, open: isOpen, setIsOpen, setOpen: setIsOpen,
    addToCart, removeFromCart, updateQty: (id:string,qty:number)=>setItems(prev=>prev.map(it=>String(it.id)===String(id)?{...it,qty,quantity:qty}:it)), clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}

export default CartProvider
