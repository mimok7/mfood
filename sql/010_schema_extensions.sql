-- mfood schema extensions consolidated from legacy food/sql
-- Safe/idempotent: add columns, tables, triggers, and policies only if missing

-- 1) Extend restaurants with additional settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'business_number'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN business_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'address'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN email text;
  END IF;

  -- domain/subdomain support
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'subdomain'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN subdomain text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'domain'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN domain text;
  END IF;

  -- alert and QR/url visibility settings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'enable_new_order_sound'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN enable_new_order_sound boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'enable_new_order_popup'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN enable_new_order_popup boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'hide_urls_in_qr'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN hide_urls_in_qr boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'hide_urls_on_web'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN hide_urls_on_web boolean DEFAULT false;
  END IF;

  -- table settings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'table_count'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN table_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'default_table_capacity'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN default_table_capacity integer DEFAULT 4;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'table_capacities'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN table_capacities jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- 2) Enhance menu_items with station
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'menu_items' AND column_name = 'station'
  ) THEN
    ALTER TABLE public.menu_items ADD COLUMN station text NOT NULL DEFAULT 'main';
  END IF;
  -- add a CHECK constraint for known stations if not present
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'menu_items_station_check'
  ) THEN
    ALTER TABLE public.menu_items
      ADD CONSTRAINT menu_items_station_check CHECK (station IN ('main','bar','dessert'));
  END IF;
END $$;

-- 3) Ensure tables have unique token and backfill
ALTER TABLE IF EXISTS public.tables
  ADD COLUMN IF NOT EXISTS token text;

UPDATE public.tables SET token = gen_random_uuid()::text WHERE token IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tables_token_key'
  ) THEN
    ALTER TABLE public.tables ADD CONSTRAINT tables_token_key UNIQUE (token);
  END IF;
END $$;

-- 4) Waitlist table (with reservation fields)
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  party_size int NOT NULL DEFAULT 2,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','seated','cancelled','no_show','completed')),
  notes text,
  is_reservation boolean NOT NULL DEFAULT false,
  reservation_time timestamptz,
  duration_minutes int,
  special_request text,
  deposit_cents int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_restaurant ON public.waitlist(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_reservation_time ON public.waitlist(reservation_time) WHERE is_reservation = TRUE;
CREATE INDEX IF NOT EXISTS idx_waitlist_status_reservation ON public.waitlist(status, is_reservation);

-- 5) Kitchen queue table
CREATE TABLE IF NOT EXISTS public.kitchen_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  station text NOT NULL DEFAULT 'main' CHECK (station IN ('main','bar','dessert')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','prepping','ready','served','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kitchen_queue_order_item_id ON public.kitchen_queue(order_item_id);
CREATE INDEX IF NOT EXISTS idx_kitchen_queue_station ON public.kitchen_queue(station);
CREATE INDEX IF NOT EXISTS idx_kitchen_queue_restaurant ON public.kitchen_queue(restaurant_id);

-- updated_at triggers for new tables
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_waitlist_updated BEFORE UPDATE ON public.waitlist FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_kitchen_queue_updated BEFORE UPDATE ON public.kitchen_queue FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6) Trigger: enqueue order_items into kitchen_queue
CREATE OR REPLACE FUNCTION public.fn_enqueue_order_item_to_kitchen()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_restaurant_id uuid;
  v_station text;
BEGIN
  -- find restaurant via joined order
  SELECT o.restaurant_id INTO v_restaurant_id FROM public.orders o WHERE o.id = NEW.order_id;

  -- find station via menu_items
  SELECT COALESCE(mi.station, 'main') INTO v_station FROM public.menu_items mi WHERE mi.id = NEW.item_id;

  INSERT INTO public.kitchen_queue (restaurant_id, order_item_id, station, status, created_at)
  VALUES (
    v_restaurant_id,
    NEW.id,
    COALESCE(v_station, 'main'),
    CASE WHEN COALESCE(v_station, 'main') = 'bar' THEN 'ready' ELSE 'queued' END,
    now()
  );

  RETURN NEW;
END; $$;

-- drop and create trigger (compatible names)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_enqueue_order_item_to_kitchen' AND c.relname = 'order_items'
  ) THEN
    DROP TRIGGER trg_enqueue_order_item_to_kitchen ON public.order_items;
  END IF;
  CREATE TRIGGER trg_enqueue_order_item_to_kitchen
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_enqueue_order_item_to_kitchen();
END $$;

-- backfill kitchen_queue for existing order_items that are missing
INSERT INTO public.kitchen_queue (restaurant_id, order_item_id, station, status, created_at)
SELECT 
  o.restaurant_id,
  oi.id,
  COALESCE(mi.station, 'main'),
  CASE WHEN COALESCE(mi.station, 'main') = 'bar' THEN 'ready' ELSE 'queued' END,
  now()
FROM public.order_items oi
JOIN public.orders o ON o.id = oi.order_id
LEFT JOIN public.kitchen_queue kq ON kq.order_item_id = oi.id
LEFT JOIN public.menu_items mi ON mi.id = oi.item_id
WHERE kq.id IS NULL;

-- 7) RLS for new tables (basic policies)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchen_queue ENABLE ROW LEVEL SECURITY;

-- Waitlist: authenticated users can read; managers/admin can write
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='waitlist' AND policyname='read waitlist'
  ) THEN
    CREATE POLICY "read waitlist" ON public.waitlist FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='waitlist' AND policyname='manage waitlist by managers'
  ) THEN
    CREATE POLICY "manage waitlist by managers" ON public.waitlist FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_profile up
        WHERE up.id = auth.uid() AND up.role IN ('manager','admin')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.user_profile up
        WHERE up.id = auth.uid() AND up.role IN ('manager','admin')
      )
    );
  END IF;
END $$;

-- Kitchen queue: read for managers; update for managers/admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='kitchen_queue' AND policyname='read kitchen queue'
  ) THEN
    CREATE POLICY "read kitchen queue" ON public.kitchen_queue FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_profile up
        WHERE up.id = auth.uid() AND up.role IN ('manager','admin')
      )
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='kitchen_queue' AND policyname='update kitchen queue by managers'
  ) THEN
    CREATE POLICY "update kitchen queue by managers" ON public.kitchen_queue FOR UPDATE TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_profile up
        WHERE up.id = auth.uid() AND up.role IN ('manager','admin')
      )
    );
  END IF;
END $$;
