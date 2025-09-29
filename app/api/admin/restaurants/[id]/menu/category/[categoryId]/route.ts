import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'

// POST로 들어오는 요청을 _method 필드에 따라 처리
export async function POST(req: NextRequest, context: any) {
  const formData = await req.formData()
  const method = (formData.get('_method') as string) || 'POST'
  if (method === 'PATCH') return updateCategory(req, context, formData)
  if (method === 'DELETE') return deleteCategory(req, context)
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

// Also support real HTTP methods for clients that send PATCH/DELETE directly
export async function PATCH(req: NextRequest, context: any) {
  const formData = await req.formData().catch(() => null)
  return updateCategory(req, context, formData || undefined)
}

export async function DELETE(req: NextRequest, context: any) {
  return deleteCategory(req, context)
}

// 카테고리 수정
async function updateCategory(
  req: NextRequest,
  context: any,
  formData?: FormData
) {
  try {
    const resolvedParams = (context && context.params) || {}
    const { id: restaurantId, categoryId } = resolvedParams

    if (!restaurantId || !categoryId) {
      return NextResponse.json({ error: 'Restaurant ID and Category ID are required' }, { status: 400 })
    }

    await requireRole('manager', { targetRestaurantId: restaurantId })

  const body = formData || (await req.formData())
  const name = (body.get('name') as string) || ''
  const position = parseInt((body.get('position') as string) || '0') || 0

    if (!name) {
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리 이름은 필수입니다`, req.url),
        303
      )
    }

    const sb = supabaseAdmin()

    // 카테고리 존재 확인 및 소유권 검증
    const { data: existingCategory } = await sb
      .from('menu_categories')
      .select('id, name')
      .eq('id', categoryId)
      .eq('restaurant_id', restaurantId)
      .single()

    if (!existingCategory) {
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리를 찾을 수 없습니다`, req.url),
        303
      )
    }

    // 카테고리 업데이트
    const { error } = await sb
      .from('menu_categories')
      .update({ name, position })
      .eq('id', categoryId)
      .eq('restaurant_id', restaurantId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리 수정 중 오류가 발생했습니다`, req.url),
        303
      )
    }

    return NextResponse.redirect(
      new URL(`/admin/restaurants/${restaurantId}/menu?success=${encodeURIComponent(name)}%20카테고리가%20수정되었습니다`, req.url),
      303
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 카테고리 삭제
async function deleteCategory(
  req: NextRequest,
  context: any
) {
  try {
    const resolvedParams = (context && context.params) || {}
    const { id: restaurantId, categoryId } = resolvedParams

    if (!restaurantId || !categoryId) {
      return NextResponse.json({ error: 'Restaurant ID and Category ID are required' }, { status: 400 })
    }

    await requireRole('manager', { targetRestaurantId: restaurantId })

    const sb = supabaseAdmin()

    // 카테고리 존재 확인 및 소유권 검증
    const { data: existingCategory } = await sb
      .from('menu_categories')
      .select('id, name')
      .eq('id', categoryId)
      .eq('restaurant_id', restaurantId)
      .single()

    if (!existingCategory) {
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리를 찾을 수 없습니다`, req.url),
        303
      )
    }

    // 카테고리에 속한 메뉴 아이템 확인
    const { data: menuItems } = await sb
      .from('menu_items')
      .select('id')
      .eq('category_id', categoryId)
      .eq('restaurant_id', restaurantId)

    if (menuItems && menuItems.length > 0) {
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리에 메뉴 아이템이 있어서 삭제할 수 없습니다. 먼저 메뉴 아이템을 삭제하거나 다른 카테고리로 이동해주세요`, req.url),
        303
      )
    }

    // 카테고리 삭제
    const { error } = await sb
      .from('menu_categories')
      .delete()
      .eq('id', categoryId)
      .eq('restaurant_id', restaurantId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.redirect(
        new URL(`/admin/restaurants/${restaurantId}/menu?error=카테고리 삭제 중 오류가 발생했습니다`, req.url),
        303
      )
    }

    return NextResponse.redirect(
      new URL(`/admin/restaurants/${restaurantId}/menu?success=${encodeURIComponent(existingCategory.name)}%20카테고리가%20삭제되었습니다`, req.url),
      303
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}