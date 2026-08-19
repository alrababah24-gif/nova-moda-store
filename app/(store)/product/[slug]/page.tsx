import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product-detail-client";
import { ProductGrid } from "@/components/product-grid";
import { getCategories, getProductBySlug, getProducts, getSettings } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "المنتج غير موجود" };
  return { title: product.name, description: product.description, openGraph: { title: product.name, description: product.description, images: product.images[0] ? [product.images[0]] : undefined } };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product,settings,categories,allProducts] = await Promise.all([getProductBySlug(slug),getSettings(),getCategories(),getProducts()]);
  if (!product) return notFound();
  const currentProduct = product;
  const related = allProducts.filter((p)=>p.id!==currentProduct.id && p.category?.slug===currentProduct.category?.slug).slice(0,4);
  const schema = { "@context":"https://schema.org", "@type":"Product", name:currentProduct.name, description:currentProduct.description, image:currentProduct.images, brand:{"@type":"Brand",name:currentProduct.brand?.name||"Nova Moda"}, offers:{"@type":"Offer",priceCurrency:"JOD",price:currentProduct.price,availability:currentProduct.stock>0?"https://schema.org/InStock":"https://schema.org/OutOfStock"} };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><section className="py-7 sm:py-11"><div className="container-shell"><div className="mb-6 flex items-center gap-2 text-xs text-[#8C7A72]"><Link href="/">الرئيسية</Link><span>/</span><Link href="/shop">المتجر</Link>{currentProduct.brand && <><span>/</span><Link href={`/brands/${currentProduct.brand.slug}`}>{currentProduct.brand.name}</Link></>}<span>/</span><span className="truncate">{currentProduct.name}</span></div><ProductDetailClient product={currentProduct} settings={settings}/></div></section>{related.length>0 && <section className="border-t border-[#F0E6DC] py-14"><div className="container-shell"><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-extrabold text-[#A27E6C]">YOU MAY ALSO LIKE</p><h2 className="mt-2 text-2xl font-extrabold">قد يعجبك أيضاً</h2></div><span className="text-xs text-[#8C7A72]">ابتداءً من {formatPrice(Math.min(...related.map(p=>p.price)))}</span></div><ProductGrid products={related} categories={categories} showFilters={false}/></div></section>}</>;
}
