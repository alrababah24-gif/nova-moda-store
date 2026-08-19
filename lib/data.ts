import {
  fallbackBrands,
  fallbackCategories,
  fallbackFaqs,
  fallbackProducts,
  fallbackSettings,
  fallbackTestimonials,
  fallbackAbout,
} from "@/data/fallback";
import type { AboutContent, Brand, Category, Faq, Product, StoreSettings, Testimonial } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

function mapProduct(row: Record<string, unknown>): Product {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  const brand = Array.isArray(row.brand) ? row.brand[0] : row.brand;
  return {
    id: String(row.id), name: String(row.name ?? ""), slug: String(row.slug ?? ""), description: String(row.description ?? ""),
    price: Number(row.price ?? 0), compare_at_price: row.compare_at_price == null ? null : Number(row.compare_at_price),
    category_id: row.category_id ? String(row.category_id) : null, category: category ? (category as Category) : null,
    brand_id: row.brand_id ? String(row.brand_id) : null, brand: brand ? (brand as Brand) : null,
    badge: row.badge ? String(row.badge) : null, sizes: Array.isArray(row.sizes) ? row.sizes.map(String) : [],
    colors: Array.isArray(row.colors) ? row.colors.map(String) : [], images: Array.isArray(row.images) ? row.images.map(String) : [],
    stock: Number(row.stock ?? 0), featured: Boolean(row.featured), active: Boolean(row.active),
    created_at: row.created_at ? String(row.created_at) : undefined, updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export async function getSettings(): Promise<StoreSettings> {
  if (!isSupabaseConfigured()) return fallbackSettings;
  const supabase = await createClient(); if (!supabase) return fallbackSettings;
  const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).maybeSingle();
  return error || !data ? fallbackSettings : ({ ...fallbackSettings, ...data } as StoreSettings);
}

export async function getBrands(options?: { featured?: boolean; includeInactive?: boolean }): Promise<Brand[]> {
  if (!isSupabaseConfigured()) return fallbackBrands.filter(b => (!options?.featured || b.featured) && (options?.includeInactive || b.active));
  const supabase = await createClient(); if (!supabase) return fallbackBrands;
  let query = supabase.from("brands").select("*").order("sort_order");
  if (!options?.includeInactive) query = query.eq("active", true);
  if (options?.featured) query = query.eq("featured", true);
  const { data, error } = await query;
  return error || !data?.length ? fallbackBrands : (data as Brand[]);
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  if (!isSupabaseConfigured()) return fallbackBrands.find(b => b.slug === slug) ?? null;
  const supabase = await createClient(); if (!supabase) return fallbackBrands.find(b => b.slug === slug) ?? null;
  const { data, error } = await supabase.from("brands").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return error || !data ? null : (data as Brand);
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return fallbackCategories;
  const supabase = await createClient(); if (!supabase) return fallbackCategories;
  const { data, error } = await supabase.from("categories").select("*").eq("active", true).order("sort_order");
  return error || !data?.length ? fallbackCategories : (data as Category[]);
}

export async function getProducts(options?: { featured?: boolean; category?: string; brand?: string; search?: string; includeInactive?: boolean }): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    let products = [...fallbackProducts];
    if (options?.featured) products = products.filter(p => p.featured);
    if (options?.category && options.category !== "all") products = products.filter(p => p.category?.slug === options.category);
    if (options?.brand) products = products.filter(p => p.brand?.slug === options.brand);
    if (options?.search) { const q = options.search.toLowerCase(); products = products.filter(p => `${p.name} ${p.description} ${p.brand?.name || ""}`.toLowerCase().includes(q)); }
    return products;
  }
  const supabase = await createClient(); if (!supabase) return fallbackProducts;
  let query = supabase.from("products").select("*, category:categories(id,name,slug,description,sort_order,active), brand:brands(id,name,slug,tagline,description,logo_url,cover_image,sort_order,active,featured)").order("created_at", { ascending: false });
  if (!options?.includeInactive) query = query.eq("active", true);
  if (options?.featured) query = query.eq("featured", true);
  const { data, error } = await query; if (error || !data) return fallbackProducts;
  let products = data.map(row => mapProduct(row as Record<string, unknown>));
  if (options?.category && options.category !== "all") products = products.filter(p => p.category?.slug === options.category);
  if (options?.brand) products = products.filter(p => p.brand?.slug === options.brand);
  if (options?.search) { const q = options.search.toLowerCase(); products = products.filter(p => `${p.name} ${p.description} ${p.brand?.name || ""}`.toLowerCase().includes(q)); }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return fallbackProducts.find(p => p.slug === slug) ?? null;
  const supabase = await createClient(); if (!supabase) return fallbackProducts.find(p => p.slug === slug) ?? null;
  const { data, error } = await supabase.from("products")
    .select("*, category:categories(id,name,slug,description,sort_order,active), brand:brands(id,name,slug,tagline,description,logo_url,cover_image,sort_order,active,featured)")
    .eq("slug", slug).eq("active", true).maybeSingle();
  return error || !data ? null : mapProduct(data as Record<string, unknown>);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return fallbackTestimonials;
  const supabase = await createClient(); if (!supabase) return fallbackTestimonials;
  const { data, error } = await supabase.from("testimonials").select("*").eq("active", true).order("sort_order");
  return error || !data?.length ? fallbackTestimonials : (data as Testimonial[]);
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured()) return fallbackFaqs;
  const supabase = await createClient(); if (!supabase) return fallbackFaqs;
  const { data, error } = await supabase.from("faqs").select("*").eq("active", true).order("sort_order");
  return error || !data?.length ? fallbackFaqs : (data as Faq[]);
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!isSupabaseConfigured()) return fallbackAbout;
  const supabase = await createClient(); if (!supabase) return fallbackAbout;
  const { data, error } = await supabase.from("page_content").select("content").eq("key", "about").maybeSingle();
  return error || !data?.content ? fallbackAbout : ({ ...fallbackAbout, ...(data.content as Partial<AboutContent>) } as AboutContent);
}
