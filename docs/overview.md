# mfood 프로젝트 개요

이 문서는 food에서 이관된 기능을 기반으로 mfood의 구조와 현재 상태를 요약합니다.

## 핵심 기술
- Next.js App Router
- TypeScript, React
- Supabase (supabase-js v2, RLS)
- Tailwind CSS

## 주요 기능 요약
- 게스트: QR로 메뉴 조회, 단건 주문, 대기 등록
- 매니저: 메뉴/주문/주방/서빙/대기/매출 리포트 네비 구조 반영
- 관리자: 식당 선택 → 사용자/메뉴/설정/QR 탭으로 Per-restaurant 관리

## 현재 상태
- 스키마: UUID 기반, waitlist/kitchen_queue/옵션 스키마 포함
- 정책: 기본 RLS + 관리자 API는 service role로 우회
- 시드: 데모 식당/메뉴/테이블 + 옵션/웨이팅/주방 큐 시드 포함
