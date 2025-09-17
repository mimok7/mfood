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

    // 테이블 정보 가져오기
    const { data: tables, error: tablesError } = await supabaseAdmin()
      .from('tables')
      .select('*')
      .eq('restaurant_id', restaurant_id)
      .order('name', { ascending: true })

    if (tablesError) {
      console.error('Tables fetch error:', tablesError)
      return NextResponse.json({ error: '테이블 정보를 가져오는데 실패했습니다' }, { status: 500 })
    }

    return NextResponse.json({ tables: tables || [] }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}