-- Seed option groups and options for demo restaurant

WITH r AS (
  SELECT id FROM public.restaurants WHERE slug='demo'
), mi AS (
  SELECT id FROM public.menu_items WHERE restaurant_id IN (SELECT id FROM r) AND name='비빔밥' LIMIT 1
)
INSERT INTO public.menu_option_groups (restaurant_id, menu_item_id, name, min_select, max_select, required, position)
SELECT r.id, mi.id, '밥 종류', 1, 1, true, 1
FROM r, mi
ON CONFLICT DO NOTHING;

WITH g AS (
  SELECT mog.id, mog.restaurant_id FROM public.menu_option_groups mog
  JOIN public.menu_items mi ON mi.id = mog.menu_item_id
  JOIN public.restaurants r ON r.id = mi.restaurant_id
  WHERE mi.name='비빔밥' AND mog.name='밥 종류' AND r.slug='demo'
  LIMIT 1
)
INSERT INTO public.menu_options (restaurant_id, group_id, name, price_delta, position)
SELECT g.restaurant_id, g.id, x.name, x.price_delta, x.pos
FROM g
CROSS JOIN (
  VALUES ('흰쌀밥', 0, 1), ('현미밥', 500, 2)
) AS x(name, price_delta, pos)
ON CONFLICT DO NOTHING;
