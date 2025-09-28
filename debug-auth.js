const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// .env.local 파일 읽기
let supabaseUrl, supabaseKey
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const lines = envContent.split('\n')
  
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim()
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim()
    }
  }
} catch (error) {
  console.log('❌ .env.local 파일을 읽을 수 없습니다.')
}

console.log('🔧 Supabase 설정 확인:')
console.log(`URL: ${supabaseUrl ? '✓ 설정됨' : '❌ 없음'}`)
console.log(`Key: ${supabaseKey ? '✓ 설정됨' : '❌ 없음'}`)

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase 환경 변수가 설정되지 않았습니다.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugAuth() {
  try {
    console.log('\n🔍 인증 테스트:')
    
    // 1. 테스트 로그인
    const email = 'kjh@hyojacho.es.kr' // 실제 admin 이메일로 변경
    const password = 'mimok7449!' // 실제 비밀번호로 변경
    
    console.log(`📧 이메일로 로그인 시도: ${email}`)
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (loginError) {
      console.log('❌ 로그인 실패:', loginError.message)
      return
    }
    
    console.log('✅ 로그인 성공')
    console.log('📋 사용자 ID:', loginData.user?.id)
    
    // 2. 사용자 프로필 확인
    console.log('\n🔍 사용자 프로필 확인:')
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profile')
      .select('id, role, restaurant_id')
      .eq('id', loginData.user?.id)
      .single()
    
    if (profileError) {
      console.log('❌ 프로필 조회 실패:', profileError.message)
      return
    }
    
    if (!profile) {
      console.log('❌ 프로필이 존재하지 않습니다.')
      return
    }
    
    console.log('✅ 프로필 정보:')
    console.log(`   ID: ${profile.id}`)
    console.log(`   Role: ${profile.role}`)
    console.log(`   Restaurant ID: ${profile.restaurant_id || 'null'}`)
    
    // 3. 헬퍼 함수 테스트
    console.log('\n🔍 헬퍼 함수 테스트:')
    
    const { data: roleTest, error: roleError } = await supabase
      .rpc('current_user_role')
    
    if (roleError) {
      console.log('❌ current_user_role 함수 오류:', roleError.message)
    } else {
      console.log(`✅ current_user_role(): ${roleTest}`)
    }
    
    // 4. 로그아웃
    await supabase.auth.signOut()
    console.log('\n✅ 테스트 완료 (로그아웃됨)')
    
  } catch (error) {
    console.log('❌ 테스트 중 오류:', error.message)
  }
}

debugAuth()