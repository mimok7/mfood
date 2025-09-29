# 성능/리전 최적화 가이드

## 리전 정렬(Region Alignment)
- Supabase 프로젝트 리전과 Vercel(또는 Next.js 서버) 리전을 동일/가까운 리전으로 설정하세요.
- 예: Supabase: ap-northeast-2 (서울) ↔ Vercel: icn1 (서울) 또는 hnd1 (도쿄)
- 네트워크 왕복 시간(RTT) 감소로 API 응답 시간을 줄일 수 있습니다.
- 참고: Vercel은 프로젝트/브랜치별로 리전 설정이 다를 수 있으니 Production/Preview 모두 확인하세요.

## 슬로우 쿼리 점검 체크리스트
- 카운트 전용 쿼리는 `head: true, count: 'exact'` 옵션을 사용해 Payload 전송을 최소화.
- 목록 조회에서 필요 필드만 선택(select)하고, 조인은 꼭 필요한 필드만 포함.
- WHERE 절에 사용하는 컬럼 조합에 적절한 인덱스가 있는지 확인.
- ORDER BY에 사용하는 컬럼이 인덱스 끝단에 올 수 있도록 복합 인덱스 설계.
- RLS가 많은 테이블은 정책 평가 비용이 크므로 서버 역할(Admin) 사용이 가능한 관리자 전용 경로는 Admin Client를 사용(주의: 보안 정책).

## 추가한 인덱스(016_perf_indexes.sql)
- waitlist: `(restaurant_id, status, created_at)`
  - created_at 순 정렬/포지션 카운트(lte created_at) 최적화
- kitchen_queue: `(restaurant_id, status)`
  - 상태별 카운트 최적화
- orders: `(restaurant_id, status)`
  - 매니저 화면의 활성 주문/상태 조회 최적화
- tables: `(restaurant_id)`
  - 테이블 목록 조회 최적화
- menu_categories/menu_items: `(restaurant_id)`
  - 메뉴 관리 화면 조회 최적화

## 운영 팁
- 대량 업데이트/임시 배치 작업 후 `ANALYZE`를 수행해 통계 최신화.
- 장기 실행 쿼리 발생 시, 실행 계획(EXPLAIN ANALYZE)으로 테이블/인덱스 스캔 유형 확인.
- 실시간 대시보드는 가급적 count-only 쿼리 + 짧은 기간 캐시(또는 SSE/Realtime) 혼용.
- 느린 페이지는 개별 API로 분리하고 `NextResponse.json()`으로 데이터만 전송해 렌더 오버헤드 감소.
