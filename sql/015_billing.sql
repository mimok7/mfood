-- 015_billing.sql
-- 목적: 결제 처리 기능을 위한 orders 컬럼 추가 및 인덱스 생성
-- - orders.is_paid (boolean, default false)
-- - orders.paid_at (timestamptz, nullable)

-- 1) 컬럼 추가 (있으면 생략)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS is_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- 2) 조회 최적화 인덱스 (있으면 생략)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='idx_orders_restaurant_table_paid'
  ) THEN
    CREATE INDEX idx_orders_restaurant_table_paid ON public.orders(restaurant_id, table_id, is_paid);
  END IF;
END $$;

-- 3) 테이블 사용 가능 상태 컬럼 추가
ALTER TABLE public.tables
  ADD COLUMN IF NOT EXISTS is_available boolean NOT NULL DEFAULT true;

-- 3) 선택적 백필 규칙
-- 이미 결제 완료로 간주할 조건이 있으면 아래 UPDATE를 조정해서 사용하세요.
-- 예: 과거에 별도 추적이 없어 전부 미결제로 유지
-- UPDATE public.orders SET is_paid = true, paid_at = COALESCE(paid_at, now())
-- WHERE status = 'served' AND some_condition;
