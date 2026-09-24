// @ts-nocheck
// ULTIMATE (store)/page.tsx - بطفي 404 _rsc
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Hero } from "@/components/hero";
import { BrandRail } from "@/components/brand-rail";
import { ProductGrid } from "@/components/product-grid";
import { ExperienceBento } from "@/components/experience-bento";
import { AnimatedSection } from "@/components/ui/animated-section";
import { getBrands, getProductById, getProducts, getSettings } from "@/lib/products";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSettings();
  const [products, brands, selectedHeroProduct] = await Promise.all([
    getProducts({ featured: true }),
    getBrands({ featured: true }),
    settings.hero_product_id ? getProductById(settings.hero_product_id) : Promise.resolve(null)
  ]);
  const heroProducts = selectedHeroProduct ? [selectedHeroProduct] : products;
  return (
    <div suppressHydrationWarning>
      <BrandRail brands={brands} />
      <Hero settings={settings} products={heroProducts} />
      <section className="py-14"><div className="container-shell">
        <AnimatedSection className="mb-8 flex justify-between"><div><h2 className="text-[34px] font-bold">عبايات مصممة بعناية</h2></div><Link href="/shop">كل المنتجات <ArrowUpLeft size={14}/></Link></AnimatedSection>
        <ProductGrid products={products} />
      </div></section>
      <ExperienceBento />
    </div>
  );
}
