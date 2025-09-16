import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const restaurantId = resolvedParams.id

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 })
    }

    await requireRole('manager', { targetRestaurantId: restaurantId })

    const form = await req.formData()
    const name = String(form.get('name') || '').trim()
    const price = Number(form.get('price') || 0)
    const category_id = String(form.get('category_id') || '') || null
    const image_url = String(form.get('image_url') || '').trim() || null
    const is_active = String(form.get('is_active') || 'true') === 'true'

    if (!name || !price) {
      return NextResponse.redirect(new URL(`/admin/restaurants/${restaurantId}/menu?error=메뉴 이름과 가격을 입력해주세요`, req.url), 303)
    }

    const sb = supabaseAdmin()
    const { error } = await sb.from('menu_items').insert({
      restaurant_id: restaurantId,
      name,
      price,
      category_id,
      image_url,
      is_active
    })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.redirect(new URL(`/admin/restaurants/${restaurantId}/menu?error=메뉴 추가 중 오류가 발생했습니다`, req.url), 303)
    }

    return NextResponse.redirect(new URL(`/admin/restaurants/${restaurantId}/menu?success=메뉴가 추가되었습니다`, req.url), 303)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
