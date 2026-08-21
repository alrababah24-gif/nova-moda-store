"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const cart = useCart();
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.button aria-label="إغلاق السلة" className="fixed inset-0 z-[80] bg-[#241711]/35 backdrop-blur-[2px]" onClick={cart.close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            dir="rtl"
            className="fixed inset-y-0 left-0 z-[90] flex w-full max-w-[420px] flex-col bg-[var(--paper)] shadow-2xl"
            initial={reduce ? false : { x: "-100%" }} animate={{ x: 0 }} exit={reduce ? undefined : { x: "-100%" }}
            transition={{ type: "spring", stiffness: 310, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-[#F0E6DC] px-5 py-5">
              <div className="flex items-center gap-2"><ShoppingBag size={20}/><strong>سلة التسوق</strong><span className="rounded-full bg-[#F0E6DC] px-2 py-0.5 text-xs">{cart.count}</span></div>
              <button onClick={cart.close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label="إغلاق"><X size={19}/></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.items.length === 0 ? (
                <div className="grid min-h-[55vh] place-items-center text-center"><div><ShoppingBag className="mx-auto mb-4 opacity-25" size={44}/><p className="font-bold">سلتك فارغة</p><p className="mt-2 text-sm text-[#8C7A72]">اختاري العباية التي تناسبك وأضيفيها للسلة.</p><Link href="/shop" onClick={cart.close} className="mt-5 inline-flex rounded-full bg-[#3D2B24] px-5 py-2.5 text-sm font-bold text-white">تسوّقي الآن</Link></div></div>
              ) : (
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color ?? ""}`} className="flex gap-3 rounded-2xl border border-[#F0E6DC] bg-white p-3">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#FDF6F0]"><Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-1" /></div>
                      <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-bold leading-6">{item.name}</p><p className="mt-1 text-xs text-[#8C7A72]">المقاس: {item.size}{item.color ? ` • ${item.color}` : ""}{typeof item.maxStock === "number" ? ` • المتوفر ${item.maxStock}` : ""}</p><div className="mt-3 flex items-center justify-between gap-2"><strong className="text-sm">{formatPrice(item.price * item.qty)}</strong><div className="flex items-center gap-1"><button className="grid h-7 w-7 place-items-center rounded-full border border-[#F0E6DC]" onClick={() => cart.updateQty(item.productId,item.size,item.color,item.qty-1)}><Minus size={12}/></button><span className="w-6 text-center text-xs font-bold">{item.qty}</span><button disabled={typeof item.maxStock === "number" && item.qty >= Math.min(item.maxStock,10)} className="grid h-7 w-7 place-items-center rounded-full border border-[#F0E6DC] disabled:cursor-not-allowed disabled:opacity-30" onClick={() => cart.updateQty(item.productId,item.size,item.color,item.qty+1)}><Plus size={12}/></button><button className="mr-1 grid h-7 w-7 place-items-center rounded-full text-red-500" onClick={() => cart.removeItem(item.productId,item.size,item.color)} aria-label="حذف"><Trash2 size={13}/></button></div></div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.items.length > 0 && <div className="border-t border-[#F0E6DC] bg-white p-5"><div className="mb-4 flex items-center justify-between"><span className="text-sm text-[#8C7A72]">المجموع قبل التوصيل</span><strong>{formatPrice(cart.subtotal)}</strong></div><Link href="/checkout" onClick={cart.close} className="flex w-full items-center justify-center rounded-full bg-[#3D2B24] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#5A4035]">إتمام الطلب</Link></div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
