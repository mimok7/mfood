# mfood 시스템 관리자 가이드

## 🔧 시스템 설정 및 배포

### 환경 요구사항
- **Node.js**: 18.0 이상
- **PostgreSQL**: 14.0 이상 (Supabase 권장)
- **브라우저**: Chrome/Safari/Edge 최신 버전

### 환경변수 설정
```bash
# .env.local 파일 생성
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 데이터베이스 마이그레이션

#### 1단계: 기본 스키마 (필수)
```sql
-- 순서대로 실행
1. sql/001_schema.sql          -- 기본 테이블 구조
2. sql/002_policies.sql        -- RLS 정책
3. sql/003_seeds.sql          -- 초기 데이터
```

#### 2단계: 확장 기능 (권장)
```sql
-- 주요 확장 기능
4. sql/010_schema_extensions.sql    -- 키친큐, 확장 테이블
5. sql/015_billing.sql             -- 결제 시스템
6. sql/016_order_totals.sql        -- 주문 금액 자동 계산
```

#### 3단계: 최적화 (선택)
```sql
-- 추가 기능들
- sql/014_category_station_routing.sql  -- 스테이션 라우팅
- sql/016_waitlist_token.sql           -- 웨이팅 토큰
- sql/015_add_table_tokens.sql         -- 테이블 토큰
```

### 배포 명령어
```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 서버 시작
npm start

# 개발 서버 (로컬)
npm run dev
```

---

## 🗄️ 데이터베이스 구조

### 핵심 테이블

#### restaurants
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255) NOT NULL
address         TEXT
phone           VARCHAR(20)
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### tables
```sql
id              UUID PRIMARY KEY
restaurant_id   UUID REFERENCES restaurants(id)
name            VARCHAR(50) NOT NULL
token           VARCHAR(255) UNIQUE
is_available    BOOLEAN DEFAULT TRUE
```

#### orders
```sql
id              UUID PRIMARY KEY
restaurant_id   UUID REFERENCES restaurants(id)
table_id        UUID REFERENCES tables(id)
status          order_status DEFAULT 'open'
total_amount    INTEGER DEFAULT 0
is_paid         BOOLEAN DEFAULT FALSE
paid_at         TIMESTAMPTZ
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### order_items
```sql
id              UUID PRIMARY KEY
order_id        UUID REFERENCES orders(id)
item_id         UUID REFERENCES menu_items(id)
qty             INTEGER NOT NULL
price           INTEGER NOT NULL
note            TEXT
```

#### kitchen_queue
```sql
id              UUID PRIMARY KEY
restaurant_id   UUID REFERENCES restaurants(id)
order_item_id   UUID REFERENCES order_items(id)
station         station_type DEFAULT 'main'
status          queue_status DEFAULT 'queued'
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### 열거형 (ENUM) 타입
```sql
CREATE TYPE order_status AS ENUM ('open', 'sent', 'prepping', 'ready', 'served', 'cancelled');
CREATE TYPE queue_status AS ENUM ('queued', 'prepping', 'ready', 'served', 'cancelled');
CREATE TYPE station_type AS ENUM ('main', 'bar', 'dessert');
CREATE TYPE user_role AS ENUM ('guest', 'manager', 'admin');
```

---

## 🔐 보안 및 권한

### Row Level Security (RLS) 정책

#### 기본 원칙
- **게스트**: 본인이 생성한 주문만 조회
- **매니저**: 소속 레스토랑 데이터만 접근
- **관리자**: 전체 시스템 접근 (서비스 롤 키 사용)

#### 주요 정책 예시
```sql
-- 매니저는 소속 레스토랑 주문만 조회
CREATE POLICY manager_orders ON orders
FOR SELECT TO authenticated
USING (
  restaurant_id IN (
    SELECT restaurant_id FROM user_profile 
    WHERE user_id = auth.uid() AND role = 'manager'
  )
);

-- 게스트는 자신의 주문만 조회
CREATE POLICY guest_orders ON orders
FOR SELECT TO anon
USING (table_id = get_table_from_context());
```

### API 보안

#### 인증 패턴
```typescript
// 매니저 권한 확인
const { restaurant_id } = await requireRole('manager')

// 관리자 전용 작업
const supabase = supabaseAdmin() // RLS 우회

// 게스트 토큰 검증
const { data: table } = await supabase
  .from('tables')
  .select('restaurant_id')
  .eq('token', token)
  .eq('restaurant_id', restaurantId)
  .maybeSingle()
```

---

## 📊 모니터링 및 최적화

### 성능 지표
- **페이지 로드 시간**: < 2초
- **API 응답 시간**: < 500ms
- **데이터베이스 쿼리**: < 100ms
- **동시 사용자**: 1000명 지원

### 로깅 설정
```typescript
// 개발 환경
console.log('Order created:', orderId)

// 프로덕션 환경 (권장)
import { logger } from '@/lib/logger'
logger.info('Order created', { orderId, restaurantId })
```

### 데이터베이스 최적화

#### 인덱스 최적화
```sql
-- 자주 조회되는 컬럼들
CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status);
CREATE INDEX idx_kitchen_queue_station_status ON kitchen_queue(station, status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

#### 쿼리 최적화
- `SELECT *` 대신 필요한 컬럼만 선택
- JOIN 시 적절한 인덱스 활용
- 페이지네이션으로 대량 데이터 처리

---

## 🚨 장애 대응

### 일반적인 문제 및 해결

#### 1. 주문이 키친에 표시되지 않음
**원인**: kitchen_queue 트리거 실행 실패
```sql
-- 수동으로 키친큐에 추가
INSERT INTO kitchen_queue (restaurant_id, order_item_id, station)
SELECT oi.restaurant_id, oi.id, mi.station
FROM order_items oi
JOIN menu_items mi ON oi.item_id = mi.id
WHERE oi.order_id = 'problem_order_id';
```

#### 2. 주문 금액이 0원으로 표시
**원인**: order_items.price 누락
```sql
-- 가격 백필
UPDATE order_items oi
SET price = mi.price
FROM menu_items mi
WHERE oi.item_id = mi.id AND oi.price = 0;

-- 주문 총액 재계산
UPDATE orders o
SET total_amount = (
  SELECT COALESCE(SUM(oi.price * oi.qty), 0)
  FROM order_items oi
  WHERE oi.order_id = o.id
);
```

#### 3. QR 토큰 중복 또는 누락
**원인**: 테이블 토큰 생성 실패
```sql
-- 토큰 재생성
UPDATE tables 
SET token = gen_random_uuid()::text 
WHERE token IS NULL OR token = '';
```

### 비상 연락처
- **시스템 관리자**: admin@mfood.com
- **데이터베이스 관리**: db-admin@mfood.com
- **24시간 지원**: emergency@mfood.com

---

## 🔄 백업 및 복구

### 자동 백업 설정
```bash
# 일일 백업 (crontab 설정)
0 2 * * * pg_dump -h your-host -U your-user -d your-db > backup_$(date +%Y%m%d).sql

# 주간 전체 백업
0 3 * * 0 pg_dumpall -h your-host -U your-user > full_backup_$(date +%Y%m%d).sql
```

### 복구 절차
```bash
# 특정 시점 복구
psql -h your-host -U your-user -d your-db < backup_20250917.sql

# 테이블별 복구
pg_restore -h your-host -U your-user -d your-db -t orders backup.dump
```

---

## 📈 확장 계획

### 단기 개선사항
- [ ] 푸시 알림 시스템
- [ ] 다국어 지원
- [ ] 모바일 앱 개발
- [ ] 고급 분석 대시보드

### 장기 로드맵
- [ ] AI 기반 주문 예측
- [ ] 음성 주문 지원
- [ ] 배달 시스템 통합
- [ ] 다중 브랜드 지원

---

*📅 최종 업데이트: 2025년 9월 17일*
*📧 기술 문의: tech@mfood.com*