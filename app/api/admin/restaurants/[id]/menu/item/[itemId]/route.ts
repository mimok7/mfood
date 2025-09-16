import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  try {
    const resolvedParams = await params
    const restaurantId = resolvedParams.id
    const itemId = resolvedParams.itemId

    if (!restaurantId || !itemId) {
      return NextResponse.json({ error: 'Restaurant ID and Item ID are required' }, { status: 400 })
    }

    await requireRole('manager', { targetRestaurantId: restaurantId })

    const form = await req.formData()
    const name = String(form.get('name') || '').trim()
    const price = Number(form.get('price') || 0)
    const category_id = String(form.get('category_id') || '') || null
    const image_url = String(form.get('image_url') || '').trim() || null
    const is_active = String(form.get('is_active') || 'true') === 'true'

    if (!name || !price) {
      return NextResponse.json({ error: '메뉴 이름과 가격을 입력해주세요' }, { status: 400 })
    }

    const sb = supabaseAdmin()
    const { error } = await sb.from('menu_items')
      .update({
        name,
        price,
        category_id,
        image_url,
        is_active
      })
      .eq('id', itemId)
      .eq('restaurant_id', restaurantId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: '메뉴 수정 중 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '메뉴가 수정되었습니다' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  try {
    const resolvedParams = await params
    const restaurantId = resolvedParams.id
    const itemId = resolvedParams.itemId

    if (!restaurantId || !itemId) {
      return NextResponse.json({ error: 'Restaurant ID and Item ID are required' }, { status: 400 })
    }

    await requireRole('manager', { targetRestaurantId: restaurantId })

    const sb = supabaseAdmin()
    const { error } = await sb.from('menu_items')
      .delete()
      .eq('id', itemId)
      .eq('restaurant_id', restaurantId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: '메뉴 삭제 중 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '메뉴가 삭제되었습니다' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}