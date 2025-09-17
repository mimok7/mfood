import { NextResponse } from 'next/server'
import { getSession, isAtLeast } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const session = await getSession()
    if (!session.user || !isAtLeast(session.role, 'manager')) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 })
    }

    const restaurant_id = session.restaurant_id
    if (!restaurant_id) {
      return NextResponse.json({ error: '레스토랑 정보가 없습니다' }, { status: 400 })
    }

    // 현재 활성 주문들 가져오기 (테이블 점유로 판단)
    const { data: orders, error: ordersError } = await supabaseAdmin()
      .from('orders')
      .select(`
        id,
        table_id,
        status,
        created_at,
        tables (
          id,
          name
        )
      `)
      .eq('restaurant_id', restaurant_id)
      .in('status', ['open', 'sent'])
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Orders fetch error:', ordersError)
      return NextResponse.json({ error: '주문 정보를 가져오는데 실패했습니다' }, { status: 500 })
    }

    return NextResponse.json({ orders: orders || [] }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}