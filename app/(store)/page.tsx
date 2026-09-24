export const dynamic = 'force-dynamic';
export const revalidate = 0;
@@ -6,21 +6,24 @@ import { BrandRail } from "@/components/brand-rail";
import { ProductGrid } from "@/components/product-grid";
import { ExperienceBento } from "@/components/experience-bento";
import { AnimatedSection } from "@/components/ui/animated-section";
import { getBrands, getCategories, getProducts, getSettings } from "@/lib/data";
import { getBrands, getCategories, getProductById, getProducts, getSettings } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [settings, products, categories, brands] = await Promise.all([
    getSettings(),
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
    <Hero settings={settings} products={products} />
    <Hero settings={settings} products={heroProducts} />

    <section className="home-products-section py-14 sm:py-20">
      <div className="container-shell">
