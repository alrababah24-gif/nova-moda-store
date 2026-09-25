"use client";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  title?: string;
  name?: string;
  price?: number;
  amount?: number;
  image?: string;
  image_url?: string;
  thumbnail?: string;
  images?: string[] | any;
};

function getImageUrl(p: Product): string | null {
  if (p.image_url) return p.image_url;
  if (p.image) return p.image;
  if (p.thumbnail) return p.thumbnail;
  if (Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0];
    if (typeof first === "string") return first;
    if (first?.url) return first.url;
  }
  if (p.images && typeof p.images === "object" && p.images.url) return p.images.url;
  return null;
}

function getName(p: Product): string {
  return p.title || p.name || "عباية";
}

function getPrice(p: Product): string {
  const val = p.price ?? p.amount ?? 20;
  return `${val} JOD`;
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import("@/lib/supabase/client").catch(() => ({ createClient: null } as any));
        if (!createClient) {
          setLoading(false);
          return;
        }
        const supabase = createClient();
        const { data, error } = await supabase.from("products").select("*").limit(12);
        if (error) {
          console.warn("Supabase error:", error.message);
        }
        if (!error && data && data.length > 0) {
          setProducts(data as any);
        }
      } catch (e) {
        console.warn("ProductGrid load failed", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-3">
            <div className="h-48 bg-gray-100 animate-pulse rounded-lg mb-3" />
            <div className="h-4 bg-gray-100 animate-pulse rounded mb-2" />
            <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-500">لا توجد منتجات حالياً</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => {
        const img = getImageUrl(p);
        return (
          <div key={p.id} className="border rounded-xl p-3 hover:shadow-lg transition bg-white">
            <div className="h-48 bg-gray-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
              {img ? (
                <img
                  src={img}
                  alt={getName(p)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-gray-300 text-3xl">👗</div>
              )}
            </div>
            <div className="font-bold truncate text-[14px]">{getName(p)}</div>
            <div className="text-sm text-gray-600">{getPrice(p)}</div>
          </div>
        );
      })}
    </div>
  );
}
export default ProductGrid;
