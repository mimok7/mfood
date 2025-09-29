-- 미목식당 예시 데이터 추가 (017_seed_mimok_restaurant.sql)
-- 레스토랑, 메뉴 카테고리, 메뉴 아이템, 옵션 그룹, 옵션, 테이블, 샘플 웨이팅/주문 데이터

-- 0) 기존 중복 데이터 정리 (미목식당 관련)
DO $$ 
DECLARE
    restaurant_uuid uuid;
BEGIN
    -- 미목식당 ID 확인
    SELECT id INTO restaurant_uuid FROM public.restaurants WHERE slug = 'mimok';
    
    IF restaurant_uuid IS NOT NULL THEN
        RAISE NOTICE '기존 미목식당 데이터 정리 중... (ID: %)', restaurant_uuid;
        
        -- 관련 데이터를 순서대로 삭제 (CASCADE 관계 고려)
        DELETE FROM public.kitchen_queue WHERE restaurant_id = restaurant_uuid;
        DELETE FROM public.order_items WHERE order_id IN (SELECT id FROM public.orders WHERE restaurant_id = restaurant_uuid);
        DELETE FROM public.orders WHERE restaurant_id = restaurant_uuid;
        DELETE FROM public.waitlist WHERE restaurant_id = restaurant_uuid;
        DELETE FROM public.tables WHERE restaurant_id = restaurant_uuid;
        DELETE FROM public.menu_options WHERE restaurant_id = restaurant_uuid;
        DELETE FROM public.menu_option_groups WHERE restaurant_id = restaurant_uuid;
        DELETE FROM public.menu_items WHERE restaurant_id = restaurant_uuid;
        DELETE FROM public.menu_categories WHERE restaurant_id = restaurant_uuid;
        
        RAISE NOTICE '기존 미목식당 관련 데이터가 정리되었습니다.';
    ELSE
        RAISE NOTICE '기존 미목식당 데이터가 없습니다. 새로 생성합니다.';
    END IF;
END $$;

-- 1) 미목식당 생성
INSERT INTO public.restaurants (id, name, slug, business_number, phone, address, email, subdomain, table_count, default_table_capacity, waitlist_token)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '미목식당',
  'mimok',
  '123-45-67890',
  '02-1234-5678',
  '서울시 강남구 테헤란로 123',
  'mimok@restaurant.com',
  'mimok',
  8,
  4,
  gen_random_uuid()::text
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  business_number = EXCLUDED.business_number,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  email = EXCLUDED.email,
  table_count = EXCLUDED.table_count,
  default_table_capacity = EXCLUDED.default_table_capacity;

-- 2) 메뉴 카테고리 생성
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok')
INSERT INTO public.menu_categories (restaurant_id, name, position)
SELECT r.id, category_data.name, category_data.position
FROM r
CROSS JOIN (
  VALUES
    ('메인 요리', 1),
    ('사이드 메뉴', 2),
    ('음료', 3),
    ('주류', 4),
    ('디저트', 5)
) AS category_data(name, position)
ON CONFLICT DO NOTHING;

-- 3) 메뉴 아이템 생성
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     c_main AS (SELECT id FROM public.menu_categories WHERE restaurant_id IN (SELECT id FROM r) AND name = '메인 요리'),
     c_side AS (SELECT id FROM public.menu_categories WHERE restaurant_id IN (SELECT id FROM r) AND name = '사이드 메뉴'),
     c_drink AS (SELECT id FROM public.menu_categories WHERE restaurant_id IN (SELECT id FROM r) AND name = '음료'),
     c_alcohol AS (SELECT id FROM public.menu_categories WHERE restaurant_id IN (SELECT id FROM r) AND name = '주류'),
     c_dessert AS (SELECT id FROM public.menu_categories WHERE restaurant_id IN (SELECT id FROM r) AND name = '디저트')
INSERT INTO public.menu_items (id, restaurant_id, category_id, name, price, is_active)
SELECT 
  gen_random_uuid(),
  r.id,
  CASE 
    WHEN item_data.category = 'main' THEN c_main.id
    WHEN item_data.category = 'side' THEN c_side.id
    WHEN item_data.category = 'drink' THEN c_drink.id
    WHEN item_data.category = 'alcohol' THEN c_alcohol.id
    WHEN item_data.category = 'dessert' THEN c_dessert.id
  END,
  item_data.name,
  item_data.price,
  true
FROM r, c_main, c_side, c_drink, c_alcohol, c_dessert
CROSS JOIN (
  VALUES
    -- 메인 요리
    ('main', '김치찌개', 8500),
    ('main', '된장찌개', 8000),
    ('main', '비빔밥', 9500),
    ('main', '불고기정식', 14000),
    ('main', '삼겹살구이', 16000),
    ('main', '생선구이정식', 13000),
    -- 사이드 메뉴
    ('side', '계란말이', 5000),
    ('side', '김치전', 6000),
    ('side', '감자전', 6000),
    ('side', '오징어볶음', 8000),
    ('side', '콩나물무침', 4000),
    -- 음료
    ('drink', '콜라', 2000),
    ('drink', '사이다', 2000),
    ('drink', '오렌지주스', 2500),
    ('drink', '아메리카노', 3000),
    ('drink', '카페라떼', 3500),
    -- 주류
    ('alcohol', '참이슬 프레쉬', 5000),
    ('alcohol', '처음처럼 프레쉬', 5000),
    ('alcohol', '맥주 (500ml)', 4000),
    ('alcohol', '막걸리', 6000),
    -- 디저트
    ('dessert', '아이스크림', 3000),
    ('dessert', '과일', 5000)
) AS item_data(category, name, price);

-- 4) 옵션 그룹 및 옵션 생성
-- 비빔밥 - 밥 종류 옵션
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     mi_bibimbap AS (
       SELECT id FROM public.menu_items 
       WHERE restaurant_id IN (SELECT id FROM r) AND name = '비빔밥'
       LIMIT 1
     )
INSERT INTO public.menu_option_groups (restaurant_id, menu_item_id, name, min_select, max_select, required, position)
SELECT r.id, mi_bibimbap.id, '밥 종류', 1, 1, true, 1
FROM r, mi_bibimbap
ON CONFLICT DO NOTHING;

-- 비빔밥 밥 종류 옵션들
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     mog_rice AS (
       SELECT mog.id, mog.restaurant_id 
       FROM public.menu_option_groups mog
       JOIN public.menu_items mi ON mi.id = mog.menu_item_id
       WHERE mi.restaurant_id IN (SELECT id FROM r) 
         AND mi.name = '비빔밥' 
         AND mog.name = '밥 종류'
       LIMIT 1
     )
INSERT INTO public.menu_options (restaurant_id, group_id, name, price_delta, position)
SELECT mog_rice.restaurant_id, mog_rice.id, option_data.name, option_data.price_delta, option_data.position
FROM mog_rice
CROSS JOIN (
  VALUES
    ('흰쌀밥', 0, 1),
    ('현미밥', 500, 2),
    ('보리밥', 700, 3)
) AS option_data(name, price_delta, position)
ON CONFLICT DO NOTHING;

-- 비빔밥 - 매운맛 레벨 옵션
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     mi_bibimbap AS (
       SELECT id FROM public.menu_items 
       WHERE restaurant_id IN (SELECT id FROM r) AND name = '비빔밥'
       LIMIT 1
     )
INSERT INTO public.menu_option_groups (restaurant_id, menu_item_id, name, min_select, max_select, required, position)
SELECT r.id, mi_bibimbap.id, '매운맛 레벨', 1, 1, true, 2
FROM r, mi_bibimbap
ON CONFLICT DO NOTHING;

-- 매운맛 레벨 옵션들
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     mog_spice AS (
       SELECT mog.id, mog.restaurant_id 
       FROM public.menu_option_groups mog
       JOIN public.menu_items mi ON mi.id = mog.menu_item_id
       WHERE mi.restaurant_id IN (SELECT id FROM r) 
         AND mi.name = '비빔밥' 
         AND mog.name = '매운맛 레벨'
       LIMIT 1
     )
INSERT INTO public.menu_options (restaurant_id, group_id, name, price_delta, position)
SELECT mog_spice.restaurant_id, mog_spice.id, option_data.name, option_data.price_delta, option_data.position
FROM mog_spice
CROSS JOIN (
  VALUES
    ('순한맛', 0, 1),
    ('보통', 0, 2),
    ('매운맛', 0, 3),
    ('아주 매운맛', 500, 4)
) AS option_data(name, price_delta, position)
ON CONFLICT DO NOTHING;

-- 불고기정식 - 사이드 추가 옵션 (다중 선택 가능)
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     mi_bulgogi AS (
       SELECT id FROM public.menu_items 
       WHERE restaurant_id IN (SELECT id FROM r) AND name = '불고기정식'
       LIMIT 1
     )
INSERT INTO public.menu_option_groups (restaurant_id, menu_item_id, name, min_select, max_select, required, position)
SELECT r.id, mi_bulgogi.id, '사이드 추가', 0, 3, false, 1
FROM r, mi_bulgogi
ON CONFLICT DO NOTHING;

-- 사이드 추가 옵션들
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     mog_side AS (
       SELECT mog.id, mog.restaurant_id 
       FROM public.menu_option_groups mog
       JOIN public.menu_items mi ON mi.id = mog.menu_item_id
       WHERE mi.restaurant_id IN (SELECT id FROM r) 
         AND mi.name = '불고기정식' 
         AND mog.name = '사이드 추가'
       LIMIT 1
     )
INSERT INTO public.menu_options (restaurant_id, group_id, name, price_delta, position)
SELECT mog_side.restaurant_id, mog_side.id, option_data.name, option_data.price_delta, option_data.position
FROM mog_side
CROSS JOIN (
  VALUES
    ('계란후라이 추가', 1000, 1),
    ('김치 추가', 1500, 2),
    ('나물 추가', 2000, 3),
    ('된장국 추가', 1500, 4)
) AS option_data(name, price_delta, position)
ON CONFLICT DO NOTHING;

-- 음료 - 사이즈 옵션
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     mi_americano AS (
       SELECT id FROM public.menu_items 
       WHERE restaurant_id IN (SELECT id FROM r) AND name = '아메리카노'
       LIMIT 1
     )
INSERT INTO public.menu_option_groups (restaurant_id, menu_item_id, name, min_select, max_select, required, position)
SELECT r.id, mi_americano.id, '사이즈', 1, 1, true, 1
FROM r, mi_americano
ON CONFLICT DO NOTHING;

-- 아메리카노 사이즈 옵션들
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     mog_size AS (
       SELECT mog.id, mog.restaurant_id 
       FROM public.menu_option_groups mog
       JOIN public.menu_items mi ON mi.id = mog.menu_item_id
       WHERE mi.restaurant_id IN (SELECT id FROM r) 
         AND mi.name = '아메리카노' 
         AND mog.name = '사이즈'
       LIMIT 1
     )
INSERT INTO public.menu_options (restaurant_id, group_id, name, price_delta, position)
SELECT mog_size.restaurant_id, mog_size.id, option_data.name, option_data.price_delta, option_data.position
FROM mog_size
CROSS JOIN (
  VALUES
    ('레귤러', 0, 1),
    ('라지', 500, 2),
    ('엑스트라라지', 1000, 3)
) AS option_data(name, price_delta, position)
ON CONFLICT DO NOTHING;

-- 5) 테이블 생성
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok')
INSERT INTO public.tables (restaurant_id, name, token, capacity)
SELECT r.id, table_data.name, gen_random_uuid()::text, table_data.capacity
FROM r
CROSS JOIN (
  VALUES
    ('테이블 1', 4),
    ('테이블 2', 4),
    ('테이블 3', 6),
    ('테이블 4', 2),
    ('테이블 5', 4),
    ('테이블 6', 4),
    ('테이블 7', 8),
    ('테이블 8', 2)
) AS table_data(name, capacity)
ON CONFLICT DO NOTHING;

-- 6) 샘플 웨이팅 데이터
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok')
INSERT INTO public.waitlist (restaurant_id, name, phone, party_size, status, notes)
SELECT r.id, waitlist_data.name, waitlist_data.phone, waitlist_data.party_size, waitlist_data.status, waitlist_data.notes
FROM r
CROSS JOIN (
  VALUES
    ('김철수', '010-1234-5678', 4, 'waiting', '창가 자리 희망'),
    ('이영희', '010-2345-6789', 2, 'called', '음식 알레르기 있음'),
    ('박민수', '010-3456-7890', 6, 'waiting', '아이 의자 필요'),
    ('정수진', '010-4567-8901', 3, 'seated', ''),
    ('홍길동', '010-5678-9012', 2, 'waiting', '금연석 희망')
) AS waitlist_data(name, phone, party_size, status, notes)
ON CONFLICT DO NOTHING;

-- 7) 샘플 주문 데이터 (kitchen_queue 트리거로 자동 생성됨)
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     t1 AS (SELECT id FROM public.tables WHERE restaurant_id IN (SELECT id FROM r) AND name = '테이블 1' LIMIT 1),
     t3 AS (SELECT id FROM public.tables WHERE restaurant_id IN (SELECT id FROM r) AND name = '테이블 3' LIMIT 1)
INSERT INTO public.orders (restaurant_id, table_id, status)
SELECT r.id, table_data.table_id, 'open'
FROM r
CROSS JOIN (
  SELECT t1.id as table_id FROM t1
  UNION ALL
  SELECT t3.id as table_id FROM t3
) AS table_data
ON CONFLICT DO NOTHING;

-- 주문 아이템 추가 (트리거로 kitchen_queue에 자동 추가됨)
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok'),
     o1 AS (
       SELECT o.id as order_id FROM public.orders o
       JOIN public.tables t ON t.id = o.table_id
       WHERE o.restaurant_id IN (SELECT id FROM r) AND t.name = '테이블 1'
       LIMIT 1
     ),
     o3 AS (
       SELECT o.id as order_id FROM public.orders o
       JOIN public.tables t ON t.id = o.table_id
       WHERE o.restaurant_id IN (SELECT id FROM r) AND t.name = '테이블 3'
       LIMIT 1
     ),
     mi_bibimbap AS (SELECT id, price FROM public.menu_items WHERE restaurant_id IN (SELECT id FROM r) AND name = '비빔밥'),
     mi_bulgogi AS (SELECT id, price FROM public.menu_items WHERE restaurant_id IN (SELECT id FROM r) AND name = '불고기정식'),
     mi_kimchi AS (SELECT id, price FROM public.menu_items WHERE restaurant_id IN (SELECT id FROM r) AND name = '김치찌개'),
     mi_beer AS (SELECT id, price FROM public.menu_items WHERE restaurant_id IN (SELECT id FROM r) AND name = '맥주 (500ml)')
INSERT INTO public.order_items (order_id, item_id, qty, price, note)
SELECT 
  order_data.order_id,
  order_data.item_id,
  order_data.qty,
  order_data.price,
  order_data.note
FROM (
  -- 테이블 1 주문
  SELECT o1.order_id, mi_bibimbap.id as item_id, 1 as qty, mi_bibimbap.price, '현미밥, 매운맛' as note
  FROM o1, mi_bibimbap
  UNION ALL
  SELECT o1.order_id, mi_bulgogi.id as item_id, 1 as qty, mi_bulgogi.price, '사이드 추가: 계란후라이, 김치' as note
  FROM o1, mi_bulgogi
  UNION ALL
  SELECT o1.order_id, mi_beer.id as item_id, 2 as qty, mi_beer.price, '' as note
  FROM o1, mi_beer
  UNION ALL
  -- 테이블 3 주문
  SELECT o3.order_id, mi_kimchi.id as item_id, 2 as qty, mi_kimchi.price, '' as note
  FROM o3, mi_kimchi
  UNION ALL
  SELECT o3.order_id, mi_beer.id as item_id, 1 as qty, mi_beer.price, '' as note
  FROM o3, mi_beer
) AS order_data
ON CONFLICT DO NOTHING;

-- 8) 일부 kitchen_queue 상태 업데이트 (다양한 상태 시연용)
WITH r AS (SELECT id FROM public.restaurants WHERE slug = 'mimok')
UPDATE public.kitchen_queue 
SET status = 'prepping', updated_at = now()
WHERE restaurant_id IN (SELECT id FROM r)
  AND id IN (
    SELECT id FROM public.kitchen_queue 
    WHERE restaurant_id IN (SELECT id FROM r)
    ORDER BY created_at 
    LIMIT 2
  );

-- 완료 메시지
DO $$ 
BEGIN 
  RAISE NOTICE '미목식당 예시 데이터가 성공적으로 추가되었습니다!';
  RAISE NOTICE '- 레스토랑: 미목식당 (slug: mimok)';
  RAISE NOTICE '- 메뉴 카테고리: 5개';
  RAISE NOTICE '- 메뉴 아이템: 22개';
  RAISE NOTICE '- 옵션 그룹: 4개 (밥 종류, 매운맛 레벨, 사이드 추가, 사이즈)';
  RAISE NOTICE '- 옵션: 15개';
  RAISE NOTICE '- 테이블: 8개';
  RAISE NOTICE '- 샘플 웨이팅: 5건';
  RAISE NOTICE '- 샘플 주문: 2테이블, 6개 아이템';
END $$;