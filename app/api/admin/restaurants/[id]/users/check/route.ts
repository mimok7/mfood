import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../../lib/supabase-admin'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: restaurantId } = await params
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: '이메일이 필요합니다' }, { status: 400 })
  }

  try {
    // List users and check if email exists
    const supabase = supabaseAdmin()
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('Failed to list users:', error)
      return NextResponse.json({ error: '사용자 확인 실패' }, { status: 500 })
    }

    const existingUser = users?.users?.find(u => u.email === email)
    const exists = !!existingUser

    return NextResponse.json({ exists })
  } catch (err: any) {
    console.error('Error checking user existence:', err)
    return NextResponse.json({ error: err.message || '알 수 없는 오류' }, { status: 500 })
  }
}