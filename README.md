# mfood

이 프로젝트는 food에서 핵심 기능을 이관하여 정리한 POS 샘플입니다. 자세한 가이드는 docs 폴더를 참고하세요.

## 빠른 시작

1) 의존성 설치
```
npm install
```

2) 환경 변수 설정
- `.env.example`를 `.env`로 복사하고 Supabase URL/ANON 및(선택) SERVICE_ROLE 키를 채우세요.

3) DB 스키마 적용 (Supabase SQL Editor)
- `sql/001_schema.sql`
- `sql/002_policies.sql`
- `sql/003_seeds.sql`

4) 개발 서버 실행
```
npm run dev
```

## 권한
- 기본 역할: guest/manager/admin
- `/manager`, `/admin`은 로그인/권한 없으면 `/guest`로 리다이렉트

## 주요 라우트
- `/menu` 메뉴 조회
- `/order` 테이블 목록(주문 시작)
- `/api/admin/restaurants/new` 식당 생성(폼데이터)
- `/api/admin/users/new` 사용자 생성(JSON; service-role 필요)

## 문서
- 설치/실행: [docs/setup.md](docs/setup.md)
- 개요: [docs/overview.md](docs/overview.md)
- DB 설계: [docs/database.md](docs/database.md)
- 게스트 QR: [docs/guest-qr.md](docs/guest-qr.md)
- 관리자 가이드: [docs/admin.md](docs/admin.md)
- 라우트 구조: [docs/routes.md](docs/routes.md)
- 다음 단계: [docs/next-steps.md](docs/next-steps.md)

