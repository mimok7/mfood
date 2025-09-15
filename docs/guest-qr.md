# 게스트 QR 주문/대기

## 페이지
- /guest/qr/[token]
  - token으로 테이블/식당 조회 후 메뉴 출력
  - 단건 주문 폼, 대기 등록 폼 제공

## API
- GET /api/guest/menu?token=...
- POST /api/guest/order
- POST /api/guest/waitlist

모든 API는 서버에서 service role을 사용해 RLS에 막히지 않습니다.
