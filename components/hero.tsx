"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpLeft, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Product, StoreSettings } from "@/lib/types";

export function Hero({ settings, products = [] }: { settings: StoreSettings; products?: Product[] }) {
  const reduce = useReducedMotion();

  const productImages = products
    .flatMap((product) => product.images || [])
    .filter((image): image is string => Boolean(image));

  // Keep the slider available even when only one featured product/image exists.
  const fallbackImages = [
    "/products/abaya-classic-beige.svg",
    "/products/abaya-rose-black.svg",
  ];
  const images = productImages.length ? Array.from(new Set(productImages)) : fallbackImages;

  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => {
    setActiveImage((current) => (current + 1) % images.length);
  };

  const previousImage = () => {
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  };

  const mainImage = images[activeImage];
  const secondaryImage = images.length > 1 ? images[(activeImage + 1) % images.length] : mainImage;

  return (
    <section className="identity-hero relative overflow-hidden border-b border-[var(--line)]">
      <div className="identity-hero-mesh" />
      <div className="identity-hero-word" aria-hidden="true">NOVA</div>
      <div className="container-shell relative grid min-h-[650px] items-center gap-8 py-12 lg:grid-cols-[1.04fr_.96fr] lg:py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="hero-copy order-2 lg:order-1"
        >
          <div className="hero-kicker"><Sparkles size={13} /><span>{settings.hero_eyebrow}</span></div>
          <h1 className="hero-statement">{settings.hero_title}</h1>
          <p className="hero-description">{settings.hero_description}</p>
          <div className="hero-actions">
            <Link href="/shop" className="hero-action-primary">{settings.hero_primary_cta}<ArrowUpLeft size={16} /></Link>
            <Link href="/brands" className="hero-action-secondary">اكتشفي البراندات</Link>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="hero-action-whatsapp"><MessageCircle size={16} />واتساب</a>
          </div>
          <div className="hero-signature-line">
            <span>قصّات محسوبة</span><i />
            <span>خامات مختارة</span><i />
            <span>تفاصيل تصنع حضور</span>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, x: -22 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="hero-visual order-1 min-w-0 w-full lg:order-2"
        >
          <div className="hero-fashion-frame">
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="hero-main-image"
            >
              <motion.div
                key={mainImage}
                initial={reduce ? false : { opacity: 0, scale: 1.035 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={mainImage}
                  alt="عباية مختارة من نوفا مودا"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 82vw, 480px"
                />
              </motion.div>
            </motion.div>

            {images.length > 1 && <div className="hero-slider-controls" aria-label="التنقل بين صور العبايات">
              <button
                type="button"
                onClick={previousImage}
                className="hero-slider-arrow"
                aria-label="الصورة السابقة"
              >
                <ChevronRight size={24} />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="hero-slider-arrow"
                aria-label="الصورة التالية"
              >
                <ChevronLeft size={24} />
              </button>
            </div>}

            <motion.div
              animate={reduce ? undefined : { y: [0, 7, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
              className="hero-secondary-image"
            >
              <motion.div
                key={secondaryImage}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image src={secondaryImage} alt="تفاصيل عباية نوفا مودا" fill className="object-cover object-center" sizes="190px" />
              </motion.div>
            </motion.div>

            <div className="hero-edition-card">
              <span>THE NOVA EDIT</span>
              <strong>MODESTY<br/>IN MOTION</strong>
            </div>
            <div className="hero-number-card"><span>20</span><b>30</b></div>
            <div className="hero-orbit hero-orbit-a" />
            <div className="hero-orbit hero-orbit-b" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
