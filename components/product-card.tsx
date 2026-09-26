"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Product } from "@/lib/types";
import { formatPrice, imageKitUrl } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const images = product.images?.filter(Boolean).length
    ? product.images.filter(Boolean)
    : ["/products/abaya-classic-beige.svg"];

  const [activeImage, setActiveImage] = useState(0);
  const canSlide = images.length > 1;

  const previousImage = () => {
    if (!canSlide) return;
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (!canSlide) return;
    setActiveImage((current) => (current + 1) % images.length);
  };

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.3 }}
      className="group min-w-0"
    >
      <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)] soft-shadow">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--surface-soft)] sm:aspect-[3/4]">
          <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0 block">
            <motion.div
              key={`${product.id}-${activeImage}`}
              initial={reduce ? false : { opacity: 0.55, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0"
            >
              <Image
                src={imageKitUrl(images[activeImage], 1200)}
                alt={product.name}
                fill
                sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                className="object-cover object-center transition duration-500 group-hover:scale-[1.025]"
              />
            </motion.div>
          </Link>

          {product.badge && (
            <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-[var(--ink)]/90 px-3 py-1.5 text-[10px] font-extrabold text-[var(--paper)] backdrop-blur">
              {product.badge}
            </span>
          )}

          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-[color:var(--surface-glass)] px-2.5 py-1.5 text-[10px] font-extrabold text-[var(--brand-strong)] backdrop-blur">
              وفرّي {Math.round((1 - product.price / product.compare_at_price) * 100)}%
            </span>
          )}

          {canSlide && (
            <>
              <button
                type="button"
                onClick={previousImage}
                aria-label="الصورة السابقة"
                className="absolute right-2 top-1/2 z-30 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-[#3D2B24] shadow-lg backdrop-blur transition hover:scale-105 sm:h-10 sm:w-10"
              >
                <ChevronRight size={19} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="الصورة التالية"
                className="absolute left-2 top-1/2 z-30 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-[#3D2B24] shadow-lg backdrop-blur transition hover:scale-105 sm:h-10 sm:w-10"
              >
                <ChevronLeft size={19} />
              </button>

              <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeImage ? "w-4 bg-white" : "w-1.5 bg-white/65"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <Link
            href={`/product/${product.slug}`}
            aria-label={`فتح ${product.name}`}
            className="absolute bottom-3 left-3 z-20 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-[var(--surface)] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowUpLeft size={17} />
          </Link>
        </div>

        <Link href={`/product/${product.slug}`} className="block p-4 sm:p-5">
          <p className="mb-1 text-[10px] font-extrabold tracking-wide text-[var(--brand-strong)]">
            {product.brand?.name || product.category?.name || "NOVA MODA"}
          </p>
          <h3 className="line-clamp-2 min-h-[48px] text-[14px] font-extrabold leading-6 sm:text-[15px]">
            {product.name}
          </h3>
          <div className="mt-3 flex items-end gap-2">
            <strong className="text-[15px]">{formatPrice(product.price)}</strong>
            {product.compare_at_price && (
              <span className="text-xs text-[var(--muted)] line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </Link>
      </div>
    </motion.article>
  );
}
