export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function TrafficPage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const restaurantId = resolvedParams?.id

  // 식당 정보 조회
  const { data: restaurant } = await sb
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .maybeSingle()

  // 오늘의 주문 수
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: todayOrders, count: todayOrderCount } = await sb
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('restaurant_id', restaurantId)
    .gte('created_at', today.toISOString())

  // 이번 주 주문 수
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const { count: weekOrderCount } = await sb
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('restaurant_id', restaurantId)
    .gte('created_at', weekStart.toISOString())

  // 이번 달 주문 수
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const { count: monthOrderCount } = await sb
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('restaurant_id', restaurantId)
    .gte('created_at', monthStart.toISOString())

  // 웨이팅 리스트 현황
  const { data: waitlist } = await sb
    .from('waitlist')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('status', 'waiting')
    .order('created_at')

  // 키친 큐 현황
  const { data: kitchenQueue } = await sb
    .from('kitchen_queue')
    .select(`
      *,
      order_items (
        qty,
        menu_items (name, station)
      )
    `)
    .eq('restaurant_id', restaurantId)
    .in('status', ['queued', 'prepping'])
    .order('created_at')

  // 테이블 현황
  const { data: tables } = await sb
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurantId)

  // 인기 메뉴 아이템 (이번 달)
  const { data: popularItems } = await sb
    .from('order_items')
    .select(`
      item_id,
      qty,
      menu_items (name),
      orders!inner (created_at)
    `)
    .gte('orders.created_at', monthStart.toISOString())
    .order('qty', { ascending: false })
    .limit(5)

  // 주문 상태별 통계
  const { data: orderStats } = await sb
    .from('orders')
    .select('status')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', monthStart.toISOString())

  const statusCounts = orderStats?.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2'>📊 트래픽 분석</h1>
        <p className='text-green-100'>{restaurant?.name} 레스토랑의 실시간 트래픽 현황을 확인하세요</p>
      </div>

      {/* 주요 지표 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>오늘 주문</p>
              <p className='text-3xl font-bold text-gray-900'>{todayOrderCount || 0}</p>
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
              <p className='text-3xl font-bold text-gray-900'>{weekOrderCount || 0}</p>
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
              <p className='text-3xl font-bold text-gray-900'>{monthOrderCount || 0}</p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>📊</span>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>대기 손님</p>
              <p className='text-3xl font-bold text-gray-900'>{waitlist?.length || 0}</p>
            </div>
            <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>⏳</span>
            </div>
          </div>
        </div>
      </div>

      {/* 실시간 현황 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 웨이팅 리스트 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>웨이팅 리스트</h2>
            <p className='text-sm text-gray-600 mt-1'>현재 대기 중인 손님 목록</p>
          </div>
          <div className='p-6'>
            {waitlist && waitlist.length > 0 ? (
              <div className='space-y-3'>
                {waitlist.slice(0, 5).map((item: any, idx: number) => (
                  <div key={item.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center'>
                        <span className='text-orange-600 font-semibold text-sm'>{idx + 1}</span>
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>{item.name}</p>
                        <p className='text-sm text-gray-500'>{item.party_size}명</p>
                      </div>
                    </div>
                    <div className='text-sm text-gray-500'>
                      {new Date(item.created_at).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
                {waitlist.length > 5 && (
                  <p className='text-sm text-gray-500 text-center pt-2'>
                    외 {waitlist.length - 5}명 대기 중...
                  </p>
                )}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='text-4xl mb-2'>🎉</div>
                <p className='text-gray-500'>대기 손님이 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 키친 큐 현황 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>주방 현황</h2>
            <p className='text-sm text-gray-600 mt-1'>현재 조리 중인 주문 항목</p>
          </div>
          <div className='p-6'>
            {kitchenQueue && kitchenQueue.length > 0 ? (
              <div className='space-y-3'>
                {kitchenQueue.slice(0, 5).map((item: any) => (
                  <div key={item.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'queued' ? 'bg-yellow-400' :
                        item.status === 'prepping' ? 'bg-orange-400' : 'bg-green-400'
                      }`}></div>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {item.order_items?.menu_items?.name || '알 수 없음'}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {item.order_items?.qty}개 • {item.order_items?.menu_items?.station || 'main'}
                        </p>
                      </div>
                    </div>
                    <div className='text-sm text-gray-500'>
                      {new Date(item.created_at).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
                {kitchenQueue.length > 5 && (
                  <p className='text-sm text-gray-500 text-center pt-2'>
                    외 {kitchenQueue.length - 5}개 항목 조리 중...
                  </p>
                )}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='text-4xl mb-2'>👨‍🍳</div>
                <p className='text-gray-500'>조리 중인 항목이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 추가 통계 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 주문 상태별 통계 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>주문 상태 현황</h2>
            <p className='text-sm text-gray-600 mt-1'>이번 달 주문 상태별 분포</p>
          </div>
          <div className='p-6'>
            <div className='space-y-3'>
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'open' ? 'bg-blue-400' :
                      status === 'sent' ? 'bg-yellow-400' :
                      status === 'served' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className='text-sm font-medium text-gray-900 capitalize'>
                      {status === 'open' ? '주문 중' :
                       status === 'sent' ? '주방 전송' :
                       status === 'served' ? '서빙 완료' : '취소됨'}
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-gray-900'>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 인기 메뉴 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>인기 메뉴</h2>
            <p className='text-sm text-gray-600 mt-1'>이번 달 가장 많이 주문된 메뉴</p>
          </div>
          <div className='p-6'>
            {popularItems && popularItems.length > 0 ? (
              <div className='space-y-3'>
                {popularItems.map((item: any, idx: number) => (
                  <div key={item.item_id} className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center'>
                        <span className='text-yellow-600 font-semibold text-xs'>{idx + 1}</span>
                      </div>
                      <span className='text-sm font-medium text-gray-900'>
                        {item.menu_items?.name || '알 수 없음'}
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900'>{item.qty}회</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <div className='text-4xl mb-2'>🍽️</div>
                <p className='text-gray-500'>주문 데이터가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 테이블 사용률 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>테이블 현황</h2>
          <p className='text-sm text-gray-600 mt-1'>전체 테이블 수와 수용인원</p>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
              <div className='text-2xl font-bold text-blue-600'>{tables?.length || 0}</div>
              <div className='text-sm text-blue-800'>총 테이블 수</div>
            </div>
            <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
              <div className='text-2xl font-bold text-green-600'>
                {tables?.reduce((sum, t) => sum + (t.capacity || 4), 0) || 0}
              </div>
              <div className='text-sm text-green-800'>총 수용인원</div>
            </div>
            <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
              <div className='text-2xl font-bold text-purple-600'>
                {tables?.length ? Math.round((tables.reduce((sum, t) => sum + (t.capacity || 4), 0) / tables.length) * 10) / 10 : 0}
              </div>
              <div className='text-sm text-purple-800'>평균 테이블 크기</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
