-- RLS helper functions

-- Get the role of the currently authenticated user (bypass RLS)
create or replace function public.current_user_role()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  -- Bypass RLS by using security definer
  select role into user_role
  from public.user_profile
  where id = auth.uid();

  return coalesce(user_role, 'guest');
end;
$$;

-- Get the restaurant_id of the currently authenticated user (bypass RLS)
create or replace function public.current_user_restaurant_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  restaurant_id uuid;
begin
  -- Bypass RLS by using security definer
  select up.restaurant_id into restaurant_id
  from public.user_profile up
  where up.id = auth.uid();

  return restaurant_id;
end;
$$;
