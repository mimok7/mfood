# 관리자: 식당별 관리

## 흐름
1) /admin/restaurants 에서 식당 선택
2) /admin/restaurants/[id] 내부 탭에서 섹션 이동
   - 개요, 사용자, 메뉴, 설정, QR

## 구현 파일
- 페이지
  - app/admin/restaurants/page.tsx
  - app/admin/restaurants/[id]/layout.tsx (탭)
  - app/admin/restaurants/[id]/page.tsx (개요)
  - app/admin/restaurants/[id]/menu/page.tsx
  - app/admin/restaurants/[id]/settings/page.tsx
  - app/admin/restaurants/[id]/qr/page.tsx
- API
  - app/api/admin/restaurants/[id]/settings/route.ts
  - app/api/admin/restaurants/[id]/menu/category/route.ts
  - app/api/admin/restaurants/[id]/menu/item/route.ts

## 권한/보안
- 현재는 service role 기반 관리 (추가로 requireRole('admin') 가드를 쉽게 붙일 수 있음)
