-- Add more sample tables for demo restaurant
-- This SQL can be run in Supabase SQL Editor

-- First, ensure we have a demo restaurant
INSERT INTO public.restaurants (name, slug)
VALUES ('Demo Restaurant', 'demo')
ON CONFLICT (slug) DO NOTHING;

-- Add sample tables for the demo restaurant
INSERT INTO public.tables (restaurant_id, name, capacity, token)
SELECT
  r.id,
  table_data.name,
  table_data.capacity,
  gen_random_uuid()::text
FROM public.restaurants r
CROSS JOIN (
  VALUES
    ('A-1', 4),
    ('A-2', 4),
    ('A-3', 6),
    ('B-1', 2),
    ('B-2', 2),
    ('B-3', 4),
    ('C-1', 8),
    ('C-2', 6),
    ('VIP-1', 10),
    ('VIP-2', 12)
) AS table_data(name, capacity)
WHERE r.slug = 'demo'
  AND NOT EXISTS (
    SELECT 1 FROM public.tables t
    WHERE t.restaurant_id = r.id AND t.name = table_data.name
  )
ON CONFLICT (restaurant_id, name) DO NOTHING;

-- Add some sample orders to show table status
-- This will create some active orders for demonstration
INSERT INTO public.orders (restaurant_id, table_id, status, created_at)
SELECT
  r.id,
  t.id,
  CASE
    WHEN random() < 0.3 THEN 'pending'
    WHEN random() < 0.5 THEN 'confirmed'
    WHEN random() < 0.7 THEN 'preparing'
    ELSE 'ready'
  END,
  NOW() - INTERVAL '1 hour' * random()
FROM public.restaurants r
CROSS JOIN public.tables t
WHERE r.slug = 'demo'
  AND t.restaurant_id = r.id
  AND random() < 0.4  -- 40% of tables have active orders
  AND NOT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.table_id = t.id AND o.status IN ('pending', 'confirmed', 'preparing', 'ready')
  )
ON CONFLICT DO NOTHING;