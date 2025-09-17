import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { headers } from 'next/headers'
import WaitingForm from './WaitingForm'

export const dynamic = 'force-dynamic'

export default async function GuestPage() {
  // URL에서 파라미터 확인
  const headersList = await headers()
  const url = headersList.get('x-url') || ''
  const urlObj = new URL(url.startsWith('http') ? url : `http://localhost${url}`)
  const token = urlObj.searchParams.get('token')
  const type = urlObj.searchParams.get('type')
  // support both 'restaurant' and 'restaurant_id' query param names
  const restaurantId = urlObj.searchParams.get('restaurant') || urlObj.searchParams.get('restaurant_id') || urlObj.searchParams.get('rid')

  let menuItems: any[] = []
  let restaurantName = '레스토랑'

  // QR 타입에 따른 처리
  const isWaitingQR = type === 'waiting' || (!token && !type)
  const isOrderQR = token !== null

  // 식당 이름 가져오기 (restaurant_id 우선)
  const supabase = supabaseAdmin()
  if (restaurantId) {
    // URL에 restaurant_id가 있는 경우
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('name')
      .eq('id', restaurantId)
      .maybeSingle()
    restaurantName = restaurant?.name || '레스토랑'
  } else if (isOrderQR && token) {
    // 주문 QR: 토큰이 있는 경우 해당 레스토랑의 메뉴 가져오기
    const { data: table } = await supabase
      .from('tables')
      .select('id, restaurant_id, restaurants(name)')
      .eq('token', token)
      .maybeSingle()

    if (table?.restaurant_id) {
      restaurantName = (table.restaurants as any)?.name || '레스토랑'

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
  } else {
    // 대기 QR: 토큰이 없는 경우 레스토랑 이름 가져오기
    try {
      const { data: rs } = await supabase
        .from('restaurant_settings')
        .select('name')
        .limit(1)
        .maybeSingle()
      restaurantName = rs?.name ?? restaurantName
    } catch {}
  }

  // QR 타입에 따른 UI 렌더링
  if (isWaitingQR) {
    // 대기 QR: 대기 신청 UI
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
        <main className="max-w-screen-sm mx-auto px-6 py-10">
          <div className="bg-green-600 rounded-2xl shadow-lg p-6 border border-gray-100 mb-6 text-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🪑</span>
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">{restaurantName}</h1>
                <p className="text-sm md:text-base text-green-100 mt-0.5">대기 신청 — 아래 양식에 정보를 입력해 주세요.</p>
              </div>
            </div>
          </div>
          <WaitingForm restaurantId={restaurantId ?? undefined} wt={urlObj.searchParams.get('wt') ?? undefined} />
        </main>
      </div>
    )
  }

  // 주문 QR: 주문 UI
  return (
    <div className="space-y-6">
      {/* 메뉴 표시 */}
      {menuItems.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🍽️</span>
            {restaurantName} 메뉴
          </h2>

          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {(item.menu_categories as any)?.name || '기타'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {item.price?.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/menu?token=${token}` as any}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center mt-4"
          >
            <span className="mr-2">📋</span>
            전체 메뉴 보기
          </Link>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">메뉴 준비 중</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      )}
    </div>
  )
}

// ...existing code... (client components moved to separate files)
