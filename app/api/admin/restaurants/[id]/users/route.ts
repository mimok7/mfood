import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabase-admin'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: restaurantId } = await params

  try {
    const supabase = supabaseAdmin()

    // 해당 레스토랑의 모든 사용자 조회
    const { data: users, error } = await supabase
      .from('user_profile')
      .select('id, email, full_name, role, created_at, updated_at')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch users:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users: users || [] })
  } catch (err: any) {
    console.error('Error fetching users:', err)
    return NextResponse.json({ error: err.message || '알 수 없는 오류' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: restaurantId } = await params

  // TODO: 운영 환경에서는 관리자 권한 확인을 추가해야 합니다.

  try {
    const body = await req.json()
    const { email, name, password, role } = body

    if (!email) return NextResponse.json({ error: '이메일이 필요합니다' }, { status: 400 })
    // 비밀번호는 신규 사용자 생성 시에만 필수
    if (!password && !body.existingUserCheck) return NextResponse.json({ error: '비밀번호가 필요합니다' }, { status: 400 })


    // Create auth user via service role
    const supabase = supabaseAdmin()

    console.log('🔍 Checking Supabase configuration...')
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ SET' : '❌ NOT SET')
    console.log('SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0)

    // Test basic connection first
    try {
      const { data: testData, error: testError } = await supabase.from('user_profile').select('count').limit(1)
      console.log('Database connection test:', testError ? '❌ FAILED' : '✅ OK')
      if (testError) console.error('Connection error:', testError)
    } catch (connErr) {
      console.error('Connection test failed:', connErr)
    }

    console.log('👤 Attempting to create user with email:', email)

    const { data: userData, error: createErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true, // 이메일 확인 생략
      password: password, // 사용자 입력 비밀번호 사용
      user_metadata: {
        full_name: name,
        role: role,
        restaurant_id: restaurantId
      }
    })

    console.log('📊 Supabase createUser result:', {
      success: !!userData?.user,
      userId: userData?.user?.id,
      email: userData?.user?.email,
      error: createErr?.message,
      errorDetails: createErr
    })

    // If user already exists, try to get them
    if (createErr?.message?.includes('already registered') || createErr?.message?.includes('User already registered')) {
      console.log('User already exists, fetching existing user')

      // List users and find by email (this is inefficient but works)
      const { data: users, error: listErr } = await supabase.auth.admin.listUsers()
      const existingUser = users?.users?.find(u => u.email === email)

      if (existingUser) {
        console.log('Found existing user:', existingUser.id)
        const userId = existingUser.id

        // Update/create profile (기존 사용자일 때는 비밀번호 변경하지 않음)
        const { error: profileErr } = await supabase.from('user_profile').upsert(
          { id: userId, email, full_name: name || null, role: role || 'guest', restaurant_id: restaurantId },
          { onConflict: 'id' }
        )

        if (profileErr) {
          console.error('Failed to create/update user profile:', profileErr)
          return NextResponse.json({ error: profileErr.message }, { status: 500 })
        }

        return NextResponse.json({
          ok: true,
          user: { id: userId, email },
          existed: true,
          message: '기존 사용자를 업데이트했습니다 (비밀번호는 변경되지 않습니다)'
        })
      }
    }

    if (createErr || !userData?.user) {
      console.error('Failed to create auth user:', createErr)
      return NextResponse.json({
        error: createErr?.message || '사용자 생성 실패',
        details: createErr
      }, { status: 500 })
    }

    const userId = userData.user.id
    console.log('Created new auth user with ID:', userId)

    // Insert user_profile
    console.log('Inserting user_profile for userId:', userId, 'with role:', role, 'restaurant_id:', restaurantId)

    const { error: profileErr } = await supabase.from('user_profile').insert([{ id: userId, email, full_name: name || null, role: role || 'guest', restaurant_id: restaurantId }])

    console.log('user_profile insert result:', { error: profileErr })

    if (profileErr) {
      console.error('Failed to create user profile:', profileErr)
      return NextResponse.json({ error: profileErr.message }, { status: 500 })
    }

    console.log('Successfully created user:', { id: userId, email, role })

    return NextResponse.json({ ok: true, user: { id: userId, email } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '알 수 없는 오류' }, { status: 500 })
  }
}
