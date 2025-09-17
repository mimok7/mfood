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
    const { table_id } = await req.json()

    if (!table_id) {
      return NextResponse.json({ error: '테이블을 선택해주세요' }, { status: 400 })
    }

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

    if (waitItem.status !== 'called') {
      return NextResponse.json({ error: '호출된 대기자만 배정할 수 있습니다' }, { status: 400 })
    }

    // 테이블이 이 레스토랑의 것인지 확인
    const { data: tableItem, error: tableError } = await supabase
      .from('tables')
      .select('id, restaurant_id')
      .eq('id', table_id)
      .eq('restaurant_id', restaurant_id)
      .maybeSingle()

    if (tableError || !tableItem) {
      return NextResponse.json({ error: '테이블을 찾을 수 없습니다' }, { status: 404 })
    }

    // status를 'seated'로 업데이트하고 table_id 저장
    const { error: updateError } = await supabase
      .from('waitlist')
      .update({ status: 'seated', table_id, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('waitlist seat update error', updateError)
      return NextResponse.json({ error: '배정 처리 중 오류가 발생했습니다' }, { status: 500 })
    }

    // 테이블 배정 시 새로운 주문 생성하여 테이블을 사용 중으로 표시
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        restaurant_id,
        table_id,
        status: 'open'
      })

    if (orderError) {
      console.error('order creation error', orderError)
      return NextResponse.json({ error: '테이블 배정 중 주문 생성 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '테이블이 배정되었습니다' }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}