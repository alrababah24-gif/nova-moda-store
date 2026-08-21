import Link from "next/link";
import { ArrowUpLeft, BadgeCheck, PackageCheck, Ruler, Sparkles, Truck } from "lucide-react";
import { Hero } from "@/components/hero";
import { BrandShowcase } from "@/components/brand-showcase";
import { BrandRail } from "@/components/brand-rail";
import { ProductGrid } from "@/components/product-grid";
import { ExperienceBento } from "@/components/experience-bento";
import { AnimatedSection } from "@/components/ui/animated-section";
import { getBrands, getCategories, getProductById, getProducts, getSettings } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSettings();
  const [products, categories, brands, selectedHeroProduct] = await Promise.all([
    getProducts({ featured: true }),
    getCategories(),
    getBrands({ featured: true }),
    settings.hero_product_id ? getProductById(settings.hero_product_id) : Promise.resolve(null),
  ]);

  const heroProducts = selectedHeroProduct ? [selectedHeroProduct] : products;

  return <>
    <BrandRail brands={brands} />
    <Hero settings={settings} products={heroProducts} />

    <section className="home-products-section py-14 sm:py-20">
      <div className="container-shell">
        <AnimatedSection className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="section-index"><span>01</span><i/><p>THE ABAYAS</p></div>
            <h2 className="mt-4 text-[34px] font-extrabold leading-[1.25] sm:text-[48px]">اختاري القطعة اللي تشبه حضورك</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">أحدث مختارات نوفا مودا قدامك مباشرة—بدون لف ودوران. شوفي التفاصيل، المقاسات، الألوان والسعر من صفحة كل قطعة.</p>
          </div>
          <Link href="/shop" className="section-link">كل العبايات <ArrowUpLeft size={14}/></Link>
        </AnimatedSection>
        <ProductGrid products={products} categories={categories} />
      </div>
    </section>

    <section className="border-y border-[var(--line)] bg-[color:var(--surface-glass)] py-8 backdrop-blur-xl">
      <div className="container-shell grid grid-cols-2 gap-3 md:grid-cols-4">
        {[{icon:BadgeCheck,title:"خامات مختارة",text:"ملمس وراحة قبل كل شيء"},{icon:Ruler,title:"مقاسات واضحة",text:"دليل يساعدك قبل الطلب"},{icon:Truck,title:"توصيل 2 د.أ",text:"لكل محافظات الأردن"},{icon:PackageCheck,title:"طلب مرتب",text:"متابعة من التأكيد للتوصيل"}].map(({icon:Icon,title,text})=><div key={title} className="proof-card"><div className="proof-icon"><Icon size={17}/></div><strong>{title}</strong><p>{text}</p></div>)}
      </div>
    </section>

    <section className="pt-16 sm:pt-20">
      <div className="container-shell"><div className="section-index"><span>02</span><i/><p>BRANDS / EDITS</p></div></div>
      <BrandShowcase brands={brands} />
    </section>

    <section className="pb-16">
      <div className="container-shell grid gap-4 md:grid-cols-3">
        <Link href="/collections/new" className="group relative min-h-[260px] overflow-hidden rounded-[30px] border border-[var(--line)] bg-[var(--surface-soft)] p-6"><div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-[var(--brand-soft)] blur-3xl transition group-hover:scale-125"/><Sparkles className="relative text-[var(--brand-strong)]"/><h3 className="relative mt-16 text-2xl font-extrabold">وصل حديثاً</h3><p className="relative mt-2 text-xs leading-6 text-[var(--muted)]">أحدث القطع اللي نزلت على المتجر.</p><span className="relative mt-5 inline-flex items-center gap-1 text-xs font-extrabold">اكتشفي الآن <ArrowUpLeft size={13}/></span></Link>
        <Link href="/collections" className="group min-h-[260px] rounded-[30px] border border-[var(--line)] bg-[var(--ink)] p-6 text-[var(--paper)]"><p className="text-[10px] font-extrabold tracking-[.2em] opacity-60">COLLECTIONS</p><h3 className="mt-16 text-2xl font-extrabold">تسوّقي حسب الستايل</h3><p className="mt-2 text-xs leading-6 opacity-65">يومي، مناسبات، مفتوح والمزيد.</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold">كل المجموعات <ArrowUpLeft size={13}/></span></Link>
        <Link href="/size-guide" className="group min-h-[260px] rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-6"><Ruler className="text-[var(--brand-strong)]"/><h3 className="mt-16 text-2xl font-extrabold">دليل المقاسات</h3><p className="mt-2 text-xs leading-6 text-[var(--muted)]">اختيار المقاس صار أوضح قبل ما تأكدي الطلب.</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold">افتحي الدليل <ArrowUpLeft size={13}/></span></Link>
      </div>
    </section>

    <ExperienceBento />

    <section className="pb-8 pt-6">
      <div className="container-shell overflow-hidden rounded-[34px] border border-[var(--line)] bg-[color:var(--surface-glass)] px-6 py-10 backdrop-blur-xl sm:px-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center"><p className="text-[10px] font-extrabold tracking-[.22em] text-[var(--brand-strong)]">NOVA MODA SUPPORT</p><h2 className="mt-3 text-[30px] font-extrabold leading-[1.35] sm:text-[44px]">مش متأكدة من الموديل أو المقاس؟</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">خلي فريقنا يساعدك قبل الطلب. كل قرار من المقاس للتوصيل لازم يكون بسيط وواضح.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--ink)] px-6 py-3.5 text-sm font-extrabold text-[var(--paper)]">تحدثي معنا واتساب</a><Link href="/faq" className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3.5 text-sm font-extrabold">الأسئلة الشائعة</Link></div></div>
      </div>
    </section>
  </>;
}
