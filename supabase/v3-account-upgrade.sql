-- NOVA MODA PRO v3 - customer accounts & order tracking upgrade
-- Use this only if you already ran an older Nova Moda schema.

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists orders_user_idx on public.orders(user_id);

DROP POLICY IF EXISTS "profile update self" ON public.profiles;
CREATE POLICY "profile update self" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "customer read own orders" ON public.orders;
CREATE POLICY "customer read own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "customer read own order items" ON public.order_items;
CREATE POLICY "customer read own order items" ON public.order_items FOR SELECT TO authenticated USING (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

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

drop function if exists public.create_store_order(text,text,text,text,text,jsonb);
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
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'Order must contain at least one item'; end if;
  insert into public.orders (id,user_id,order_number,customer_name,phone,city,address,notes,subtotal,delivery_fee,total,status)
  values (v_order_id,p_user_id,v_order_number,p_customer_name,p_phone,p_city,p_address,nullif(p_notes,''),0,0,0,'جديد');
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := greatest(1, least(10, coalesce((v_item->>'qty')::integer,1)));
    select * into v_product from public.products where id=(v_item->>'productId')::uuid and active=true for update;
    if not found then raise exception 'Product is unavailable'; end if;
    if v_product.stock < v_qty then raise exception 'Insufficient stock for %',v_product.name; end if;
    v_line := v_product.price*v_qty; v_subtotal := v_subtotal+v_line;
    insert into public.order_items(order_id,product_id,product_name,size,color,qty,unit_price,line_total)
    values(v_order_id,v_product.id,v_product.name,coalesce(v_item->>'size',''),nullif(v_item->>'color',''),v_qty,v_product.price,v_line);
    update public.products set stock=stock-v_qty where id=v_product.id;
  end loop;
  select coalesce(s.delivery_price,2),coalesce(s.whatsapp,'962798960051') into v_delivery,v_whatsapp from public.store_settings s where s.id=1;
  update public.orders set subtotal=v_subtotal,delivery_fee=v_delivery,total=v_subtotal+v_delivery where id=v_order_id;
  return query select v_order_id,v_order_number,v_subtotal,v_delivery,v_subtotal+v_delivery,v_whatsapp;
end;
$$;
revoke all on function public.create_store_order(text,text,text,text,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.create_store_order(text,text,text,text,text,jsonb,uuid) to service_role;

-- Optional but recommended: realtime catalog publishing.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='products') then alter publication supabase_realtime add table public.products; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='brands') then alter publication supabase_realtime add table public.brands; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='categories') then alter publication supabase_realtime add table public.categories; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='store_settings') then alter publication supabase_realtime add table public.store_settings; end if;
end $$;
