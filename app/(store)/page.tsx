// هذا الملف تحطه في app/(store)/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { BrandRail } from "@/components/brand-rail";
import { ProductGrid } from "@/components/product-grid";
import { ExperienceBento } from "@/components/experience-bento";
import { Hero } from "@/components/hero";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* الشريط العلوي للبراندات */}
      <BrandRail />
      
      {/* الهيرو */}
      <Hero />

      {/* المنتجات */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-[34px] font-bold">عبايات مصممة بعناية</h2>
            <Link href="/shop" className="text-black underline">كل المنتجات</Link>
          </div>
          <ProductGrid />
        </div>
      </section>

      <ExperienceBento />
    </div>
  );
}
