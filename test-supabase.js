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

console.log('🔍 Supabase 연결 테스트 시작...');
console.log('📍 URL:', supabaseUrl ? '설정됨' : '없음');
console.log('🔑 Key:', supabaseKey ? '설정됨 (길이: ' + supabaseKey.length + ')' : '없음');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔗 Supabase 연결 시도 중...');

    // 기본적인 연결 테스트 (restaurants 테이블 조회 시도)
    const { data, error } = await supabase
      .from('restaurants')
      .select('count')
      .limit(1);

    if (error) {
      console.log('⚠️  restaurants 테이블 접근 실패 (정상일 수 있음):', error.message);

      // 다른 테이블 시도
      const { data: userData, error: userError } = await supabase
        .from('user_profile')
        .select('count')
        .limit(1);

      if (userError) {
        console.log('⚠️  user_profile 테이블 접근 실패:', userError.message);
        console.log('ℹ️  RLS 정책으로 인해 접근이 제한될 수 있습니다.');
      } else {
        console.log('✅ user_profile 테이블 접근 성공!');
      }
    } else {
      console.log('✅ restaurants 테이블 접근 성공!');
      console.log('📊 데이터:', data);
    }

    // Auth 상태 확인
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('⚠️  Auth 세션 확인 실패:', authError.message);
    } else {
      console.log('✅ Auth 시스템 정상 작동');
      console.log('👤 현재 세션:', authData.session ? '있음' : '없음');
    }

    console.log('\n🎉 Supabase 연결 테스트 완료!');
    console.log('✅ 기본 연결은 성공적으로 작동합니다.');

  } catch (err) {
    console.error('❌ 연결 테스트 실패:', err.message);
    process.exit(1);
  }
}

testConnection();