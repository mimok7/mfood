import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabase-admin'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: restaurantId } = await params

  // TODO: 운영 환경에서는 관리자 권한 확인을 추가해야 합니다.

  try {
    const body = await req.json()
    const { email, name, role } = body

    if (!email) return NextResponse.json({ error: '이메일이 필요합니다' }, { status: 400 })


    // Create auth user via service role
    const supabase = supabaseAdmin()

    const { data: userData, error: createErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false,
      password: Math.random().toString(36).slice(-12), // 임시 비밀번호 - 운영에서는 이메일 초대/비밀번호 정책 고려
    })

    if (createErr || !userData?.user) {
      return NextResponse.json({ error: createErr?.message || '사용자 생성 실패' }, { status: 500 })
    }

    const userId = userData.user.id

    // Insert user_profile
    const { error: profileErr } = await supabase.from('user_profile').insert([{ user_id: userId, email, full_name: name || null, role: role || 'guest', restaurant_id: restaurantId }])

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, user: { id: userId, email } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '알 수 없는 오류' }, { status: 500 })
  }
}
