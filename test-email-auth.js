const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// .env.local 파일에서 환경 변수 로드
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (value) {
          process.env[key.trim()] = value;
        }
      }
    });
  } catch (err) {
    console.error('❌ .env.local 파일을 읽을 수 없습니다:', err.message);
    process.exit(1);
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailAuth() {
  try {
    console.log('📧 이메일 인증 테스트 시작...');

    // 테스트 이메일로 회원가입 시도
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';

    console.log(`📝 테스트 계정 생성 시도: ${testEmail}`);

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ 계정이 이미 존재합니다. 로그인 테스트를 진행합니다.');

        // 로그인 시도
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });

        if (loginError) {
          console.log('❌ 로그인 실패:', loginError.message);
        } else {
          console.log('✅ 로그인 성공!');
          console.log('👤 사용자:', loginData.user?.email);
        }
      } else {
        console.log('❌ 회원가입 실패:', error.message);
      }
    } else {
      console.log('✅ 회원가입 성공!');
      console.log('📧 확인 이메일을 확인해주세요:', data.user?.email);
    }

    // 현재 세션 확인
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('🔑 현재 세션:', sessionData.session ? '활성화됨' : '없음');

  } catch (err) {
    console.error('❌ 테스트 실패:', err.message);
  }
}

testEmailAuth();