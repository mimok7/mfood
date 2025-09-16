# Supabase 사용자 생성 문제 해결 가이드

## 문제 증상
관리자 페이지에서 사용자 생성 시 "슈파 인증에 추가 안됨" 오류가 발생합니다.

## 가능한 원인 및 해결 방법

### 1. Service Role Key 설정 확인
Supabase Admin API를 사용하려면 올바른 Service Role Key가 필요합니다.

**확인 방법:**
1. Supabase 대시보드 → Settings → API
2. `service_role` 키가 `.env.local` 파일에 올바르게 설정되어 있는지 확인:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**주의:** `anon` 키가 아닌 `service_role` 키를 사용해야 합니다.

### 2. Supabase 프로젝트 설정 확인
1. Supabase 대시보드 → Authentication → Settings
2. "Enable email confirmations"이 비활성화되어 있는지 확인
3. "Enable signups"이 활성화되어 있는지 확인

### 3. 환경 변수 재로딩
환경 변수를 변경한 후에는 서버를 재시작해야 합니다:
```bash
# 서버 중지
Ctrl+C

# 재시작
npm run dev
```

### 4. 로그 확인
사용자 생성 시 서버 로그를 확인하여 자세한 오류 정보를 확인하세요:
- 환경 변수 설정 상태
- 데이터베이스 연결 상태
- Supabase Admin API 호출 결과

### 5. Supabase 대시보드 직접 확인
Supabase 대시보드 → Authentication → Users에서 사용자가 실제로 생성되었는지 확인하세요.

## 코드 개선사항

현재 코드는 다음과 같은 개선사항을 포함합니다:
- ✅ 환경 변수 및 연결 상태 로깅
- ✅ 기존 사용자 처리 로직
- ✅ 더 나은 에러 메시지
- ✅ 임시 비밀번호 설정 (tempPass123!)
- ✅ 이메일 확인 생략

## 테스트 방법

1. 관리자 페이지에서 사용자 생성 시도
2. 서버 로그에서 "✅ Successfully created auth user" 메시지 확인
3. Supabase 대시보드에서 사용자 생성 확인
4. 생성된 사용자로 로그인 테스트

## 추가 지원

문제가 지속되면:
1. Supabase 프로젝트 URL과 키가 올바른지 다시 확인
2. Supabase 대시보드에서 Admin API가 활성화되어 있는지 확인
3. 필요한 경우 Supabase 지원팀에 문의</content>
<parameter name="filePath">c:\Users\saint\mfood\SUPABASE_USER_CREATION_FIX.md