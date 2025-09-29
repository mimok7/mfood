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
    
    // 기본 메뉴 아이템 정의
    const defaultMenuItems = [
      // 주류 카테고리
      { name: '참이슬 프레쉬', price: 5000, category_name: '주류' },
      { name: '처음처럼 프레쉬', price: 5000, category_name: '주류' },
      // 음료 카테고리
      { name: '사이다', price: 2000, category_name: '음료' },
      { name: '콜라', price: 2000, category_name: '음료' }
    ]

    // 카테고리 정보 가져오기
    const { data: categories } = await sb
      .from('menu_categories')
      .select('id, name')
      .eq('restaurant_id', restaurantId)

    if (!categories) {
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리를 찾을 수 없습니다. 먼저 주류와 음료 카테고리를 생성해주세요`, req.url),
        303
      )
    }

    // 카테고리 이름으로 ID 매핑
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat.id
      return acc
    }, {} as Record<string, string>)

    // 필요한 카테고리 확인
    const missingCategories = []
    if (!categoryMap['주류']) missingCategories.push('주류')
    if (!categoryMap['음료']) missingCategories.push('음료')

    if (missingCategories.length > 0) {
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=다음 카테고리를 먼저 생성해주세요: ${missingCategories.join(', ')}`, req.url),
        303
      )
    }

    // 이미 존재하는 메뉴 확인
    const { data: existingMenus } = await sb
      .from('menu_items')
      .select('name')
      .eq('restaurant_id', restaurantId)

    const existingMenuNames = existingMenus?.map(menu => menu.name) || []
    
    // 아직 생성되지 않은 메뉴만 필터링
    const menusToCreate = defaultMenuItems.filter(
      menu => !existingMenuNames.includes(menu.name)
    )

    if (menusToCreate.length === 0) {
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=모든 기본 메뉴가 이미 존재합니다`, req.url), 
        303
      )
    }

    // 메뉴 아이템들을 restaurant_id와 category_id와 함께 생성
    const menusWithIds = menusToCreate.map(menu => ({
      name: menu.name,
      price: menu.price,
      restaurant_id: restaurantId,
      category_id: categoryMap[menu.category_name],
      is_active: true,
      image_url: null
    }))

    const { error } = await sb
      .from('menu_items')
      .insert(menusWithIds)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=메뉴 생성 중 오류가 발생했습니다`, req.url), 
        303
      )
    }

    const createdMenus = menusToCreate.map(menu => menu.name).join(', ')
    return NextResponse.redirect(
      new URL(`/admin/restaurants/${restaurantId}/menu?success=${createdMenus} 메뉴가 생성되었습니다`, req.url), 
      303
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}