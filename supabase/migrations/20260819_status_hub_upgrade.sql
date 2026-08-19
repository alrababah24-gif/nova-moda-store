-- Nova Moda 2030 v4: editable business hours for the live storefront status hub.
alter table public.store_settings
  add column if not exists open_time time not null default '09:00',
  add column if not exists close_time time not null default '22:00';

update public.store_settings
set hours = 'يومياً: 9 صباحاً - 10 مساءً',
    open_time = '09:00',
    close_time = '22:00',
    updated_at = now()
where id = 1;
