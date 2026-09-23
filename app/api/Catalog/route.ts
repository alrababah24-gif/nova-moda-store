import { NextResponse } from "next/server"
import { getProducts } from "@/lib/data"

export async function GET() {
  const products = await getProducts()
  const baseUrl = "https://novamodaabaya.com"

  // Facebook يفضل CSV أو XML - هون بنعمل CSV
  const header = [
    "id",
    "title", 
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
    "google_product_category"
  ].join(",")

  const rows = products.map(p => {
    const id = p.id // لازم نفس الـ id اللي بنبعته في ViewContent: Abaya-125
    const title = `"${(p.name || "").replace(/"/g, '""')}"`
    const description = `"${(p.description || p.name || "").replace(/"/g, '""').substring(0, 5000)}"`
    const availability = p.inStock !== false ? "in stock" : "out of stock"
    const condition = "new"
    const price = `${p.price} JOD` // Facebook بده السعر مع العملة
    const link = `${baseUrl}/product/${p.slug}`
    const image = p.images?.[0] || p.image || `${baseUrl}/placeholder.jpg`
    const brand = "Nova Moda"
    const category = "Apparel & Accessories > Clothing > Dresses"

    return [id, title, description, availability, condition, price, link, image, brand, category].join(",")
  })

  const csv = [header, ...rows].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=facebook-catalog.csv",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate"
    }
  })
}
