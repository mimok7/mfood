import { NextRequest, NextResponse } from 'next/server'
import { getSession, isAtLeast } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session.user || !isAtLeast(session.role, 'manager')) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 })
    }

    const restaurant_id = session.restaurant_id
    if (!restaurant_id) {
      return NextResponse.json({ error: '레스토랑 정보가 없습니다' }, { status: 400 })
    }

    const { id } = await params

    const supabase = createSupabaseServer()

    // 해당 대기자가 이 레스토랑의 것인지 확인
    const { data: waitItem, error: fetchError } = await supabase
      .from('waitlist')
      .select('id, status, restaurant_id')
      .eq('id', id)
      .eq('restaurant_id', restaurant_id)
      .maybeSingle()

    if (fetchError || !waitItem) {
      return NextResponse.json({ error: '대기자를 찾을 수 없습니다' }, { status: 404 })
    }

    if (waitItem.status !== 'waiting') {
      return NextResponse.json({ error: '이미 호출되었거나 착석한 대기자입니다' }, { status: 400 })
    }

    // status를 'called'로 업데이트
    const { error: updateError } = await supabase
      .from('waitlist')
      .update({ status: 'called', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('waitlist call update error', updateError)
      return NextResponse.json({ error: '호출 처리 중 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '대기자가 호출되었습니다' }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}