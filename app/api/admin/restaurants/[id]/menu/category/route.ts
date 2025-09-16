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
    const position = Number(form.get('position') || 0)

    if (!name) {
      return NextResponse.redirect(new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리 이름을 입력해주세요`, req.url), 303)
    }

    const sb = supabaseAdmin()
    const { error } = await sb.from('menu_categories').insert({
      restaurant_id: restaurantId,
      name,
      position
    })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.redirect(new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리 추가 중 오류가 발생했습니다`, req.url), 303)
    }

    return NextResponse.redirect(new URL(`/admin/restaurants/${restaurantId}/menu?success=카테고리가 추가되었습니다`, req.url), 303)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
