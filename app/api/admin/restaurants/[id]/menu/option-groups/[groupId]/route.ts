import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; groupId: string }> }) {
  try {
    const { restaurant_id } = await requireRole('manager')
    const { id: rid, groupId } = await params
    
    if (rid !== restaurant_id) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 })
    }

    const supabase = supabaseAdmin()
    
    // 그룹이 해당 레스토랑 소속인지 확인
    const { data: group } = await supabase
      .from('menu_option_groups')
      .select('id')
      .eq('id', groupId)
      .eq('restaurant_id', restaurant_id)
      .single()

    if (!group) {
      return NextResponse.json({ error: '옵션 그룹을 찾을 수 없습니다' }, { status: 404 })
    }

    // 그룹 삭제 (CASCADE로 옵션들도 함께 삭제됨)
    const { error } = await supabase
      .from('menu_option_groups')
      .delete()
      .eq('id', groupId)

    if (error) {
      console.error('Option group deletion error:', error)
      return NextResponse.json({ error: '옵션 그룹 삭제에 실패했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}