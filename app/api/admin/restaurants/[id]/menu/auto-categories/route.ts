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

    const sb = supabaseAdmin()
    
    // 기본 카테고리 정의 (순서대로)
    const defaultCategories = [
      { name: '식사', position: 0 },
      { name: '안주', position: 1 },
      { name: '주류', position: 2 },
      { name: '음료', position: 3 }
    ]

    // 이미 존재하는 카테고리 확인
    const { data: existingCategories } = await sb
      .from('menu_categories')
      .select('name')
      .eq('restaurant_id', restaurantId)

    const existingNames = existingCategories?.map(cat => cat.name) || []
    
    // 아직 생성되지 않은 카테고리만 필터링
    const categoriesToCreate = defaultCategories.filter(
      cat => !existingNames.includes(cat.name)
    )

    if (categoriesToCreate.length === 0) {
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=모든 기본 카테고리가 이미 존재합니다`, req.url), 
        303
      )
    }

    // 카테고리들을 restaurant_id와 함께 생성
    const categoriesWithRestaurantId = categoriesToCreate.map(cat => ({
      ...cat,
      restaurant_id: restaurantId
    }))

    const { error } = await sb
      .from('menu_categories')
      .insert(categoriesWithRestaurantId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리 생성 중 오류가 발생했습니다`, req.url), 
        303
      )
    }

    const createdNames = categoriesToCreate.map(cat => cat.name).join(', ')
    return NextResponse.redirect(
      new URL(`/admin/restaurants/${restaurantId}/menu?success=${createdNames} 카테고리가 생성되었습니다`, req.url), 
      303
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}