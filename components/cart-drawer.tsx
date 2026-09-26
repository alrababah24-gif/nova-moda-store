// @ts-nocheck
"use client"

import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { useCart } from "./cart-provider"

const formatPrice = (value: number) =>
  `${Number(value || 0).toFixed(3)} JOD`

export function CartDrawer() {
  const cart = useCart()
  const reduce = useReducedMotion()

  const closeCart = () => {
    cart.setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          {/* الخلفية */}
          <motion.button
            aria-label="إغلاق السلة"
            className="fixed inset-0 z-[80] bg-[#241711]/35 backdrop-blur-[2px]"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* السلة */}
          <motion.aside
            dir="rtl"
            className="fixed inset-y-0 left-0 z-[90] flex w-full max-w-[420px] flex-col bg-[var(--paper)] shadow-2xl"
            initial={reduce ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 310,
              damping: 32,
            }}
          >
            {/* الرأس */}
            <div className="flex items-center justify-between border-b border-[#F0E6DC] px-5 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />

                <strong>سلة التسوق</strong>

                <span className="rounded-full bg-[#F0E6DC] px-2 py-0.5 text-xs">
                  {cart.count}
                </span>
              </div>

              <button
                onClick={closeCart}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-white"
                aria-label="إغلاق"
              >
                <X size={19} />
              </button>
            </div>

            {/* المنتجات */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.items.length === 0 ? (
                <div className="grid min-h-[55vh] place-items-center text-center">
                  <div>
                    <ShoppingBag
                      className="mx-auto mb-4 opacity-25"
                      size={44}
                    />

                    <p className="font-bold">سلتك فارغة</p>

                    <p className="mt-2 text-sm text-[#8C7A72]">
                      اختاري العباية التي تناسبك وأضيفيها للسلة.
                    </p>

                    <Link
                      href="/shop"
                      onClick={closeCart}
                      className="mt-5 inline-flex rounded-full bg-[#3D2B24] px-5 py-2.5 text-sm font-bold text-white"
                    >
                      تسوّقي الآن
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.items.map((item) => {
                    const qty = Number(
                      item.qty ?? item.quantity ?? 1
                    )

                    const selectedSize =
                      item.size || item.selectedSize || ""

                    const imageSrc =
                      item.image ||
                      item.images?.[0] ||
                      "/placeholder.svg"

                    return (
                      <div
                        key={`${item.id}-${selectedSize}-${item.color ?? ""}`}
                        className="flex gap-3 rounded-2xl border border-[#F0E6DC] bg-white p-3"
                      >
                        {/* الصورة */}
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#FDF6F0]">
                          <Image
                            src={imageSrc}
                            alt={item.name || ""}
                            fill
                            sizes="80px"
                            className="object-contain p-1"
                          />
                        </div>

                        {/* معلومات المنتج */}
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-bold leading-6">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[#8C7A72]">
                            المقاس:{" "}
                            {selectedSize || "غير محدد"}

                            {item.color
                              ? ` • ${item.color}`
                              : ""}

                            {typeof item.maxStock === "number"
                              ? ` • المتوفر ${item.maxStock}`
                              : ""}
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <strong className="text-sm">
                              {formatPrice(
                                Number(item.price || 0) * qty
                              )}
                            </strong>

                            {/* التحكم بالكمية */}
                            <div className="flex items-center gap-1">
                              <button
                                className="grid h-7 w-7 place-items-center rounded-full border border-[#F0E6DC]"
                                onClick={() =>
                                  cart.updateQty(
                                    item.id,
                                    qty - 1,
                                    selectedSize
                                  )
                                }
                                aria-label="تقليل الكمية"
                              >
                                <Minus size={12} />
                              </button>

                              <span className="w-6 text-center text-xs font-bold">
                                {qty}
                              </span>

                              <button
                                disabled={
                                  typeof item.maxStock === "number" &&
                                  qty >= Math.min(item.maxStock, 10)
                                }
                                className="grid h-7 w-7 place-items-center rounded-full border border-[#F0E6DC] disabled:cursor-not-allowed disabled:opacity-30"
                                onClick={() =>
                                  cart.updateQty(
                                    item.id,
                                    qty + 1,
                                    selectedSize
                                  )
                                }
                                aria-label="زيادة الكمية"
                              >
                                <Plus size={12} />
                              </button>

                              {/* حذف */}
                              <button
                                className="mr-1 grid h-7 w-7 place-items-center rounded-full text-red-500"
                                onClick={() =>
                                  cart.removeItem(
                                    item.id,
                                    selectedSize
                                  )
                                }
                                aria-label="حذف"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* أسفل السلة */}
            {cart.items.length > 0 && (
              <div className="border-t border-[#F0E6DC] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-[#8C7A72]">
                    المجموع قبل التوصيل
                  </span>

                  <strong>
                    {formatPrice(cart.subtotal)}
                  </strong>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center rounded-full bg-[#3D2B24] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#5A4035]"
                >
                  إتمام الطلب
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
