-- 014_category_station_routing.sql
-- 목적: 카테고리 기반으로 menu_items.station 자동 설정 (식사/안주=main|dessert, 주류/음료=bar)
--       기존 데이터 백필 및 잘못 큐잉된 항목 교정(주류/음료는 ready로 전환)

-- 분류 유틸 함수: 카테고리/아이템명으로 스테이션 판정
CREATE OR REPLACE FUNCTION public.fn_station_from_category(cat_name text, item_name text)
RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
  c text := coalesce(cat_name, '');
  n text := coalesce(item_name, '');
BEGIN
  -- 주류/음료: bar
  IF c ILIKE '%주류%' OR c ILIKE '%음료%' OR c ILIKE '%drink%' OR c ILIKE '%alcohol%'
     OR c ILIKE '%beer%' OR c ILIKE '%wine%' OR c ILIKE '%cocktail%' OR c ILIKE '%소주%'
     OR c ILIKE '%맥주%' THEN
    RETURN 'bar';
  END IF;
  -- 이름 기반 보조 판정 (대표 키워드)
  IF n ILIKE '%참이슬%' OR n ILIKE '%카스%' OR n ILIKE '%테라%' OR n ILIKE '%소주%'
     OR n ILIKE '%맥주%' OR n ILIKE '%하이볼%' OR n ILIKE '%와인%' OR n ILIKE '%사케%'
     OR n ILIKE '%막걸리%' OR n ILIKE '%콜라%' OR n ILIKE '%사이다%' OR n ILIKE '%스프라이트%'
     OR n ILIKE '%환타%' OR n ILIKE '%주스%' OR n ILIKE '%음료%' THEN
    RETURN 'bar';
  END IF;
  -- 디저트: dessert
  IF c ILIKE '%디저트%' OR c ILIKE '%dessert%' THEN
    RETURN 'dessert';
  END IF;
  -- 기본: main (식사/안주)
  RETURN 'main';
END; $$;

-- INSERT/UPDATE 시 카테고리 기반 station 자동 설정
CREATE OR REPLACE FUNCTION public.fn_set_menu_item_station_by_category()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_cat_name text;
BEGIN
  IF NEW.category_id IS NOT NULL THEN
    SELECT name INTO v_cat_name FROM public.menu_categories WHERE id = NEW.category_id;
  ELSE
    v_cat_name := NULL;
  END IF;
  NEW.station := public.fn_station_from_category(v_cat_name, NEW.name);
  RETURN NEW;
END; $$;

-- 트리거 생성 (있으면 교체)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_menu_items_station_by_category' AND c.relname = 'menu_items'
  ) THEN
    DROP TRIGGER trg_menu_items_station_by_category ON public.menu_items;
  END IF;
  CREATE TRIGGER trg_menu_items_station_by_category
  BEFORE INSERT OR UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_set_menu_item_station_by_category();
END $$;

-- 1) 기존 menu_items 백필: 카테고리/이름 기반으로 station 세팅
UPDATE public.menu_items mi
SET station = public.fn_station_from_category(mc.name, mi.name)
FROM public.menu_categories mc
WHERE mi.category_id = mc.id;

-- 2) kitchen_queue 교정: 주류/음료로 판정된 항목은 station='bar', status='ready'로 전환
UPDATE public.kitchen_queue k
SET station = 'bar', status = 'ready'
FROM public.order_items oi
JOIN public.menu_items mi ON mi.id = oi.item_id
LEFT JOIN public.menu_categories mc ON mc.id = mi.category_id
WHERE k.order_item_id = oi.id
  AND k.status IN ('queued','prepping')
  AND public.fn_station_from_category(coalesce(mc.name, ''), mi.name) = 'bar';
