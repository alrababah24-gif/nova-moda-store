"use client";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

// نسخة آمنة لا تعمل crash - اذا Supabase فشل بترجع فاضي
export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // محاولة جلب المنتجات - اذا فشل ما بوقع الصفحة
        const { createClient } = await import("@/lib/supabase/client").catch(() => ({ createClient: null } as any));
        if (!createClient) {
          setLoading(false);
          return;
        }
        const supabase = createClient();
        const { data, error } = await supabase.from("products").select("*").limit(12);
        if (!error && data) {
          setProducts(data as any);
        }
      } catch (e) {
        console.warn("ProductGrid load failed, showing fallback", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="h-64 bg-gray-100 animate-pulse rounded-xl" /><div className="h-64 bg-gray-100 animate-pulse rounded-xl" /><div className="h-64 bg-gray-100 animate-pulse rounded-xl" /><div className="h-64 bg-gray-100 animate-pulse rounded-xl" /></div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-500">لا توجد منتجات حالياً - سيتم إضافتها قريباً</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <div key={p.id} className="border rounded-xl p-3">
          <div className="h-48 bg-gray-100 rounded-lg mb-3" />
          <div className="font-bold truncate">{p.name}</div>
          <div className="text-sm text-gray-600">{p.price} JOD</div>
        </div>
      ))}
    </div>
  );
}
export default ProductGrid;
