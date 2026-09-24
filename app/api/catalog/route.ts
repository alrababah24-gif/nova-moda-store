import { getProducts } from "@/lib/data";
import { getSizeStock } from "@/lib/utils";

// Product feed for the Meta (Facebook/Instagram) catalog, generated from the live store products.
export const revalidate = 3600;

const COLUMNS = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand"] as const;

function csvCell(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  return /[",]/.test(clean) ? `"${clean.replace(/"/g, '""')}"` : clean;
}

function absoluteUrl(base: string, path: string) {
  return /^https?:\/\//.test(path) ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://novamodaabaya.com").replace(/\/$/, "");
  const products = await getProducts();

  const rows = products.map((product) => {
    const inStock = product.sizes.length
      ? product.sizes.some((size) => getSizeStock(product, size) > 0)
      : product.stock > 0;
    return [
      product.id,
      product.name,
      product.description || product.name,
      inStock ? "in stock" : "out of stock",
      "new",
      `${product.price.toFixed(2)} JOD`,
      `${base}/product/${product.slug}`,
      absoluteUrl(base, product.images[0] || "/products/abaya-classic-beige.svg"),
      product.brand?.name || "Nova Moda",
    ].map(csvCell).join(",");
  });

  return new Response([COLUMNS.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
