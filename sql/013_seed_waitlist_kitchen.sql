-- Seed waitlist and backfill kitchen queue sanity (optional)

-- Waitlist sample for demo
WITH r AS (
  SELECT id FROM public.restaurants WHERE slug='demo'
)
INSERT INTO public.waitlist (restaurant_id, name, phone, party_size, status, is_reservation)
SELECT r.id, '홍길동', '010-0000-0000', 2, 'waiting', false
FROM r
ON CONFLICT DO NOTHING;

-- Optional: insert a new order_item to see kitchen_queue trigger
WITH r AS (
  SELECT id FROM public.restaurants WHERE slug='demo'
), o AS (
  SELECT o.id FROM public.orders o WHERE o.restaurant_id IN (SELECT id FROM r) LIMIT 1
), mi AS (
  SELECT id, price FROM public.menu_items WHERE restaurant_id IN (SELECT id FROM r) ORDER BY created_at LIMIT 1
)
INSERT INTO public.order_items (order_id, item_id, qty, price)
SELECT o.id, mi.id, 1, mi.price FROM o, mi
ON CONFLICT DO NOTHING;
