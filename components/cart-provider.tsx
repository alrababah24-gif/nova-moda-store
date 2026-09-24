// @ts-nocheck
"use client"
import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext<any>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // مهم جدا لحل React #418 - لا تقرأ localStorage إلا بعد ما يصير mounted
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("cart")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch {}
  }, [items, mounted])

  const addToCart = (product: any, size?: string, qty = 1) => {
    setItems((prev) => {
      const id = String(product.id || product.product_id)
      const existingIdx = prev.findIndex((p) => String(p.id) === id && (p.selectedSize || p.size) === size)
      if (existingIdx >= 0) {
        const copy = [...prev]
        copy[existingIdx] = { ...copy[existingIdx], qty: (copy[existingIdx].qty || 1) + qty }
        return copy
      }
      return [...prev, { ...product, id, qty, selectedSize: size, size }]
    })
    setIsOpen(true)
  }

  const removeFromCart = (id: string, size?: string) => {
    setItems((prev) => prev.filter((p) => !(String(p.id) === String(id) && (size ? (p.selectedSize || p.size) === size : true))))
  }

  const updateQty = (id: string, qty: number, size?: string) => {
    if (qty <= 0) return removeFromCart(id, size)
    setItems((prev) => prev.map((p) => (String(p.id) === String(id) && (size ? (p.selectedSize || p.size) === size : true) ? { ...p, qty } : p)))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0)
  const count = items.reduce((s, it) => s + (Number(it.qty) || 1), 0)

  // توافق مع كل الأسماء القديمة عشان ما يفشل البناء
  const value: any = {
    items,
    cart: items,
    addToCart,
    addItem: addToCart,
    add: addToCart,
    removeFromCart,
    removeItem: removeFromCart,
    remove: removeFromCart,
    updateQty,
    updateQuantity: updateQty,
    total,
    subtotal: total,
    count,
    cartCount: count,
    isOpen,
    open: isOpen,
    isCartOpen: isOpen,
    setIsOpen,
    setOpen: setIsOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    clearCart,
    mounted,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
