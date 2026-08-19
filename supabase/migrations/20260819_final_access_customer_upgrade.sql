-- NOVA MODA final access/customer upgrade for an existing Supabase project.
begin;

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists permissions jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists marketing_consent boolean not null default false;
alter table public.profiles add column if not exists marketing_consent_at timestamptz;
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('customer','editor','admin','owner'));
create index if not exists profiles_email_idx on public.profiles(lower(email));
create index if not exists profiles_role_idx on public.profiles(role);

update public.profiles p set email = u.email from auth.users u where u.id=p.id and (p.email is null or p.email='');

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles (id,email,full_name,phone,role,marketing_consent,marketing_consent_at)
  values (new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',''),nullif(new.raw_user_meta_data->>'phone',''),'customer',coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean,false),case when coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean,false) then now() else null end)
  on conflict (id) do update set email=excluded.email;
  return new;
end;$$;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in ('owner','admin','editor'));
$$;

create or replace function public.has_permission(permission_name text)
returns boolean language plpgsql stable security definer set search_path=public as $$
declare r text; p jsonb; fallback boolean:=false;
begin
  select role,permissions into r,p from public.profiles where id=auth.uid();
  if r is null or r='customer' then return false; end if;
  if r='owner' then fallback:=true;
  elsif r='admin' then fallback:=permission_name<>'staff';
  elsif r='editor' then fallback:=permission_name in ('catalog','content'); end if;
  if p ? permission_name then return coalesce((p->>permission_name)::boolean,fallback); end if;
  return fallback;
end;$$;
grant execute on function public.has_permission(text) to authenticated;

-- Permission-aware write policies.
drop policy if exists "admin manage store settings" on public.store_settings; drop policy if exists "staff manage store settings" on public.store_settings;
create policy "staff manage store settings" on public.store_settings for all to authenticated using(public.has_permission('settings')) with check(public.has_permission('settings'));
drop policy if exists "admin manage brands" on public.brands; drop policy if exists "staff manage brands" on public.brands;
create policy "staff manage brands" on public.brands for all to authenticated using(public.has_permission('catalog')) with check(public.has_permission('catalog'));
drop policy if exists "admin manage categories" on public.categories; drop policy if exists "staff manage categories" on public.categories;
create policy "staff manage categories" on public.categories for all to authenticated using(public.has_permission('catalog')) with check(public.has_permission('catalog'));
drop policy if exists "admin manage products" on public.products; drop policy if exists "staff manage products" on public.products;
create policy "staff manage products" on public.products for all to authenticated using(public.has_permission('catalog')) with check(public.has_permission('catalog'));
drop policy if exists "admin manage testimonials" on public.testimonials; drop policy if exists "staff manage testimonials" on public.testimonials;
create policy "staff manage testimonials" on public.testimonials for all to authenticated using(public.has_permission('content')) with check(public.has_permission('content'));
drop policy if exists "admin manage faqs" on public.faqs; drop policy if exists "staff manage faqs" on public.faqs;
create policy "staff manage faqs" on public.faqs for all to authenticated using(public.has_permission('content')) with check(public.has_permission('content'));
drop policy if exists "admin manage page content" on public.page_content; drop policy if exists "staff manage page content" on public.page_content;
create policy "staff manage page content" on public.page_content for all to authenticated using(public.has_permission('content')) with check(public.has_permission('content'));
drop policy if exists "admin manage orders" on public.orders; drop policy if exists "staff manage orders" on public.orders;
create policy "staff manage orders" on public.orders for all to authenticated using(public.has_permission('orders')) with check(public.has_permission('orders'));
drop policy if exists "admin manage order items" on public.order_items; drop policy if exists "staff manage order items" on public.order_items;
create policy "staff manage order items" on public.order_items for all to authenticated using(public.has_permission('orders')) with check(public.has_permission('orders'));
drop policy if exists "admin manage contact messages" on public.contact_messages; drop policy if exists "staff manage contact messages" on public.contact_messages;
create policy "staff manage contact messages" on public.contact_messages for all to authenticated using(public.has_permission('customers')) with check(public.has_permission('customers'));
drop policy if exists "admin manage profiles" on public.profiles; drop policy if exists "staff read customers" on public.profiles;
create policy "staff read customers" on public.profiles for select to authenticated using(public.has_permission('customers') or public.has_permission('staff'));

drop policy if exists "admin upload nova media" on storage.objects; drop policy if exists "staff upload nova media" on storage.objects;
create policy "staff upload nova media" on storage.objects for insert to authenticated with check(bucket_id in ('product-images','brand-assets') and public.has_permission('catalog'));
drop policy if exists "admin update nova media" on storage.objects; drop policy if exists "staff update nova media" on storage.objects;
create policy "staff update nova media" on storage.objects for update to authenticated using(bucket_id in ('product-images','brand-assets') and public.has_permission('catalog')) with check(bucket_id in ('product-images','brand-assets') and public.has_permission('catalog'));
drop policy if exists "admin delete nova media" on storage.objects; drop policy if exists "staff delete nova media" on storage.objects;
create policy "staff delete nova media" on storage.objects for delete to authenticated using(bucket_id in ('product-images','brand-assets') and public.has_permission('catalog'));

commit;

-- Security hardening: prevent users from changing their own role/permissions through a normal client.
drop policy if exists "profile read self" on public.profiles;
create policy "profile read self" on public.profiles for select to authenticated using(id=auth.uid());
revoke update on public.profiles from authenticated;
grant update (full_name,phone,city,address,avatar_url,marketing_consent,marketing_consent_at) on public.profiles to authenticated;
