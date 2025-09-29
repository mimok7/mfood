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
    const { menu_item_id, name, min_select, max_select, required } = payload

    if (!menu_item_id || !name) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다' }, { status: 400 })
    }

    const supabase = supabaseAdmin()
    
    // 메뉴 아이템이 해당 레스토랑 소속인지 확인
    const { data: menuItem } = await supabase
      .from('menu_items')
      .select('id')
      .eq('id', menu_item_id)
      .eq('restaurant_id', restaurant_id)
      .single()

    if (!menuItem) {
      return NextResponse.json({ error: '메뉴 아이템을 찾을 수 없습니다' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('menu_option_groups')
      .insert({
        restaurant_id,
        menu_item_id,
        name,
        min_select: min_select || 0,
        max_select: max_select || 1,
        required: Boolean(required)
      })
      .select()
      .single()

    if (error) {
      console.error('Option group creation error:', error)
      return NextResponse.json({ error: '옵션 그룹 생성에 실패했습니다' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}