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
  const restaurantId = urlObj.searchParams.get('restaurant')

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-starbucks-house via-[#162f28] to-starbucks-green p-4 relative overflow-hidden">
        {/* 장식용 은은한 구체 광선 */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-starbucks-light/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-starbucks-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <main className="w-full max-w-md relative z-10">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 text-center animate-fade-in">
            {/* 로고 영역 */}
            <div className="w-24 h-24 mb-5 mx-auto rounded-3xl overflow-hidden shadow-lg border border-slate-100/30">
              <img src="/icon-512.png" alt="mFood Logo" className="w-full h-full object-cover" />
            </div>

            {/* 타이틀 및 소개글 */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-starbucks-light text-starbucks-green border border-starbucks-green/20 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-starbucks-green animate-pulse"></span>
              대기 신청 접수처
            </span>
            <h1 className="text-2xl font-black text-starbucks-house tracking-tight mb-1">{restaurantName}</h1>
            <p className="text-xs text-starbucks-textBlackSoft leading-normal mb-6">
              아래 양식에 정보를 입력하여 대기 접수를 진행해 주세요.
            </p>

            <WaitingForm />
          </div>
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
