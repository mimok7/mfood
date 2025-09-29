import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { restaurant_id } = await requireRole('manager')
    const { id: rid } = await params
    
    if (rid !== restaurant_id) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 })
    }

    const payload = await req.json()
    const { group_id, name, price_delta } = payload

    if (!group_id || !name) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다' }, { status: 400 })
    }

    const supabase = supabaseAdmin()
    
    // 그룹이 해당 레스토랑 소속인지 확인
    const { data: group } = await supabase
      .from('menu_option_groups')
      .select('id')
      .eq('id', group_id)
      .eq('restaurant_id', restaurant_id)
      .single()

    if (!group) {
      return NextResponse.json({ error: '옵션 그룹을 찾을 수 없습니다' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('menu_options')
      .insert({
        restaurant_id,
        group_id,
        name,
        price_delta: price_delta || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Option creation error:', error)
      return NextResponse.json({ error: '옵션 생성에 실패했습니다' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}