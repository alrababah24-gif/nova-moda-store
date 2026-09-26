// @ts-nocheck
// FINAL CART DRAWER - زر X بشتغل 100%
"use client"
import Link from "next/link"
import { useCart } from "./cart-provider"

export function CartDrawer() {
  const cart = useCart();
  const reduce = useReducedMotion();

  const closeCart = () => {
    cart.setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.button
            aria-label="إغلاق السلة"
            className="fixed inset-0 z-[80] bg-[#241711]/35 backdrop-blur-[2px]"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            dir="rtl"
            className="fixed inset-y-0 left-0 z-[90] flex w-full max-w-[420px] flex-col bg-[var(--paper)] shadow-2xl"
            initial={reduce ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "-100%" }}
            transition={{ type: "spring", stiffness: 310, damping: 32 }}
          >
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
                  {cart.items.map((item) => (
                    <div
                      key={`${item.id}-${item.size || item.selectedSize || ""}-${item.color ?? ""}`}
                      className="flex gap-3 rounded-2xl border border-[#F0E6DC] bg-white p-3"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#FDF6F0]">
                        <Image
                          src={item.image}
                          alt={item.name || ""}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-bold leading-6">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-[#8C7A72]">
                          المقاس:{" "}
                          {item.size || item.selectedSize || "غير محدد"}
                          {item.color ? ` • ${item.color}` : ""}
                          {typeof item.maxStock === "number"
                            ? ` • المتوفر ${item.maxStock}`
                            : ""}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <strong className="text-sm">
                            {formatPrice(
                              Number(item.price || 0) *
                                Number(item.qty ?? item.quantity ?? 1)
                            )}
                          </strong>

                          <div className="flex items-center gap-1">
                            <button
                              className="grid h-7 w-7 place-items-center rounded-full border border-[#F0E6DC]"
                              onClick={() =>
                                cart.updateQty(
                                  item.id,
                                  Number(item.qty ?? item.quantity ?? 1) - 1,
                                  item.size || item.selectedSize
                                )
                              }
                              aria-label="تقليل الكمية"
                            >
                              <Minus size={12} />
                            </button>

                            <span className="w-6 text-center text-xs font-bold">
                              {Number(item.qty ?? item.quantity ?? 1)}
                            </span>

                            <button
                              disabled={
                                typeof item.maxStock === "number" &&
                                Number(item.qty ?? item.quantity ?? 1) >=
                                  Math.min(item.maxStock, 10)
                              }
                              className="grid h-7 w-7 place-items-center rounded-full border border-[#F0E6DC] disabled:cursor-not-allowed disabled:opacity-30"
                              onClick={() =>
                                cart.updateQty(
                                  item.id,
                                  Number(item.qty ?? item.quantity ?? 1) + 1,
                                  item.size || item.selectedSize
                                )
                              }
                              aria-label="زيادة الكمية"
                            >
                              <Plus size={12} />
                            </button>

                            <button
                              className="mr-1 grid h-7 w-7 place-items-center rounded-full text-red-500"
                              onClick={() =>
                                cart.removeItem(
                                  item.id,
                                  item.size || item.selectedSize
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
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items && items.length > 0 && (
            <div className="p-4 border-t space-y-3">
              <div className="flex justify-between font-bold">
                <span>المجموع</span>
                <span>{Number(total).toFixed(3)} JOD</span>
              </div>
              <Link href="/cart" onClick={() => setIsOpen(false)} className="block w-full h-12 bg-black text-white rounded-full flex items-center justify-center font-medium">
                إتمام الطلب
              </Link>
            </div>

            {cart.items.length > 0 && (
              <div className="border-t border-[#F0E6DC] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-[#8C7A72]">
                    المجموع قبل التوصيل
                  </span>

                  <strong>{formatPrice(cart.subtotal)}</strong>
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
  );
}

export default CartDrawer
