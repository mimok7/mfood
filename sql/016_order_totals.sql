-- 016_order_totals.sql
-- 목적: 주문 금액 0원 문제의 근본 해결
--  - order_items.price를 menu_items.price로 자동 스냅샷 (누락/0원 방지)
--  - orders.total_amount 컬럼 추가 및 트리거로 자동 집계 유지
--  - 기존 데이터 백필

-- 1) orders.total_amount 컬럼 추가
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS total_amount integer NOT NULL DEFAULT 0;

-- 2) order_items 가격 자동 설정 트리거 함수 (INSERT/UPDATE)
CREATE OR REPLACE FUNCTION public.fn_set_order_item_price()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_price int;
BEGIN
  -- 가격이 비었거나 0이면 menu_items.price를 스냅샷
  IF COALESCE(NEW.price, 0) = 0 THEN
    SELECT price INTO v_price FROM public.menu_items WHERE id = NEW.item_id;
    NEW.price := COALESCE(v_price, 0);
  END IF;
  RETURN NEW;
END; $$;

-- 트리거 생성/교체
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_order_items_set_price' AND c.relname = 'order_items'
  ) THEN
    DROP TRIGGER trg_order_items_set_price ON public.order_items;
  END IF;
  CREATE TRIGGER trg_order_items_set_price
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_order_item_price();
END $$;

-- 3) orders 합계 재계산 함수
CREATE OR REPLACE FUNCTION public.fn_recalc_order_total(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_sum int;
BEGIN
  SELECT COALESCE(SUM(oi.price * oi.qty), 0) INTO v_sum
  FROM public.order_items oi
  WHERE oi.order_id = p_order_id;

  UPDATE public.orders SET total_amount = v_sum, updated_at = NOW()
  WHERE id = p_order_id;
END; $$;

-- 4) order_items 변경 시 합계 업데이트 트리거
CREATE OR REPLACE FUNCTION public.fn_order_items_after_change()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    PERFORM public.fn_recalc_order_total(OLD.order_id);
  ELSE
    PERFORM public.fn_recalc_order_total(NEW.order_id);
  END IF;
  RETURN NULL;
END; $$;

DO $$
BEGIN
  -- DELETE
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_order_items_after_delete' AND c.relname = 'order_items'
  ) THEN
    DROP TRIGGER trg_order_items_after_delete ON public.order_items;
  END IF;
  CREATE TRIGGER trg_order_items_after_delete
  AFTER DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.fn_order_items_after_change();

  -- INSERT
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_order_items_after_insert' AND c.relname = 'order_items'
  ) THEN
    DROP TRIGGER trg_order_items_after_insert ON public.order_items;
  END IF;
  CREATE TRIGGER trg_order_items_after_insert
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.fn_order_items_after_change();

  -- UPDATE
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_order_items_after_update' AND c.relname = 'order_items'
  ) THEN
    DROP TRIGGER trg_order_items_after_update ON public.order_items;
  END IF;
  CREATE TRIGGER trg_order_items_after_update
  AFTER UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.fn_order_items_after_change();
END $$;

-- 5) 기존 데이터 백필
-- 5-1) order_items.price가 0 또는 NULL인 경우 menu_items.price로 채움
UPDATE public.order_items oi
SET price = mi.price
FROM public.menu_items mi
WHERE oi.item_id = mi.id
  AND COALESCE(oi.price, 0) = 0;

-- 5-2) orders.total_amount 재계산
UPDATE public.orders o
SET total_amount = sub.sum
FROM (
  SELECT order_id, COALESCE(SUM(price * qty), 0) AS sum
  FROM public.order_items
  GROUP BY order_id
) sub
WHERE o.id = sub.order_id;
