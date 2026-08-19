-- NOVA MODA: make the first account the OWNER.
-- 1) Create your own user first in Supabase Dashboard > Authentication > Users.
-- 2) Replace the email below with YOUR email.
-- 3) Run this file once in SQL Editor.

insert into public.profiles (id, email, full_name, role, permissions)
select id, email, coalesce(raw_user_meta_data->>'full_name', 'Nova Moda Owner'), 'owner',
       '{"catalog":true,"orders":true,"content":true,"customers":true,"settings":true,"staff":true}'::jsonb
from auth.users
where email = 'YOUR_EMAIL@example.com'
on conflict (id) do update
set email=excluded.email,
    role='owner',
    permissions=excluded.permissions,
    full_name=coalesce(nullif(public.profiles.full_name,''), excluded.full_name);

select u.email,p.full_name,p.role,p.permissions
from auth.users u join public.profiles p on p.id=u.id
where u.email='YOUR_EMAIL@example.com';
