import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MenuOptionsClient from './MenuOptionsClient'

export default async function MenuOptionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rid } = await params
  const { role } = await requireRole('manager')
  const supabase = createSupabaseServer()

  // 레스토랑 확인
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name')
    .eq('id', rid)
    .single()

  if (!restaurant) {
    redirect('/admin/restaurants')
  }

  // 메뉴 아이템 목록
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select(`
      id,
      name,
      price,
      category_id,
      menu_categories(name)
    `)
    .eq('restaurant_id', rid)
    .eq('is_active', true)
    .order('name')

  // 기존 옵션 그룹들
  const { data: optionGroups } = await supabase
    .from('menu_option_groups')
    .select(`
      id,
      menu_item_id,
      name,
      min_select,
      max_select,
      required,
      position,
      menu_options(
        id,
        name,
        price_delta,
        is_active,
        position
      )
    `)
    .eq('restaurant_id', rid)
    .order('position')

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">🔧 메뉴 옵션 관리</h1>
            <p className="text-purple-100">메뉴 아이템에 옵션 그룹과 옵션을 추가하고 관리하세요</p>
            <div className="mt-4 text-sm text-purple-200">
              식당: <span className="font-semibold">{restaurant.name}</span>
            </div>
          </div>
          <div className="ml-4 flex space-x-2">
            <Link
              href={`/admin/restaurants/${rid}`}
              className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              <span className="mr-2">🏠</span>
              대시보드
            </Link>
            <Link
              href={`/admin/restaurants/${rid}/menu`}
              className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              <span className="mr-2">📋</span>
              메뉴 관리
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <MenuOptionsClient 
        restaurantId={rid}
        menuItems={(menuItems || []) as any}
        optionGroups={(optionGroups || []) as any}
      />
    </div>
  )
}