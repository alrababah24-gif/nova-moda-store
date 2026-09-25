import { NextResponse } from "next/server";
import { fallbackProducts } from "@/data/fallback";

export async function GET() {
  const products = fallbackProducts
    .filter((product: any) => product.active !== false)
    .map((product: any) => ({
      id: String(product.id),
      title: product.name,
      description: product.description || product.name,
      availability:
        Number(product.stock ?? 0) > 0 ? "in stock" : "out of stock",
      condition: "new",
      price: `${Number(product.price || 0).toFixed(2)} JOD`,
      link: `https://novamodaabaya.com/product/${product.slug}`,

      image_link:
        typeof product.images?.[0] === "string"
          ? product.images[0]
          : product.images?.[0]?.url ||
            product.images?.[0]?.src ||
            product.image?.url ||
            product.image?.src ||
            (typeof product.image === "string" ? product.image : ""),

      brand: product.brand || "Nova Moda Abaya",
    }));

  const headers = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
  ];

  const csv = [
    headers.join(","),
    ...products.map((product) =>
      headers
        .map((header) => {
          const value = String(
            product[header as keyof typeof product] ?? ""
          );
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
