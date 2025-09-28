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

async function checkUserPermissions() {
  try {
    console.log('🔍 사용자 권한 확인 중...');

    // 현재 세션 확인
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.log('❌ 세션 확인 실패:', sessionError.message);
      return;
    }

    if (!sessionData.session) {
      console.log('❌ 로그인된 사용자가 없습니다.');
      console.log('💡 먼저 로그인해주세요.');
      return;
    }

    const user = sessionData.session.user;
    console.log('✅ 로그인된 사용자:', user.email);
    console.log('🆔 사용자 ID:', user.id);

    // user_profile에서 권한 확인
    const { data: profile, error: profileError } = await supabase
      .from('user_profile')
      .select('role, restaurant_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('❌ 권한 정보 조회 실패:', profileError.message);
      console.log('💡 user_profile 테이블에 사용자 정보가 없을 수 있습니다.');
      console.log('🔧 Supabase 대시보드에서 사용자 권한을 설정해주세요.');
      return;
    }

    console.log('🎯 사용자 권한:', profile.role);
    console.log('🏢 담당 레스토랑:', profile.restaurant_id || '없음');

    // 권한별 예상 리다이렉션 경로
    const expectedRedirect = {
      'admin': '/admin',
      'manager': '/manager',
      'guest': '/guest'
    };

    console.log('🎯 예상 리다이렉션:', expectedRedirect[profile.role] || '/guest');

    // restaurants 테이블 확인 (admin인 경우)
    if (profile.role === 'admin') {
      const { data: restaurants, error: restError } = await supabase
        .from('restaurants')
        .select('id, name, slug')
        .limit(5);

      if (restError) {
        console.log('⚠️ 레스토랑 목록 조회 실패:', restError.message);
      } else {
        console.log('🏢 관리 가능한 레스토랑:', restaurants.length, '개');
        restaurants.forEach(r => console.log(`  - ${r.name} (${r.slug})`));
      }
    }

  } catch (err) {
    console.error('❌ 확인 실패:', err.message);
  }
}

checkUserPermissions();