-- Menu options schema for mfood (idempotent)

-- Groups: a menu item can have multiple option groups
CREATE TABLE IF NOT EXISTS public.menu_option_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  min_select int NOT NULL DEFAULT 0,
  max_select int NOT NULL DEFAULT 1,
  required boolean NOT NULL DEFAULT false,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Options: belong to group
CREATE TABLE IF NOT EXISTS public.menu_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES public.menu_option_groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  price_delta int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trg_menu_option_groups_updated BEFORE UPDATE ON public.menu_option_groups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_menu_options_updated BEFORE UPDATE ON public.menu_options FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- helpful indexes
CREATE INDEX IF NOT EXISTS idx_mog_menu_item ON public.menu_option_groups(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_mog_restaurant ON public.menu_option_groups(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_mo_group ON public.menu_options(group_id);
CREATE INDEX IF NOT EXISTS idx_mo_restaurant ON public.menu_options(restaurant_id);

-- RLS
ALTER TABLE public.menu_option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_options ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='menu_option_groups' AND policyname='read mog'
  ) THEN
    CREATE POLICY "read mog" ON public.menu_option_groups FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='menu_options' AND policyname='read mo'
  ) THEN
    CREATE POLICY "read mo" ON public.menu_options FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- managers/admin can manage
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='menu_option_groups' AND policyname='manage mog'
  ) THEN
    CREATE POLICY "manage mog" ON public.menu_option_groups FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_profile up WHERE up.id = auth.uid() AND up.role IN ('manager','admin')))
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_profile up WHERE up.id = auth.uid() AND up.role IN ('manager','admin')));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='menu_options' AND policyname='manage mo'
  ) THEN
    CREATE POLICY "manage mo" ON public.menu_options FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_profile up WHERE up.id = auth.uid() AND up.role IN ('manager','admin')))
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_profile up WHERE up.id = auth.uid() AND up.role IN ('manager','admin')));
  END IF;
END $$;
