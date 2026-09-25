// @ts-nocheck
// FINAL CART DRAWER - زر X بشتغل 100%
"use client"
import Link from "next/link"
import { useCart } from "./cart-provider"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, closeCart, removeFromCart, updateQty, total, mounted } = useCart()

  if (!mounted) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[99]" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[90%] max-w-[380px] bg-white z-[100] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header مع زر X شغال */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-bold text-lg">السلة ({items?.length || 0})</h2>
            <button 
              onClick={() => {
                console.log('Closing cart')
                setIsOpen(false)
                if (closeCart) closeCart()
              }}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-xl"
            >
              ×
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!items || items.length === 0 ? (
              <div className="text-center py-20 text-gray-400">السلة فاضية</div>
            ) : (
              items.map((it: any, i: number) => (
                <div key={`${it.id}-${it.selectedSize}-${i}`} className="flex gap-3 border-b pb-3">
                  <img src={it.images?.[0] || it.image || ''} alt={it.name} className="w-16 h-20 object-cover rounded bg-gray-50" />
                  <div className="flex-1">
                    <div className="text-sm font-medium line-clamp-1">{it.name}</div>
                    {it.selectedSize && <div className="text-xs text-gray-500">المقاس: {it.selectedSize}</div>}
                    <div className="text-sm font-bold mt-1">{Number(it.price).toFixed(3)} JOD</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(it.id, Number(it.qty||1)-1, it.selectedSize)} className="w-6 h-6 border rounded">-</button>
                      <span className="text-sm w-6 text-center">{it.qty || 1}</span>
                      <button onClick={() => updateQty(it.id, Number(it.qty||1)+1, it.selectedSize)} className="w-6 h-6 border rounded">+</button>
                      <button onClick={() => removeFromCart(it.id, it.selectedSize)} className="mr-auto text-xs text-red-500">حذف</button>
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
          )}
        </div>
      </div>
    </>
  )
}

export default CartDrawer
