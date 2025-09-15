# 데이터베이스 설계

## 기본 테이블
- restaurants (uuid, slug, 연락처/주소 등 확장 컬럼)
- user_profile (auth.users 1:1, role, restaurant_id)
- menu_categories, menu_items
- tables (token unique), orders, order_items

## 확장 테이블
- waitlist (예약 컬럼 포함, 인덱스 구성)
- kitchen_queue (order_items enqueue 트리거)
- menu_option_groups, menu_options

## 트리거
- updated_at 공통 트리거
- order_items → kitchen_queue 자동 enqueue 및 백필

## RLS 정책
- 기본 읽기 허용에서 점진 강화 예정
- 관리자/서버 작업은 service role로 수행
