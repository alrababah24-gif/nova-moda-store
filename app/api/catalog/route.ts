import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const COLUMNS = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "additional_image_link", "brand"];

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

function absoluteUrl(path: string, siteUrl: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Meta Commerce Manager product feed. The `id` column must equal the
// content_ids sent by the pixel (ViewContent / AddToCart / Purchase).
export async function GET(request: Request) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const products = await getProducts();

  const rows = products
    .filter((product) => product.images?.length)
    .map((product) => {
      const [image, ...extraImages] = product.images.map((src) => absoluteUrl(src, siteUrl));
      return [
        product.id,
        product.name,
        product.description || product.name,
        product.stock > 0 ? "in stock" : "out of stock",
        "new",
        `${Number(product.price).toFixed(2)} JOD`,
        `${siteUrl}/product/${product.slug}`,
        image,
        extraImages.slice(0, 10).join(","),
        product.brand?.name || "Nova Moda",
      ].map((cell) => csvCell(String(cell ?? ""))).join(",");
    });

  return new Response([COLUMNS.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=900",
    },
  });
}
