"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Ruler,
} from "lucide-react";
import type { Product, StoreSettings } from "@/lib/types";
import { formatPrice, getSizeStock } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";
import FacebookViewContent from "@/components/facebook-viewcontent";

export function ProductDetailClient({
  product,
  settings,
}: {
  product: Product;
  settings: StoreSettings;
}) {
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);
  const cart = useCart();
  
  // @ts-ignore - لتجنب مشاكل الأنواع
  const p = product as any;
  const images = p.images && p.images.length > 0 ? p.images : ["/placeholder.svg"];
  const sizes = p.sizes || p.sizeOptions || [];
  const colors = p.colors || p.colorOptions || [];
  const inStock = size ? getSizeStock(product, size) > 0 : true;

  return (
    <>
      <FacebookViewContent
        productId={p.slug || p.id}
        productName={p.name}
        value={p.price}
        currency="JOD"
      />
      <div className="grid min-w-0 gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
        <div className="min-w-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--surface-soft)]">
            <Image src={images[currentImg]} alt={p.name} fill className="object-cover" priority />
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur"><ChevronLeft size={18} /></button>
                <button onClick={() => setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur"><ChevronRight size={18} /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-auto">
              {images.map((img: string, i: number) => (
                <button key={i} onClick={() => setCurrentImg(i)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border ${currentImg === i ? "border-black" : "border-transparent"}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <Link href="/products" className="text-sm text-[var(--muted)]">← العودة للمنتجات</Link>
          <h1 className="mt-3 text-2xl font-bold leading-tight">{p.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xl font-bold">{formatPrice(p.price)}</span>
          </div>
          {p.description && <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{p.description}</p>}
          {sizes.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Ruler size={16} />المقاس</div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s: string) => {
                  const stock = getSizeStock(product, s);
                  return <button key={s} onClick={() => setSize(s)} disabled={stock === 0} className={`min-h-10 rounded-full border px-4 text-sm ${size === s ? "border-black bg-black text-white" : "border-[var(--line)]"} ${stock === 0 ? "opacity-40" : ""}`}>{s}</button>;
                })}
              </div>
            </div>
          )}
          {colors.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-sm font-medium">اللون: {color || colors[0]}</div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c: string) => (
                  <button key={c} onClick={() => setColor(c)} className={`h-9 rounded-full border px-4 text-sm ${color === c ? "border-black bg-black text-white" : "border-[var(--line)]"}`}>{c}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-[var(--line)]">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3"><Minus size={16} /></button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3"><Plus size={16} /></button>
            </div>
            <button onClick={() => cart.addItem(product, size, color || colors[0], qty)} disabled={!inStock} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#3D2B24] px-5 text-sm font-medium text-white disabled:opacity-50">
              <ShoppingBag size={18} />{inStock ? "أضيفي للسلة" : "غير متوفر"}
            </button>
          </div>
          <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`مرحبا نوفا مودا، أريد الاستفسار عن ${p.name}`)}`} target="_blank" rel="noreferrer" className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] text-sm font-medium">
            <MessageCircle size={17} />اسألي عن هذا المنتج على واتساب
          </a>
          <div className="mt-6 grid gap-3 rounded-2xl bg-[var(--surface-soft)] p-4 text-xs text-[var(--muted)] sm:grid-cols-2">
            <span className="flex items-center gap-2"><Truck size={16} />توصيل 24-48 ساعة</span>
            <span className="flex items-center gap-2"><Check size={16} />المخزون مرتبط بالمقاس المختار</span>
          </div>
        </div>
      </div>
    </>
  );
}
