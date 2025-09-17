import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ManagerOrderPage() {
  const { restaurant_id } = await requireRole('manager')
  if (!restaurant_id) {
    return (
      <div className='p-6'>
        <p className='text-red-600'>소속된 레스토랑이 없습니다.</p>
      </div>
    )
  }

  const supabase = createSupabaseServer()

  // 현재 진행 중인 주문들 가져오기 (최근 24시간)
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      table_id,
      status,
      total_amount,
      created_at,
      updated_at,
      tables (
        id,
        name
      ),
      order_items (
        id,
        quantity,
        price,
        notes,
        menu_items (
          id,
          name,
          price
        )
      )
    `)
    .eq('restaurant_id', restaurant_id)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })

  // 주문 상태별 카운트
  const orderStats = (orders ?? []).reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { text: '주문 대기', color: 'bg-yellow-100 text-yellow-800' }
      case 'confirmed': return { text: '주문 확인', color: 'bg-blue-100 text-blue-800' }
      case 'preparing': return { text: '준비 중', color: 'bg-orange-100 text-orange-800' }
      case 'ready': return { text: '준비 완료', color: 'bg-green-100 text-green-800' }
      case 'served': return { text: '서빙 완료', color: 'bg-gray-100 text-gray-800' }
      case 'cancelled': return { text: '취소됨', color: 'bg-red-100 text-red-800' }
      default: return { text: '알 수 없음', color: 'bg-gray-100 text-gray-800' }
    }
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>📋 주문 관리</h1>
            <p className='text-blue-100'>실시간 주문 확인 및 처리</p>
          </div>
          <div className='ml-4'>
            <Link
              href="/manager"
              className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              <span className="mr-2">🏠</span>
              홈
            </Link>
          </div>
        </div>
      </div>

      {/* 주문 통계 */}
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-yellow-600'>주문대기: {orderStats.pending || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-blue-600'>주문확인: {orderStats.confirmed || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-orange-600'>준비중: {orderStats.preparing || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-green-600'>준비완료: {orderStats.ready || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-gray-600'>서빙완료: {orderStats.served || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-red-600'>취소됨: {orderStats.cancelled || 0}</div>
          </div>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>📋</span>
            최근 주문 목록 ({orders?.length || 0}건)
          </h2>
          <p className='text-sm text-gray-600 mt-1'>최근 24시간 내 주문들</p>
        </div>

        {orders && orders.length > 0 ? (
          <div className='divide-y divide-gray-200'>
            {orders.map((order) => {
              const statusInfo = getStatusDisplay(order.status)
              const totalItems = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0

              return (
                <div key={order.id} className='p-6 hover:bg-gray-50 transition-colors'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='text-lg font-semibold text-gray-900'>
                        주문 #{order.id.slice(0, 8)}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                      <div className='text-sm text-gray-600'>
                        🪑 {(order.tables as any)?.name || '테이블 정보 없음'}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-gray-900'>
                        {order.total_amount?.toLocaleString()}원
                      </div>
                      <div className='text-sm text-gray-500'>
                        {new Date(order.created_at).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>

                  {/* 주문 아이템들 */}
                  <div className='space-y-2 mb-4'>
                    {order.order_items?.map((item) => (
                      <div key={item.id} className='flex items-center justify-between bg-gray-50 rounded-lg p-3'>
                        <div className='flex items-center space-x-3'>
                          <span className='text-sm font-medium text-gray-900'>
                            {(item.menu_items as any)?.name || '메뉴 정보 없음'}
                          </span>
                          <span className='text-sm text-gray-600'>
                            × {item.quantity}
                          </span>
                          {item.notes && (
                            <span className='text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded'>
                              요청사항: {item.notes}
                            </span>
                          )}
                        </div>
                        <div className='text-sm font-medium text-gray-900'>
                          {(item.price * item.quantity).toLocaleString()}원
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 액션 버튼들 */}
                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-600'>
                      총 {totalItems}개 메뉴
                    </div>
                    <div className='flex space-x-2'>
                      {order.status === 'pending' && (
                        <button className='inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors'>
                          주문 확인
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button className='inline-flex items-center px-3 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors'>
                          준비 시작
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button className='inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors'>
                          준비 완료
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button className='inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors'>
                          서빙 완료
                        </button>
                      )}
                      <Link
                        href={`/manager/order/${order.id}` as any}
                        className='inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors'
                      >
                        상세보기
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>📋</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>주문이 없습니다</h3>
            <p className='text-gray-500 mb-4'>최근 24시간 내에 들어온 주문이 없습니다.</p>
            <Link
              href={`/manager/tables` as any}
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <span className='mr-2'>🪑</span>
              테이블 관리
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
