import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "المتجر", description: "تصفحي أحدث عبايات نوفا مودا: يومية، مناسبات، مفتوحة وتصاميم حصرية." };
export const revalidate = 0;

export default async function ShopPage() {
  const [products,categories] = await Promise.all([getProducts(),getCategories()]);
  return <section className="py-10 sm:py-14"><div className="container-shell"><div className="mx-auto mb-9 max-w-2xl text-center"><p className="text-xs font-extrabold tracking-[.14em] text-[#A27E6C]">NOVA MODA SHOP</p><h1 className="mt-2 text-[36px] font-extrabold sm:text-[46px]">اختاري إطلالتك</h1><p className="mt-3 text-sm leading-7 text-[#7F6B62]">كل الموديلات الحالية في مكان واحد، مع تفاصيل المقاس والسعر والطلب السريع.</p></div><ProductGrid products={products} categories={categories}/></div></section>;
}
