export type StoreSettings = {
  id?: number;
  store_name: string;
  top_bar_text: string;
  delivery_price: number;
  whatsapp: string;
  phone: string;
  address: string;
  hours: string;
  open_time: string;
  close_time: string;
  facebook: string;
  instagram: string;
  primary_color: string;
  background_color: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
  logo_url?: string | null;
  updated_at?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  logo_url?: string | null;
  cover_image?: string | null;
  sort_order: number;
  active: boolean;
  featured: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order: number;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  category_id?: string | null;
  category?: Category | null;
  brand_id?: string | null;
  brand?: Brand | null;
  badge?: string | null;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  text: string;
  rating: number;
  active: boolean;
  sort_order: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  sort_order: number;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  size: string;
  color?: string;
  qty: number;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  created_at: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  intro: string;
  process_title: string;
  process_intro: string;
  why_title: string;
  why_intro: string;
  why_points: string[];
};

export type StaffRole = "customer" | "editor" | "admin" | "owner";

export type StaffPermissions = {
  catalog?: boolean;
  orders?: boolean;
  content?: boolean;
  customers?: boolean;
  settings?: boolean;
  staff?: boolean;
};

export type Profile = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
  avatar_url?: string | null;
  role: StaffRole;
  permissions?: StaffPermissions | null;
  marketing_consent?: boolean;
  marketing_consent_at?: string | null;
  created_at?: string;
  updated_at?: string;
};
