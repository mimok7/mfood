# 라우트 구조

## 게스트
- /guest/qr/[token]
- /api/guest/menu, /api/guest/order, /api/guest/waitlist

## 매니저
- /manager/menu, /manager/order, /manager/kitchen, /manager/serving, /manager/waitlist, /manager/reports/sales

## 관리자
- /admin/restaurants
- /admin/restaurants/[id] (+ tabs: users, menu, settings, qr)
- /api/admin/restaurants/[id]/settings
- /api/admin/restaurants/[id]/menu/category
- /api/admin/restaurants/[id]/menu/item
