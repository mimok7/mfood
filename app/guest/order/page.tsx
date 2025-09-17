export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function GuestOrderPage() {
  // URL에서 파라미터 확인 (old 형식 맞춤: token | restaurant_id)
  const headersList = await headers()
  const url = headersList.get('x-url') || ''
  const urlObj = new URL(url.startsWith('http') ? url : `http://localhost${url}`)
  const token = urlObj.searchParams.get('token')
  const restaurantIdParam = urlObj.searchParams.get('restaurant_id') || urlObj.searchParams.get('restaurant')

  let menuItems: any[] = []
  let restaurantName = '레스토랑'
  let tableName: string | null = null

  // 식당 이름과 메뉴 가져오기
  const supabase = supabaseAdmin()

  if (token) {
    // 토큰이 있는 경우: 테이블/식당 조회 후 해당 식당 메뉴 로드
    const { data: table } = await supabase
      .from('tables')
      .select('id, name, restaurant_id, restaurants(name)')
      .eq('token', token)
      .maybeSingle()

    if (table?.restaurant_id) {
      restaurantName = (table.restaurants as any)?.name || '레스토랑'
      tableName = table.name || null

      const { data: items } = await supabase
        .from('menu_items')
        .select(`
          id,
          name,
          price,
          description,
          image_url,
          is_available,
          category_id,
          menu_categories(name)
        `)
        .eq('restaurant_id', table.restaurant_id)
        .eq('is_available', true)
        .order('name')

      menuItems = items ?? []
    }
  } else if (restaurantIdParam) {
    // restaurant_id(또는 restaurant)로 메뉴 로드
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('name')
      .eq('id', restaurantIdParam)
      .maybeSingle()

    restaurantName = restaurant?.name || '레스토랑'

    const { data: items } = await supabase
      .from('menu_items')
      .select(`
        id,
        name,
        price,
        description,
        image_url,
        is_available,
        category_id,
        menu_categories(name)
      `)
      .eq('restaurant_id', restaurantIdParam)
      .eq('is_available', true)
      .order('name')

    menuItems = items ?? []
  }

  // 올드 페이지와 유사한 레이아웃 구성 (상단 헤더/하단 고정 바)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 - sticky */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/guest" className="text-gray-600 hover:text-gray-800">←</Link>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {restaurantName}
                {tableName ? (
                  <span className="ml-1 text-gray-600 text-base">({tableName})</span>
                ) : null}
              </h1>
              <p className="text-base text-gray-600">메뉴를 선택하고 주문해보세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-screen-sm mx-auto px-4 pb-32 pt-4">
        {menuItems.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(
              menuItems.reduce((acc, item) => {
                const categoryName = (item.menu_categories as any)?.name || '기타'
                if (!acc[categoryName]) acc[categoryName] = []
                acc[categoryName].push(item)
                return acc
              }, {} as Record<string, typeof menuItems>)
            ).map(([categoryName, items]) => (
              <div key={categoryName} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">{categoryName}</h2>
                <div className="grid gap-4">
                  {(items as any[]).map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          )}
                          <p className="text-sm text-gray-500">카테고리: {(item.menu_categories as any)?.name || '기타'}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-gray-900 mb-2">{item.price?.toLocaleString()}원</div>
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">주문하기</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">메뉴를 불러올 수 없습니다</h2>
            <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
          </div>
        )}
      </div>

      {/* 하단 고정 바 (올드 페이지 형식 맞춤) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-screen-sm mx-auto p-4">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-lg transition-all duration-200 active:scale-95 text-base border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📋 주문내역
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}