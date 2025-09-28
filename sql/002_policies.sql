-- RLS Policies for Multi-Restaurant Environment

-- Helper function to check if a user is an admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

-- Helper function to check if a user is at least a manager for a given restaurant
create or replace function public.is_manager_or_admin(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    (public.current_user_role() = 'admin') or
    (
      public.current_user_role() = 'manager' and
      public.current_user_restaurant_id() = p_restaurant_id
    );
$$;


-- Enable RLS for all relevant tables
alter table public.user_profile enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.tables enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Clear existing generic policies before creating specific ones
drop policy if exists "users can view own profile" on public.user_profile;
drop policy if exists "users can update own profile" on public.user_profile;
drop policy if exists "profile_read_own" on public.user_profile;
drop policy if exists "profile_update_own" on public.user_profile;
drop policy if exists "profile_read_admin" on public.user_profile;
drop policy if exists "profile_update_admin" on public.user_profile;
drop policy if exists "auth users can read restaurants" on public.restaurants;
drop policy if exists "restaurants_read" on public.restaurants;
drop policy if exists "restaurants_manage_admin" on public.restaurants;
drop policy if exists "read menu categories by restaurant" on public.menu_categories;
drop policy if exists "read menu items by restaurant" on public.menu_items;
drop policy if exists "read tables" on public.tables;
drop policy if exists "read orders" on public.orders;
drop policy if exists "read order items" on public.order_items;


-- == Policies for `user_profile` ==
-- Users can view their own profile (no RLS recursion)
create policy "profile_read_own" on public.user_profile for select
  using (auth.uid() = id);

-- Users can update their own profile (no RLS recursion)
create policy "profile_update_own" on public.user_profile for update
  using (auth.uid() = id);

-- Admins can view any profile (direct query to avoid recursion)
create policy "profile_read_admin" on public.user_profile for select
  using (
    exists (
      select 1 from public.user_profile up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- Admins can update any profile (direct query to avoid recursion)
create policy "profile_update_admin" on public.user_profile for update
  using (
    exists (
      select 1 from public.user_profile up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );


-- == Policies for `restaurants` ==
-- Any authenticated user can see all restaurants (e.g., for a selection screen).
create policy "restaurants_read" on public.restaurants for select
  to authenticated using (true);
-- Only admins can create, update, or delete restaurants.
create policy "restaurants_manage_admin" on public.restaurants for all
  using (public.is_admin()) with check (public.is_admin());


-- == Policies for restaurant-specific tables (`menu_categories`, `menu_items`, `tables`, `orders`) ==
-- Function to generate policies for a given table
create or replace procedure public.create_restaurant_rls_policies(p_table_name text)
language plpgsql
as $$
begin
  -- Drop existing policies first
  execute format('drop policy if exists "%1$s_read" on public.%1$s', p_table_name);
  execute format('drop policy if exists "%1$s_manage" on public.%1$s', p_table_name);

  -- Policy for reading data:
  -- Authenticated users can read data if it belongs to their assigned restaurant.
  -- Admins can read data from any restaurant.
  execute format('
    create policy "%1$s_read" on public.%1$s for select
    to authenticated using (
      public.is_admin() or
      restaurant_id = public.current_user_restaurant_id()
    );
  ', p_table_name);

  -- Policy for managing data (insert, update, delete):
  -- Managers can manage data for their own restaurant.
  -- Admins can manage data for any restaurant.
  execute format('
    create policy "%1$s_manage" on public.%1$s for all
    to authenticated using (
      public.is_manager_or_admin(restaurant_id)
    ) with check (
      public.is_manager_or_admin(restaurant_id)
    );
  ', p_table_name);
end;
$$;

-- Apply the policies to each table
call public.create_restaurant_rls_policies('menu_categories');
call public.create_restaurant_rls_policies('menu_items');
call public.create_restaurant_rls_policies('tables');
call public.create_restaurant_rls_policies('orders');


-- == Policies for `order_items` ==
-- `order_items` does not have a direct `restaurant_id`, so we check through the `orders` table.

-- Drop existing policies first
drop policy if exists "order_items_read" on public.order_items;
drop policy if exists "order_items_manage" on public.order_items;

-- Read policy for order_items
create policy "order_items_read" on public.order_items for select
  to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (
        public.is_admin() or
        o.restaurant_id = public.current_user_restaurant_id()
      )
    )
  );

-- Manage policy for order_items
create policy "order_items_manage" on public.order_items for all
  to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and public.is_manager_or_admin(o.restaurant_id)
    )
  ) with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and public.is_manager_or_admin(o.restaurant_id)
    )
  );
