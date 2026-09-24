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

      {/* Products Section - Premium */}
      <section id="products" className="py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 max-w-7xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-black/40 mb-3">
                <span className="w-6 h-[1px] bg-black/20" />
                تشكيلتنا المميزة
              </div>
              <h2 className="text-[28px] md:text-[34px] font-bold tracking-[-0.02em] leading-tight">
                عبايات مصممة
                <span className="font-light"> بعناية</span>
              </h2>
            </div>
            <p className="text-[13px] text-black/50 max-w-[320px] leading-relaxed">
              كل قطعة تحكي قصة أناقة - خامات فاخرة وتفاصيل دقيقة تناسب كل مناسبة
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <ProductGrid />
          </div>
        </div>
      </section>

      <ExperienceBento />

      {/* Footer simple */}
      <footer className="bg-black text-white py-10">
        <div className="container mx-auto px-6 text-center">
          <div className="text-[13px] tracking-[0.3em] mb-3">NOVA MODA</div>
          <p className="text-[12px] text-white/40">© 2025 Nova Moda Abaya - جميع الحقوق محفوظة - عمان، الأردن</p>
        </div>
      </footer>
    </div>
  );
}
