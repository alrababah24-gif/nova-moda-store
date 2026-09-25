import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function getImageUrl(images: unknown): string {
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];

    if (typeof first === "string") {
      return first;
    }

    if (
      first &&
      typeof first === "object" &&
      "url" in first &&
      typeof (first as { url?: unknown }).url === "string"
    ) {
      return (first as { url: string }).url;
    }
  }

  if (
    images &&
    typeof images === "object" &&
    "url" in images &&
    typeof (images as { url?: unknown }).url === "string"
  ) {
    return (images as { url: string }).url;
  }

  return "";
}

export async function GET() {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return new NextResponse("Supabase is not configured", {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("Facebook feed Supabase error:", error);

      return new NextResponse(`Supabase error: ${error.message}`, {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const products = data ?? [];

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://novamodaabaya.com";

    const rows = [
      [
        "id",
        "title",
        "description",
        "availability",
        "condition",
        "price",
        "link",
        "image_link",
        "brand",
      ],
    ];

    for (const product of products) {
      const id = String(product.id ?? "");
      const title = String(product.name ?? "عباية");
      const description = String(product.description ?? "");
      const price = Number(product.price ?? 0);
      const slug = String(product.slug ?? "");
      const imageUrl = getImageUrl(product.images);

      const availability =
        Number(product.stock ?? 0) > 0
          ? "in stock"
          : "out of stock";

      const link = slug
        ? `${siteUrl}/product/${encodeURIComponent(slug)}`
        : siteUrl;

      rows.push([
        id,
        title,
        description,
        availability,
        "new",
        `${price.toFixed(2)} JOD`,
        link,
        imageUrl,
        "Nova Moda",
      ]);
    }

    const csv = rows
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Facebook feed error:", error);

    return new NextResponse("Failed to generate Facebook feed", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
