-- Upgrade an existing Nova Moda database to the PRO multi-page version.
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  logo_url text,
  cover_image text,
  sort_order integer not null default 0,
  active boolean not null default true,
  featured boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists brand_id uuid references public.brands(id) on delete set null;
create index if not exists products_brand_idx on public.products(brand_id);

alter table public.brands enable row level security;
DROP POLICY IF EXISTS "public read active brands" ON public.brands;
CREATE POLICY "public read active brands" ON public.brands FOR SELECT TO anon, authenticated USING (active OR public.is_admin());
DROP POLICY IF EXISTS "admin manage brands" ON public.brands;
CREATE POLICY "admin manage brands" ON public.brands FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

drop trigger if exists set_brands_updated_at on public.brands;
create trigger set_brands_updated_at before update on public.brands for each row execute function public.set_updated_at();
