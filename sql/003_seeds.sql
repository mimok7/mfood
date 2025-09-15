-- Seed one sample restaurant
insert into public.restaurants (name, slug)
values ('Demo Restaurant', 'demo')
on conflict (slug) do nothing;

-- Seed category/item/table
insert into public.menu_categories (restaurant_id, name, position)
select id, '메인', 1 from public.restaurants where slug='demo'
on conflict do nothing;

insert into public.menu_items (restaurant_id, category_id, name, price)
select r.id, c.id, '비빔밥', 9000
from public.restaurants r
join public.menu_categories c on c.restaurant_id = r.id and c.name = '메인'
where r.slug='demo'
on conflict do nothing;

insert into public.tables (restaurant_id, name, capacity)
select id, 'A-1', 4 from public.restaurants where slug='demo'
on conflict do nothing;

-- After you create an auth user, set their profile
-- replace 00000000-0000-0000-0000-000000000000 with the real auth.users.id
-- insert into public.user_profile(id, role, restaurant_id)
-- values ('00000000-0000-0000-0000-000000000000', 'admin', (select id from public.restaurants where slug='demo'))
-- on conflict (id) do update set role = excluded.role, restaurant_id = excluded.restaurant_id;

-- Seed a sample order and order_item for the demo restaurant
WITH r AS (
  SELECT id FROM public.restaurants WHERE slug='demo'
), t AS (
  SELECT id FROM public.tables WHERE restaurant_id IN (SELECT id FROM r) AND name='A-1' LIMIT 1
), o AS (
  INSERT INTO public.orders (restaurant_id, table_id, status)
  SELECT r.id, t.id, 'open'
  FROM r JOIN t
  WHERE NOT EXISTS (
    SELECT 1 FROM public.orders oo WHERE oo.restaurant_id = r.id AND oo.table_id = t.id
  )
  RETURNING id, restaurant_id
), item AS (
  SELECT id, price FROM public.menu_items WHERE restaurant_id IN (SELECT id FROM r) AND name='비빔밥' LIMIT 1
)
INSERT INTO public.order_items (order_id, item_id, qty, price)
SELECT COALESCE(o.id, oo.id), item.id, 1, item.price
FROM item
CROSS JOIN r
LEFT JOIN o ON true
LEFT JOIN public.orders oo ON (o.id IS NULL) AND oo.restaurant_id = r.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.order_items oi
  WHERE oi.order_id = COALESCE(o.id, oo.id) AND oi.item_id = item.id
);
