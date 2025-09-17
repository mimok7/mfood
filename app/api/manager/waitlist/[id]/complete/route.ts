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
      .select('id, status, restaurant_id, table_id')
      .eq('id', id)
      .eq('restaurant_id', restaurant_id)
      .maybeSingle()

    if (fetchError || !waitItem) {
      return NextResponse.json({ error: '대기자를 찾을 수 없습니다' }, { status: 404 })
    }

    if (waitItem.status !== 'seated') {
      return NextResponse.json({ error: '배정된 대기자만 완료 처리할 수 있습니다' }, { status: 400 })
    }

    // status를 'completed'로 업데이트
    const { error: updateError } = await supabase
      .from('waitlist')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('waitlist complete update error', updateError)
      return NextResponse.json({ error: '완료 처리 중 오류가 발생했습니다' }, { status: 500 })
    }

    // 관련 주문도 완료 처리 (테이블을 비움)
    if (waitItem.table_id) {
      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('restaurant_id', restaurant_id)
        .eq('table_id', waitItem.table_id)
        .eq('status', 'open')

      if (orderUpdateError) {
        console.error('order complete update error', orderUpdateError)
        // 주문 업데이트 실패해도 waitlist는 완료 처리
      }
    }

    return NextResponse.json({ success: true, message: '배정이 완료되었습니다' }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}