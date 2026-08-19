-- NOVA MODA - Supabase schema
-- Run this once in Supabase SQL Editor on a new project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  address text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  store_name text not null default 'نوفا مودا',
  top_bar_text text not null default 'توصيل لجميع محافظات الأردن',
  delivery_price numeric(10,2) not null default 2 check (delivery_price >= 0),
  whatsapp text not null default '962798960051',
  phone text not null default '0798960051',
  address text not null default 'عمّان - الأردن',
  hours text not null default 'يومياً: 9 صباحاً - 10 مساءً',
  open_time time not null default '09:00',
  close_time time not null default '22:00',
  facebook text not null default '',
  instagram text not null default '',
  primary_color text not null default '#C19A7A',
  background_color text not null default '#FFFBF7',
  hero_eyebrow text not null default 'NOVA MODA • AMMAN • MODEST FASHION',
  hero_title text not null default 'نوفا مودا — العباية عندنا حضور، مش مجرد قطعة.',
  hero_description text not null default '',
  hero_primary_cta text not null default 'تسوّقي الآن',
  hero_secondary_cta text not null default 'تواصلي واتساب',
  logo_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


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

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price is null or compare_at_price >= 0),
  badge text,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_brand_idx on public.products(brand_id);
create index if not exists products_active_featured_idx on public.products(active, featured);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  notes text,
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'جديد' check (status in ('جديد','قيد التجهيز','تم الشحن','تم التوصيل','ملغي')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text not null,
  color text,
  qty integer not null check (qty > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  line_total numeric(10,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items(order_id);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  text text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.page_content (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Generic updated_at trigger.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['profiles','store_settings','brands','categories','products','orders','testimonials','faqs','page_content']
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

-- Create a profile whenever a Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), nullif(new.raw_user_meta_data->>'phone',''), 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Helper used by RLS policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.store_settings enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.page_content enable row level security;

-- Profiles
DROP POLICY IF EXISTS "profile read self" ON public.profiles;
CREATE POLICY "profile read self" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS "profile update self" ON public.profiles;
CREATE POLICY "profile update self" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "admin manage profiles" ON public.profiles;
CREATE POLICY "admin manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Public store content can be read by visitors; only admins can mutate it.
DROP POLICY IF EXISTS "public read store settings" ON public.store_settings;
CREATE POLICY "public read store settings" ON public.store_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin manage store settings" ON public.store_settings;
CREATE POLICY "admin manage store settings" ON public.store_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


DROP POLICY IF EXISTS "public read active brands" ON public.brands;
CREATE POLICY "public read active brands" ON public.brands FOR SELECT TO anon, authenticated USING (active OR public.is_admin());
DROP POLICY IF EXISTS "admin manage brands" ON public.brands;
CREATE POLICY "admin manage brands" ON public.brands FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "public read active categories" ON public.categories;
CREATE POLICY "public read active categories" ON public.categories FOR SELECT TO anon, authenticated USING (active OR public.is_admin());
DROP POLICY IF EXISTS "admin manage categories" ON public.categories;
CREATE POLICY "admin manage categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "public read active products" ON public.products;
CREATE POLICY "public read active products" ON public.products FOR SELECT TO anon, authenticated USING (active OR public.is_admin());
DROP POLICY IF EXISTS "admin manage products" ON public.products;
CREATE POLICY "admin manage products" ON public.products FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "public read active testimonials" ON public.testimonials;
CREATE POLICY "public read active testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (active OR public.is_admin());
DROP POLICY IF EXISTS "admin manage testimonials" ON public.testimonials;
CREATE POLICY "admin manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "public read active faqs" ON public.faqs;
CREATE POLICY "public read active faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (active OR public.is_admin());
DROP POLICY IF EXISTS "admin manage faqs" ON public.faqs;
CREATE POLICY "admin manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "public read page content" ON public.page_content;
CREATE POLICY "public read page content" ON public.page_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin manage page content" ON public.page_content;
CREATE POLICY "admin manage page content" ON public.page_content FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Atomic order creation: prices are read from the database, stock is locked/decremented,
-- and all inserts roll back together if any item is invalid or unavailable.
create or replace function public.create_store_order(
  p_customer_name text,
  p_phone text,
  p_city text,
  p_address text,
  p_notes text,
  p_items jsonb,
  p_user_id uuid default null
)
returns table (
  order_id uuid,
  order_number text,
  subtotal numeric,
  delivery_fee numeric,
  total numeric,
  whatsapp text
)
language plpgsql
security definer set search_path = public
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_order_number text := 'NM-' || to_char(clock_timestamp(),'YYMMDDHH24MISS') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,4));
  v_subtotal numeric(10,2) := 0;
  v_delivery numeric(10,2) := 0;
  v_whatsapp text := '962798960051';
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_line numeric(10,2);
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.orders (id, user_id, order_number, customer_name, phone, city, address, notes, subtotal, delivery_fee, total, status)
  values (v_order_id, p_user_id, v_order_number, p_customer_name, p_phone, p_city, p_address, nullif(p_notes,''), 0, 0, 0, 'جديد');

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest(1, least(10, coalesce((v_item->>'qty')::integer, 1)));
    select * into v_product
    from public.products
    where id = (v_item->>'productId')::uuid and active = true
    for update;

    if not found then
      raise exception 'Product is unavailable';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;

    v_line := v_product.price * v_qty;
    v_subtotal := v_subtotal + v_line;

    insert into public.order_items (order_id, product_id, product_name, size, color, qty, unit_price, line_total)
    values (
      v_order_id,
      v_product.id,
      v_product.name,
      coalesce(v_item->>'size',''),
      nullif(v_item->>'color',''),
      v_qty,
      v_product.price,
      v_line
    );

    update public.products set stock = stock - v_qty where id = v_product.id;
  end loop;

  select coalesce(s.delivery_price,2), coalesce(s.whatsapp,'962798960051')
  into v_delivery, v_whatsapp
  from public.store_settings s where s.id = 1;

  update public.orders
  set subtotal = v_subtotal, delivery_fee = v_delivery, total = v_subtotal + v_delivery
  where id = v_order_id;

  return query select v_order_id, v_order_number, v_subtotal, v_delivery, v_subtotal + v_delivery, v_whatsapp;
end;
$$;

revoke all on function public.create_store_order(text,text,text,text,text,jsonb,uuid) from public, anon, authenticated;
grant execute on function public.create_store_order(text,text,text,text,text,jsonb,uuid) to service_role;

-- Orders and contact messages are private. Public writes happen only through server API routes using service-role credentials.
DROP POLICY IF EXISTS "admin manage orders" ON public.orders;
CREATE POLICY "admin manage orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "customer read own orders" ON public.orders;
CREATE POLICY "customer read own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "admin manage order items" ON public.order_items;
CREATE POLICY "admin manage order items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "customer read own order items" ON public.order_items;
CREATE POLICY "customer read own order items" ON public.order_items FOR SELECT TO authenticated USING (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
DROP POLICY IF EXISTS "admin manage contact messages" ON public.contact_messages;
CREATE POLICY "admin manage contact messages" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Public Storage buckets for product images and replaceable brand assets.
insert into storage.buckets (id, name, public)
values ('product-images','product-images',true), ('brand-assets','brand-assets',true)
on conflict (id) do update set public = excluded.public;

DROP POLICY IF EXISTS "public read nova media" ON storage.objects;
CREATE POLICY "public read nova media" ON storage.objects FOR SELECT TO public USING (bucket_id in ('product-images','brand-assets'));
DROP POLICY IF EXISTS "admin upload nova media" ON storage.objects;
CREATE POLICY "admin upload nova media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id in ('product-images','brand-assets') AND public.is_admin());
DROP POLICY IF EXISTS "admin update nova media" ON storage.objects;
CREATE POLICY "admin update nova media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id in ('product-images','brand-assets') AND public.is_admin()) WITH CHECK (bucket_id in ('product-images','brand-assets') AND public.is_admin());
DROP POLICY IF EXISTS "admin delete nova media" ON storage.objects;
CREATE POLICY "admin delete nova media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id in ('product-images','brand-assets') AND public.is_admin());

-- Enable Supabase Realtime for catalog changes so an open storefront can refresh
-- when an admin publishes or edits products/brands/categories/settings.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='products') then alter publication supabase_realtime add table public.products; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='brands') then alter publication supabase_realtime add table public.brands; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='categories') then alter publication supabase_realtime add table public.categories; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='store_settings') then alter publication supabase_realtime add table public.store_settings; end if;
end $$;

-- FINAL ACCESS + CUSTOMER DATA UPGRADE
-- Safe to keep in the base schema; the matching migration can be used on an existing project.
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists permissions jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists marketing_consent boolean not null default false;
alter table public.profiles add column if not exists marketing_consent_at timestamptz;
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('customer','editor','admin','owner'));
create index if not exists profiles_email_idx on public.profiles(lower(email));
create index if not exists profiles_role_idx on public.profiles(role);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role, marketing_consent, marketing_consent_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone',''),
    'customer',
    coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean, false),
    case when coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean, false) then now() else null end
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('owner','admin','editor')
  );
$$;

create or replace function public.has_permission(permission_name text)
returns boolean
language plpgsql
stable
security definer set search_path = public
as $$
declare
  r text;
  p jsonb;
  fallback boolean := false;
begin
  select role, permissions into r, p from public.profiles where id = auth.uid();
  if r is null or r = 'customer' then return false; end if;
  if r = 'owner' then fallback := true;
  elsif r = 'admin' then fallback := permission_name <> 'staff';
  elsif r = 'editor' then fallback := permission_name in ('catalog','content');
  end if;
  if p ? permission_name then return coalesce((p->>permission_name)::boolean, fallback); end if;
  return fallback;
end;
$$;
grant execute on function public.has_permission(text) to authenticated;

-- Replace broad legacy admin write policies with permission-aware policies.
drop policy if exists "admin manage store settings" on public.store_settings;
create policy "staff manage store settings" on public.store_settings for all to authenticated using (public.has_permission('settings')) with check (public.has_permission('settings'));
drop policy if exists "admin manage brands" on public.brands;
create policy "staff manage brands" on public.brands for all to authenticated using (public.has_permission('catalog')) with check (public.has_permission('catalog'));
drop policy if exists "admin manage categories" on public.categories;
create policy "staff manage categories" on public.categories for all to authenticated using (public.has_permission('catalog')) with check (public.has_permission('catalog'));
drop policy if exists "admin manage products" on public.products;
create policy "staff manage products" on public.products for all to authenticated using (public.has_permission('catalog')) with check (public.has_permission('catalog'));
drop policy if exists "admin manage testimonials" on public.testimonials;
create policy "staff manage testimonials" on public.testimonials for all to authenticated using (public.has_permission('content')) with check (public.has_permission('content'));
drop policy if exists "admin manage faqs" on public.faqs;
create policy "staff manage faqs" on public.faqs for all to authenticated using (public.has_permission('content')) with check (public.has_permission('content'));
drop policy if exists "admin manage page content" on public.page_content;
create policy "staff manage page content" on public.page_content for all to authenticated using (public.has_permission('content')) with check (public.has_permission('content'));
drop policy if exists "admin manage orders" on public.orders;
create policy "staff manage orders" on public.orders for all to authenticated using (public.has_permission('orders')) with check (public.has_permission('orders'));
drop policy if exists "admin manage order items" on public.order_items;
create policy "staff manage order items" on public.order_items for all to authenticated using (public.has_permission('orders')) with check (public.has_permission('orders'));
drop policy if exists "admin manage contact messages" on public.contact_messages;
create policy "staff manage contact messages" on public.contact_messages for all to authenticated using (public.has_permission('customers')) with check (public.has_permission('customers'));

-- Profiles: customers can still read/update themselves; staff with customer access can view customer records.
drop policy if exists "admin manage profiles" on public.profiles;
drop policy if exists "staff read customers" on public.profiles;
create policy "staff read customers" on public.profiles for select to authenticated using (public.has_permission('customers') or public.has_permission('staff'));

-- Catalog media follows catalog permission.
drop policy if exists "admin upload nova media" on storage.objects;
create policy "staff upload nova media" on storage.objects for insert to authenticated with check (bucket_id in ('product-images','brand-assets') and public.has_permission('catalog'));
drop policy if exists "admin update nova media" on storage.objects;
create policy "staff update nova media" on storage.objects for update to authenticated using (bucket_id in ('product-images','brand-assets') and public.has_permission('catalog')) with check (bucket_id in ('product-images','brand-assets') and public.has_permission('catalog'));
drop policy if exists "admin delete nova media" on storage.objects;
create policy "staff delete nova media" on storage.objects for delete to authenticated using (bucket_id in ('product-images','brand-assets') and public.has_permission('catalog'));

-- Lock privileged profile fields. Customers may edit profile/contact fields only, never role or permissions.
drop policy if exists "profile read self" on public.profiles;
create policy "profile read self" on public.profiles for select to authenticated using (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (full_name, phone, city, address, avatar_url, marketing_consent, marketing_consent_at) on public.profiles to authenticated;
