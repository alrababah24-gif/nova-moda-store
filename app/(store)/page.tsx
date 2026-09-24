"use client";
import { BrandRail } from "@/components/brand-rail";
import { ProductGrid } from "@/components/product-grid";
import { ExperienceBento } from "@/components/experience-bento";
import { Hero } from "@/components/hero";

export default function Page() {
  return (
    <div className="bg-white min-h-screen">
      <BrandRail />
      <Hero />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-[30px] font-bold mb-6">عبايات مصممة بعناية</h2>
          <ProductGrid />
        </div>
      </section>
      <ExperienceBento />
    </div>
  );
}
