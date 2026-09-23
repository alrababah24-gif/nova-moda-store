import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product-detail-client";
import { ProductGrid } from "@/components/product-grid";
import FacebookViewContent from "@/components/facebook-viewcontent";
import { getCategories, getProductBySlug, getProducts, getSettings } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "المنتج غير موجود" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings, categories, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
    getCategories(),
    getProducts(),
  ]);
  if (!product) return notFound();
  const currentProduct = product;
  const related = allProducts.filter((p) => p.id !== currentProduct.id && p.category?.slug === currentProduct.category?.slug);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: currentProduct.name };

  return (
    <>
      {/* هذا السطر هو اللي بصلح مطابقة الكتالوج 0% */}
      <FacebookViewContent
        id={currentProduct.id}
        name={currentProduct.name}
        price={currentProduct.price}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductDetailClient product={currentProduct} />
      {/* باقي الصفحة - المنتجات المشابهة ... */}
    </>
  );
}
