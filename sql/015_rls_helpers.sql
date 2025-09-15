-- RLS helper functions

-- Get the role of the currently authenticated user
create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select coalesce(
    (select role from public.user_profile where id = auth.uid()),
    'guest'
  );
$$;

-- Get the restaurant_id of the currently authenticated user
create or replace function public.current_user_restaurant_id()
returns uuid
language sql
stable
as $$
  select restaurant_id from public.user_profile where id = auth.uid();
$$;
