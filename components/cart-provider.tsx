"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (product: Product, size: string, color?: string, qty?: number) => void;
  updateQty: (productId: string, size: string, color: string | undefined, qty: number) => void;
  removeItem: (productId: string, size: string, color?: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nova_moda_cart_v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, size: string, color?: string, qty = 1) => {
    setItems((current) => {
      const index = current.findIndex((item) => item.productId === product.id && item.size === size && item.color === color);
      if (index >= 0) return current.map((item, i) => i === index ? { ...item, qty: Math.min(item.qty + qty, 10) } : item);
      return [...current, {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] || "/products/abaya-classic-beige.svg",
        price: product.price,
        size,
        color,
        qty,
      }];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((productId: string, size: string, color: string | undefined, qty: number) => {
    if (qty <= 0) {
      setItems((current) => current.filter((item) => !(item.productId === productId && item.size === size && item.color === color)));
      return;
    }
    setItems((current) => current.map((item) => item.productId === productId && item.size === size && item.color === color ? { ...item, qty: Math.min(qty, 10) } : item));
  }, []);

  const removeItem = useCallback((productId: string, size: string, color?: string) => {
    setItems((current) => current.filter((item) => !(item.productId === productId && item.size === size && item.color === color)));
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    isOpen,
    addItem,
    updateQty,
    removeItem,
    clear: () => setItems([]),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }), [items, isOpen, addItem, updateQty, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
