"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, MessageCircle, Minus, Plus, ShoppingBag, Truck, Ruler } from "lucide-react";
import type { Product, StoreSettings } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";
import { trackPixel } from "@/lib/meta-pixel";

export function ProductDetailClient({ product, settings }: { product: Product; settings: StoreSettings }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0] || "M");
  const [color, setColor] = useState(product.colors[0] || "");
  const [qty, setQty] = useState(1);
  const cart = useCart();

  useEffect(() => {
    // content_ids must match the id column of /api/catalog so Meta can match the product.
    trackPixel("ViewContent", { content_ids: [product.id], content_name: product.name, content_type: "product", valueJOD: product.price });
  }, [product.id, product.name, product.price]);
  const images = product.images.length ? product.images : ["/products/abaya-classic-beige.svg"];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[#EFE2D8] bg-white"><Image src={images[activeImage]} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /></div>
        {images.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto">{images.map((image,index)=><button key={image} onClick={()=>setActiveImage(index)} className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${index===activeImage ? "border-[var(--brand)]" : "border-transparent"}`}><Image src={image} alt={`${product.name} - صورة ${index+1}`} fill className="object-cover" sizes="80px"/></button>)}</div>}
      </div>
      <div className="lg:sticky lg:top-[165px] lg:self-start">
        <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-[var(--brand-strong)]">{product.brand?<Link href={`/brands/${product.brand.slug}`} className="underline decoration-transparent underline-offset-4 hover:decoration-current">{product.brand.name}</Link>:<span>نوفا مودا</span>}<span className="text-[var(--muted)]">•</span><span className="text-[var(--muted)]">{product.category?.name||"عبايات"}</span></div>
        <h1 className="mt-2 text-[30px] font-extrabold leading-[1.35] sm:text-[38px]">{product.name}</h1>
        <div className="mt-4 flex items-center gap-3"><strong className="text-2xl">{formatPrice(product.price)}</strong>{product.compare_at_price && <span className="text-sm text-[#A99991] line-through">{formatPrice(product.compare_at_price)}</span>}</div>
        <p className="mt-5 text-sm leading-8 text-[#6F5B52]">{product.description}</p>

        <div className="mt-7 border-t border-[var(--line)] pt-6"><div className="mb-3 flex items-center justify-between"><strong className="text-sm">اختاري المقاس</strong><Link href="/size-guide" className="flex items-center gap-1 text-xs font-bold text-[var(--muted)]"><Ruler size={13}/>دليل المقاسات</Link></div><div className="flex flex-wrap gap-2">{product.sizes.map((value)=><button key={value} onClick={()=>setSize(value)} className={`min-w-12 rounded-full border px-4 py-2.5 text-xs font-extrabold ${size===value ? "border-[#3D2B24] bg-[#3D2B24] text-white" : "border-[#E6D7CC] bg-white"}`}>{value}</button>)}</div></div>
        {product.colors.length > 0 && <div className="mt-6"><strong className="mb-3 block text-sm">اللون</strong><div className="flex flex-wrap gap-2">{product.colors.map((value)=><button key={value} onClick={()=>setColor(value)} className={`rounded-full border px-4 py-2.5 text-xs font-bold ${color===value ? "border-[var(--brand)] bg-[#F7ECE5]" : "border-[#E6D7CC] bg-white"}`}>{color===value && <Check size={12} className="ml-1 inline"/>}{value}</button>)}</div></div>}
        <div className="mt-7 flex gap-3"><div className="flex shrink-0 items-center rounded-full border border-[#E6D7CC] bg-white px-2"><button onClick={()=>setQty(Math.max(1,qty-1))} className="grid h-10 w-9 place-items-center"><Minus size={14}/></button><span className="w-7 text-center text-sm font-extrabold">{qty}</span><button onClick={()=>setQty(Math.min(10,qty+1))} className="grid h-10 w-9 place-items-center"><Plus size={14}/></button></div><button onClick={()=>cart.addItem(product,size,color,qty)} disabled={product.stock<=0} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#3D2B24] px-5 text-sm font-extrabold text-white transition hover:bg-[#573C32] disabled:cursor-not-allowed disabled:opacity-45"><ShoppingBag size={18}/>{product.stock>0 ? "أضيفي للسلة" : "غير متوفر"}</button></div>
        <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`مرحبا نوفا مودا، أريد الاستفسار عن: ${product.name}`)}`} target="_blank" rel="noreferrer" className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] text-sm font-extrabold"><MessageCircle size={17}/>اسألي عن هذا المنتج على واتساب</a>
        <div className="mt-6 grid gap-3 rounded-2xl bg-[var(--surface-soft)] p-4 text-xs text-[var(--muted)] sm:grid-cols-2"><span className="flex items-center gap-2"><Truck size={16}/>توصيل 24–48 ساعة</span><span className="flex items-center gap-2"><Check size={16}/>فحص المقاس قبل تأكيد الطلب</span></div>
      </div>
    </div>
  );
}
