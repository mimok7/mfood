# 게스트 QR 주문/대기

## 페이지
- /guest/qr/[...slug] (예: /guest/qr/{restaurant_id}/{token})
  - slug[0]=restaurant_id, slug[1]=table token으로 메뉴 출력
  - 단건 주문 폼, 대기 등록 폼 제공
  
- /guest/waitlist?restaurant_id={restaurant_id}
  - 레스토랑 대기 등록 페이지

## API
- GET /api/guest/menu?restaurant_id=...&token=...
- POST /api/guest/order
- POST /api/guest/waitlist

모든 API는 서버에서 service role을 사용해 RLS에 막히지 않습니다.
