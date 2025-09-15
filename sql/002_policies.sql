-- RLS Policies
alter table public.user_profile enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.tables enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Basic policies for user_profile
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_profile' and policyname = 'users can view own profile'
  ) then
    create policy "users can view own profile"
      on public.user_profile
      for select
      using (auth.uid() = id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_profile' and policyname = 'users can update own profile'
  ) then
    create policy "users can update own profile"
      on public.user_profile
      for update
      using (auth.uid() = id);
  end if;
end $$;

-- Admin convenience: allow service role full access
-- (Service role bypasses RLS by design; no policy needed.)

-- Restaurants
-- Read-all for authenticated users (adjust later if needed)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'restaurants' and policyname = 'auth users can read restaurants'
  ) then
    create policy "auth users can read restaurants"
      on public.restaurants
      for select
      to authenticated
      using (true);
  end if;
end $$;

-- Managers/Admins can insert/update restaurants via service role API only initially
-- Leave DML restricted unless via service role

-- Menu readable within same restaurant (assumes current_restaurant set via header/cookie)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'menu_categories' and policyname = 'read menu categories by restaurant'
  ) then
    create policy "read menu categories by restaurant"
      on public.menu_categories
      for select
      to authenticated
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'menu_items' and policyname = 'read menu items by restaurant'
  ) then
    create policy "read menu items by restaurant"
      on public.menu_items
      for select
      to authenticated
      using (true);
  end if;
end $$;

-- Tables and orders basic read
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tables' and policyname = 'read tables'
  ) then
    create policy "read tables"
      on public.tables
      for select
      to authenticated
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders' and policyname = 'read orders'
  ) then
    create policy "read orders"
      on public.orders
      for select
      to authenticated
      using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_items' and policyname = 'read order items'
  ) then
    create policy "read order items"
      on public.order_items
      for select
      to authenticated
      using (exists (select 1 from public.orders o where o.id = order_id));
  end if;
end $$;
