-- Performance indexes for common query patterns
-- Safe/idempotent creation with IF NOT EXISTS

-- 1) Waitlist: queries filter by restaurant_id + status, order by created_at, count with created_at <= X
CREATE INDEX IF NOT EXISTS idx_waitlist_restaurant_status_created
  ON public.waitlist(restaurant_id, status, created_at);

-- 2) Kitchen queue: counts by restaurant_id + status
CREATE INDEX IF NOT EXISTS idx_kitchen_queue_restaurant_status
  ON public.kitchen_queue(restaurant_id, status);

-- 3) Orders: manager/active endpoints often filter by restaurant_id + status
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status
  ON public.orders(restaurant_id, status);

-- 4) Tables: frequent listing by restaurant
CREATE INDEX IF NOT EXISTS idx_tables_restaurant
  ON public.tables(restaurant_id);

-- 5) Menu categories/items: frequent listing by restaurant
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant
  ON public.menu_categories(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant
  ON public.menu_items(restaurant_id);

-- Optional: ANALYZE to update planner stats (can be executed manually in Supabase SQL editor)
-- ANALYZE public.waitlist;
-- ANALYZE public.kitchen_queue;
-- ANALYZE public.orders;
-- ANALYZE public.tables;
-- ANALYZE public.menu_categories;
-- ANALYZE public.menu_items;
