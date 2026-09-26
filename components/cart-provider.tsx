// @ts-nocheck
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react"

type CartItem = {
  id: string
  name?: string
  price?: number
  images?: string[]
  image?: string
  size?: string
  selectedSize?: string
  qty?: number
  quantity?: number
  [key: string]: any
}

type CartContextValue = {
  items: CartItem[]
  cartItems: CartItem[]
  count: number
  total: number
  subtotal: number
  totalPrice: number
  open: boolean
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  setOpen: (v: boolean) => void
  addToCart: (product: any, size?: string, qty?: number) => void
  addItem: (product: any, qty?: number) => void
  add: (product: any, qty?: number) => void
  removeFromCart: (id: string, size?: string) => void
  removeItem: (id: string, size?: string) => void
  updateQty: (id: string, qty: number, size?: string) => void
  clearCart: () => void
  clear: () => void
  [key: string]: any
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nova-cart")

      if (raw) {
        const parsed = JSON.parse(raw)

        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch {}

    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      localStorage.setItem(
        "nova-cart",
        JSON.stringify(items)
      )
    } catch {}
  }, [items, mounted])

  const addToCart = (
    product: any,
    size?: string,
    qty: number = 1
  ) => {
    const cleanId = String(
      product.id || product.product_id || ""
    )

    const selSize =
      size ||
      product.selectedSize ||
      product.size ||
      ""

    setItems((prev) => {
      const idx = prev.findIndex(
        (it) =>
          String(it.id) === cleanId &&
          (it.selectedSize || it.size || "") === selSize
      )

      if (idx > -1) {
        const next = [...prev]

        const curQty =
          next[idx].qty ||
          next[idx].quantity ||
          1

        next[idx] = {
          ...next[idx],
          qty: curQty + qty,
          quantity: curQty + qty,
        }

        return next
      }

      return [
        ...prev,
        {
          ...product,
          id: cleanId,
          selectedSize: selSize,
          size: selSize,
          qty,
          quantity: qty,
        },
      ]
    })

    setIsOpen(true)
  }

  const removeFromCart = (
    id: string,
    size?: string
  ) => {
    setItems((prev) =>
      prev.filter((it) => {
        if (String(it.id) !== String(id)) {
          return true
        }

        if (
          size &&
          (it.selectedSize || it.size) !== size
        ) {
          return true
        }

        if (!size) {
          return false
        }

        return false
      })
    )
  }

  const updateQty = (
    id: string,
    qty: number,
    size?: string
  ) => {
    if (qty < 1) {
      removeFromCart(id, size)
      return
    }

    setItems((prev) =>
      prev.map((it) => {
        if (String(it.id) !== String(id)) {
          return it
        }

        if (
          size &&
          (it.selectedSize || it.size || "") !== size
        ) {
          return it
        }

        return {
          ...it,
          qty,
          quantity: qty,
        }
      })
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const { count, total } = useMemo(() => {
    let c = 0
    let t = 0

    for (const it of items) {
      const q =
        it.qty ||
        it.quantity ||
        1

      const p = Number(
        it.price || 0
      )

      c += q
      t += p * q
    }

    return {
      count: c,
      total: t,
    }
  }, [items])

  const value: any = {
    items,
    cartItems: items,

    count,
    total,

    subtotal: total,
    totalPrice: total,
    cartTotal: total,

    open: isOpen,
    isOpen,

    setIsOpen,
    setOpen: setIsOpen,

    addToCart,

    addItem: (
      p: any,
      q = 1
    ) =>
      addToCart(
        p,
        p?.selectedSize ||
          p?.size,
        q
      ),

    add: (
      p: any,
      q = 1
    ) =>
      addToCart(
        p,
        p?.selectedSize ||
          p?.size,
        q
      ),

    removeFromCart,
    removeItem: removeFromCart,

    updateQty,

    clearCart,

    // مهم: checkout-form يستخدم clear()
    clear: clearCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)

  if (!ctx) {
    throw new Error(
      "useCart must be used within CartProvider"
    )
  }

  return ctx
}
