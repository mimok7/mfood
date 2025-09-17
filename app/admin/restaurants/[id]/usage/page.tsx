export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function UsagePage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const restaurantId = resolvedParams?.id

  // 식당 정보 조회
  const { data: restaurant } = await sb
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .maybeSingle()

  const safeRestaurantName = restaurant?.name || `식당 ${restaurantId?.slice(0,8) ?? ''}`

  // 기간별 주문 통계 계산을 위한 헬퍼 함수
  const getOrderStats = async (startDate: Date) => {
    const { count } = await sb
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('restaurant_id', restaurantId)
      .gte('created_at', startDate.toISOString())
    return count || 0
  }

  // 오늘 통계
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayOrders = await getOrderStats(today)

  // 이번 주 통계
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekOrders = await getOrderStats(weekStart)

  // 이번 달 통계
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthOrders = await getOrderStats(monthStart)

  // 지난 달 통계 (비교용)
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59)
  const { count: lastMonthOrders } = await sb
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('restaurant_id', restaurantId)
    .gte('created_at', lastMonthStart.toISOString())
    .lte('created_at', lastMonthEnd.toISOString())

  // 메뉴 아이템별 판매량 (이번 달)
  const { data: menuSales } = await sb
    .from('order_items')
    .select(`
      item_id,
      qty,
      price,
      menu_items!inner (name, price)
    `)
    .eq('restaurant_id', restaurantId)
    .gte('created_at', monthStart.toISOString())
    .order('qty', { ascending: false })
    .limit(10)

  // 메뉴 아이템별 판매량 집계
  const menuStats = menuSales?.reduce((acc, item: any) => {
    const itemId = item.item_id
    if (!acc[itemId]) {
      acc[itemId] = {
        name: item.menu_items?.name || '알 수 없음',
        totalQty: 0,
        totalRevenue: 0,
        unitPrice: item.menu_items?.price || item.price
      }
    }
    acc[itemId].totalQty += item.qty
    acc[itemId].totalRevenue += item.qty * (item.menu_items?.price || item.price)
    return acc
  }, {} as Record<string, { name: string; totalQty: number; totalRevenue: number; unitPrice: number }>) || {}

  // 테이블 사용 통계
  const { data: tables } = await sb
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurantId)

  // 웨이팅 리스트 통계 (이번 달)
  const { data: waitlistStats } = await sb
    .from('waitlist')
    .select('status, party_size, created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', monthStart.toISOString())

  const waitlistSummary = waitlistStats?.reduce((acc, item) => {
    acc.total += 1
    acc.totalPartySize += item.party_size
    if (item.status === 'completed') acc.completed += 1
    if (item.status === 'no_show') acc.noShow += 1
    return acc
  }, { total: 0, completed: 0, noShow: 0, totalPartySize: 0 }) || { total: 0, completed: 0, noShow: 0, totalPartySize: 0 }

  // 키친 큐 처리량 (이번 달)
  const { data: kitchenStats } = await sb
    .from('kitchen_queue')
    .select('status, created_at, updated_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', monthStart.toISOString())

  const kitchenSummary = kitchenStats?.reduce((acc, item) => {
    acc.total += 1
    if (item.status === 'served') {
      acc.completed += 1
      if (item.updated_at) {
        const processingTime = new Date(item.updated_at).getTime() - new Date(item.created_at).getTime()
        acc.totalProcessingTime += processingTime
      }
    }
    return acc
  }, { total: 0, completed: 0, totalProcessingTime: 0 }) || { total: 0, completed: 0, totalProcessingTime: 0 }

  // 사용자별 활동 통계
  const { data: userActivity } = await sb
    .from('orders')
    .select(`
      user_id,
      user_profile!inner (role)
    `)
    .eq('restaurant_id', restaurantId)
    .gte('created_at', monthStart.toISOString())

  const userStats = userActivity?.reduce((acc, order: any) => {
    const role = order.user_profile?.role || 'guest'
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2'>📈 사용량 분석</h1>
  <p className='text-purple-100'>{safeRestaurantName} 레스토랑의 상세한 사용량 통계를 확인하세요</p>
      </div>

      {/* 주요 지표 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>오늘 주문</p>
              <p className='text-3xl font-bold text-gray-900'>{todayOrders}</p>
              <p className='text-xs text-gray-500 mt-1'>실시간</p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>📦</span>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>이번 주 주문</p>
              <p className='text-3xl font-bold text-gray-900'>{weekOrders}</p>
              <p className='text-xs text-green-600 mt-1'>+{Math.round((weekOrders / 7) * 10) / 10}일 평균</p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>📈</span>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>이번 달 주문</p>
              <p className='text-3xl font-bold text-gray-900'>{monthOrders}</p>
              <p className={`text-xs mt-1 ${monthOrders > (lastMonthOrders || 0) ? 'text-green-600' : 'text-red-600'}`}>
                {lastMonthOrders ? `${monthOrders > lastMonthOrders ? '+' : ''}${Math.round(((monthOrders - lastMonthOrders) / (lastMonthOrders || 1)) * 100)}%` : '전월 대비'}
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>📊</span>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>총 매출</p>
              <p className='text-3xl font-bold text-gray-900'>
                ₩{Object.values(menuStats).reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString()}
              </p>
              <p className='text-xs text-gray-500 mt-1'>이번 달</p>
            </div>
            <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 분석 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 메뉴 판매량 TOP 10 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>메뉴 판매량 TOP 10</h2>
            <p className='text-sm text-gray-600 mt-1'>이번 달 가장 많이 팔린 메뉴</p>
          </div>
          <div className='p-6'>
            {Object.entries(menuStats).length > 0 ? (
              <div className='space-y-4'>
                {Object.entries(menuStats)
                  .sort(([,a], [,b]) => b.totalQty - a.totalQty)
                  .slice(0, 10)
                  .map(([itemId, stats], idx) => (
                  <div key={itemId} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center'>
                        <span className='text-yellow-600 font-semibold text-sm'>#{idx + 1}</span>
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>{stats.name}</p>
                        <p className='text-sm text-gray-500'>₩{stats.unitPrice.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-900'>{stats.totalQty}개</p>
                      <p className='text-sm text-gray-600'>₩{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='text-4xl mb-2'>🍽️</div>
                <p className='text-gray-500'>판매 데이터가 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 웨이팅 리스트 통계 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>웨이팅 리스트 통계</h2>
            <p className='text-sm text-gray-600 mt-1'>이번 달 웨이팅 현황</p>
          </div>
          <div className='p-6'>
            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div className='bg-orange-50 p-4 rounded-lg border border-orange-200'>
                <div className='text-2xl font-bold text-orange-600'>{waitlistSummary.total}</div>
                <div className='text-sm text-orange-800'>총 웨이팅</div>
              </div>
              <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                <div className='text-2xl font-bold text-green-600'>{waitlistSummary.completed}</div>
                <div className='text-sm text-green-800'>입장 완료</div>
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>평균 웨이팅 그룹 크기</span>
                <span className='font-semibold text-gray-900'>
                  {waitlistSummary.total > 0 ? Math.round(waitlistSummary.totalPartySize / waitlistSummary.total * 10) / 10 : 0}명
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>입장율</span>
                <span className='font-semibold text-gray-900'>
                  {waitlistSummary.total > 0 ? Math.round((waitlistSummary.completed / waitlistSummary.total) * 100) : 0}%
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>노쇼율</span>
                <span className='font-semibold text-gray-900'>
                  {waitlistSummary.total > 0 ? Math.round((waitlistSummary.noShow / waitlistSummary.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 통계 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 키친 큐 통계 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>주방 처리량</h2>
            <p className='text-sm text-gray-600 mt-1'>이번 달 주방 효율성</p>
          </div>
          <div className='p-6'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>총 처리 항목</span>
                <span className='font-semibold text-gray-900'>{kitchenSummary.total}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>완료율</span>
                <span className='font-semibold text-gray-900'>
                  {kitchenSummary.total > 0 ? Math.round((kitchenSummary.completed / kitchenSummary.total) * 100) : 0}%
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>평균 처리시간</span>
                <span className='font-semibold text-gray-900'>
                  {kitchenSummary.completed > 0
                    ? `${Math.round((kitchenSummary.totalProcessingTime / kitchenSummary.completed) / 60000)}분`
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 테이블 사용률 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>테이블 현황</h2>
            <p className='text-sm text-gray-600 mt-1'>테이블 활용도</p>
          </div>
          <div className='p-6'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>총 테이블 수</span>
                <span className='font-semibold text-gray-900'>{tables?.length || 0}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>총 수용인원</span>
                <span className='font-semibold text-gray-900'>
                  {tables?.reduce((sum, t) => sum + (t.capacity || 4), 0) || 0}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>평균 테이블 크기</span>
                <span className='font-semibold text-gray-900'>
                  {tables?.length ? Math.round((tables.reduce((sum, t) => sum + (t.capacity || 4), 0) / tables.length) * 10) / 10 : 0}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>테이블당 평균 주문</span>
                <span className='font-semibold text-gray-900'>
                  {tables?.length ? Math.round((monthOrders / tables.length) * 10) / 10 : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 사용자 활동 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>사용자 활동</h2>
            <p className='text-sm text-gray-600 mt-1'>역할별 주문 활동</p>
          </div>
          <div className='p-6'>
            <div className='space-y-4'>
              {Object.entries(userStats).map(([role, count]) => (
                <div key={role} className='flex justify-between items-center'>
                  <div className='flex items-center space-x-2'>
                    <div className={`w-3 h-3 rounded-full ${
                      role === 'admin' ? 'bg-red-400' :
                      role === 'manager' ? 'bg-blue-400' : 'bg-green-400'
                    }`}></div>
                    <span className='text-sm text-gray-600 capitalize'>
                      {role === 'admin' ? '관리자' :
                       role === 'manager' ? '매니저' : '손님'}
                    </span>
                  </div>
                  <span className='font-semibold text-gray-900'>{count}</span>
                </div>
              ))}
              {Object.keys(userStats).length === 0 && (
                <div className='text-center py-4'>
                  <p className='text-gray-500 text-sm'>활동 데이터가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
