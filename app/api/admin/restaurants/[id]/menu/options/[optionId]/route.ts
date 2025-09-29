import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; optionId: string }> }) {
  try {
    const { restaurant_id } = await requireRole('manager')
    const { id: rid, optionId } = await params
    
    if (rid !== restaurant_id) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 })
    }

    const supabase = supabaseAdmin()
    
    // 옵션이 해당 레스토랑 소속인지 확인
    const { data: option } = await supabase
      .from('menu_options')
      .select('id')
      .eq('id', optionId)
      .eq('restaurant_id', restaurant_id)
      .single()

    if (!option) {
      return NextResponse.json({ error: '옵션을 찾을 수 없습니다' }, { status: 404 })
    }

    const { error } = await supabase
      .from('menu_options')
      .delete()
      .eq('id', optionId)

    if (error) {
      console.error('Option deletion error:', error)
      return NextResponse.json({ error: '옵션 삭제에 실패했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}