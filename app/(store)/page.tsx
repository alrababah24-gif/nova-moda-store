import Link from "next/link";
import {
  ArrowUpLeft,
  BadgeCheck,
  PackageCheck,
  Ruler,
  Sparkles,
  Truck,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { BrandShowcase } from "@/components/brand-showcase";
import { BrandRail } from "@/components/brand-rail";
import { ProductGrid } from "@/components/product-grid";
import { ExperienceBento } from "@/components/experience-bento";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  getBrands,
  getCategories,
  getProducts,
  getSettings,
} from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [settings, products, categories, brands] = await Promise.all([
    getSettings(),
    getProducts(),
    getCategories(),
    getBrands({ featured: true }),
  ]);

  return (
    <>
      <BrandRail brands={brands} />
      <Hero settings={settings} products={products} />

      <section className="home-products-section py-14 sm:py-20">
        <div className="container-shell">
          <AnimatedSection className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="section-index">
                <span>01</span>
                <i />
                <p>THE ABAYAS</p>
              </div>

              <h2 className="mt-4 text-[34px] font-extrabold leading-[1.25] sm:text-[48px]">
                اختاري القطعة اللي تشبه حضورك
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                أحدث مختارات نوفا مودا قدامك مباشرة—بدون لف ودوران. شوفي
                التفاصيل، المقاسات، الألوان والسعر من صفحة كل قطعة.
              </p>
            </div>

            <Link href="/shop" className="section-link">
              كل العبايات <ArrowUpLeft size={14} />
            </Link>
          </AnimatedSection>

          <ProductGrid products={products} categories={categories} />
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[color:var(--surface-glass)] py-8 backdrop-blur
