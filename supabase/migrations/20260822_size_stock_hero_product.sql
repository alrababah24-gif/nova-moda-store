-- Nova Moda: per-size stock + admin-selected hero product.
-- Run this once in Supabase SQL Editor before deploying the matching frontend update.

alter table public.products
  add column if not exists size_stock jsonb not null default '{}'::jsonb;

alter table public.store_settings
  add column if not exists hero_product_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'store_settings_hero_product_id_fkey'
  ) then
    alter table public.store_settings
      add constraint store_settings_hero_product_id_fkey
      foreign key (hero_product_id) references public.products(id) on delete set null;
  end if;
end $$;

-- Give existing products a sensible per-size stock map by distributing their current
-- total stock across their current sizes. Admins can then fine-tune each size normally.
with mapped as (
  select
    p.id,
    jsonb_object_agg(
      u.size,
      (p.stock / cardinality(p.sizes))
      + case when u.ord <= (p.stock % cardinality(p.sizes)) then 1 else 0 end
    ) as stock_map
  from public.products p
  cross join lateral unnest(p.sizes) with ordinality as u(size, ord)
  where cardinality(p.sizes) > 0
    and (p.size_stock is null or p.size_stock = '{}'::jsonb)
  group by p.id, p.stock, p.sizes
)
update public.products p
set size_stock = mapped.stock_map
from mapped
where p.id = mapped.id;

create or replace function public.sync_product_total_stock()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_total integer := 0;
begin
  if new.size_stock is not null
     and jsonb_typeof(new.size_stock) = 'object'
     and new.size_stock <> '{}'::jsonb then
    select coalesce(sum(greatest(0, value::integer)), 0)
      into v_total
    from jsonb_each_text(new.size_stock);
    new.stock := v_total;
  end if;
  return new;
end;
$$;

drop trigger if exists products_sync_total_stock on public.products;
create trigger products_sync_total_stock
before insert or update of size_stock on public.products
for each row execute function public.sync_product_total_stock();

-- Checkout now validates and decrements the selected size only.
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
  v_size text;
  v_size_stock integer;
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
    v_size := trim(coalesce(v_item->>'size',''));

    select * into v_product
    from public.products
    where id = (v_item->>'productId')::uuid and active = true
    for update;

    if not found then
      raise exception 'Product is unavailable';
    end if;

    if v_size = '' or not (coalesce(v_product.size_stock, '{}'::jsonb) ? v_size) then
      raise exception 'Size is unavailable for %', v_product.name;
    end if;

    v_size_stock := greatest(0, coalesce((v_product.size_stock->>v_size)::integer, 0));
    if v_size_stock < v_qty then
      raise exception 'Insufficient stock for % size %', v_product.name, v_size;
    end if;

    v_line := v_product.price * v_qty;
    v_subtotal := v_subtotal + v_line;

    insert into public.order_items (order_id, product_id, product_name, size, color, qty, unit_price, line_total)
    values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_size,
      nullif(v_item->>'color',''),
      v_qty,
      v_product.price,
      v_line
    );

    update public.products
    set size_stock = jsonb_set(
      coalesce(size_stock, '{}'::jsonb),
      array[v_size],
      to_jsonb(v_size_stock - v_qty),
      false
    )
    where id = v_product.id;
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
