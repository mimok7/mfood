-- Enable required extensions
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";
create extension if not exists pgjwt;

-- Restaurants
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Users profile (1:1 with auth.users)
create table if not exists public.user_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'guest' check (role in ('guest','manager','admin')),
  restaurant_id uuid references public.restaurants(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger trg_restaurants_updated
before update on public.restaurants
for each row execute function public.set_updated_at();

create or replace trigger trg_user_profile_updated
before update on public.user_profile
for each row execute function public.set_updated_at();

-- Basic domain models
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  price int not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  token text unique,
  capacity int default 4,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_id uuid references public.tables(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'open' check (status in ('open','sent','served','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_id uuid not null references public.menu_items(id) on delete restrict,
  qty int not null default 1,
  price int not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- triggers
create or replace trigger trg_categories_updated before update on public.menu_categories for each row execute function public.set_updated_at();
create or replace trigger trg_menu_items_updated before update on public.menu_items for each row execute function public.set_updated_at();
create or replace trigger trg_tables_updated before update on public.tables for each row execute function public.set_updated_at();
create or replace trigger trg_orders_updated before update on public.orders for each row execute function public.set_updated_at();
create or replace trigger trg_order_items_updated before update on public.order_items for each row execute function public.set_updated_at();
