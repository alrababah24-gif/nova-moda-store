import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/components/product-detail-client"
import { getProductBySlug, getSettings } from "@/lib/data"

type Props = { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const settings = await getSettings()
  
  if (!product) return notFound()

  return <ProductDetailClient product={product} settings={settings} />
}
