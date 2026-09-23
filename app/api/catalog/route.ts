
// @ts-nocheck
import { NextResponse } from "next/server"
import { getProducts } from "@/lib/data"

export async function GET() {
  const products = await getProducts()
  const baseUrl = "https://novamodaabaya.com"

  const header = [
    "id",
    "title", 
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand"
  ].join(",")

  const rows = products.map((p: any) => {
    const id = p.id || p.slug
    const title = `"${(p.name || "").toString().replace(/"/g, '""')}"`
    const desc = (p.description || p.name || "").toString().replace(/"/g, '""').substring(0, 4000)
    const description = `"${desc}"`
    
    // عندك stock مش inStock
    const inStock = p.stock !== undefined ? p.stock > 0 : true
    const availability = inStock ? "in stock" : "out of stock"
    
    const condition = "new"
    const price = `${p.price} JOD`
    const link = `${baseUrl}/product/${p.slug}`
    
    // عندك images مش image - ناخد اول صورة
    let img = ""
    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      img = typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || ""
    } else if (p.image) {
      img = p.image
    }
    if (!img) img = `${baseUrl}/placeholder.jpg`
    
    const brand = "Nova Moda"

    return [id, title, description, availability, condition, price, link, img, brand].join(",")
  })

  const csv = [header, ...rows].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "s-maxage=3600"
    }
  })
}
