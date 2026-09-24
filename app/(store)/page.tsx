export const dynamic = 'force-dynamic';
export const revalidate = 0;

import dynamic from "next/dynamic";

const BrandRail = dynamic(() => import("@/components/brand-rail").then(m => (m as any).BrandRail || (m as any).default), { ssr: false, loading: () => null });
const ProductGrid = dynamic(() => import("@/components/product-grid").then(m => (m as any).ProductGrid || (m as any).default), { ssr: false, loading: () => null });
const ExperienceBento = dynamic(() => import("@/components/experience-bento").then(m => (m as any).ExperienceBento || (m as any).default), { ssr: false, loading: () => null });
const Hero = dynamic(() => import("@/components/hero").then(m => (m as any).Hero || (m as any).default), { ssr: false, loading: () => null });

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
