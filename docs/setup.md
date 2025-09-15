# 설치 및 실행 가이드

## 선행 조건
- Node.js 18+
- Supabase 프로젝트 (URL/Anon/Service Role 키)

## 의존성 설치 (Windows PowerShell)
```powershell
# dev deps
npm install -D tailwindcss postcss autoprefixer --prefix c:\Users\saint\mfood
```

## Tailwind 초기화
- tailwind.config.js와 postcss.config.js가 존재해야 합니다.
- styles/globals.css를 app/layout.tsx에서 import 합니다.

## 환경 변수
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (서버 전용)

## DB 스키마 적용 순서 (Supabase SQL Editor)
1) sql/001_schema.sql
2) sql/002_policies.sql
3) sql/003_seeds.sql
4) sql/010_schema_extensions.sql
5) sql/011_menu_options.sql
6) sql/012_seed_menu_options.sql
7) sql/013_seed_waitlist_kitchen.sql

## 개발 서버 실행
```powershell
npm run dev --prefix c:\Users\saint\mfood
```
