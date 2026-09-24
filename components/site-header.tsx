// @ts-nocheck
// EMERGENCY - بيرجع الموقع أونلاين فورا
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
  setIsOpen: () => {},
  isOpen: false,
  open: false,
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

  const value = {
    items,
    cartItems: items,
    count,
    total,
    subtotal: total,
    totalPrice: total,
    mounted,
    isOpen,
    open: isOpen,
    setIsOpen,
    setOpen: setIsOpen,
    addToCart: (p: any, size?: string, qty = 1) => {
      setItems(prev => [...prev, { ...p, selectedSize: size, qty, quantity: qty }])
      setIsOpen(true)
    },
    removeFromCart: (id: string) => setItems(prev => prev.filter(it => String(it.id) !== String(id))),
    updateQty: () => {},
    clearCart: () => setItems([]),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}

export default CartProvider
