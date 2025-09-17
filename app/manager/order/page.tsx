// Manager orders page
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

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
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      table_id,
      status,
      created_at,
      updated_at,
      tables!inner (
        id,
        name
      ),
      order_items (
        id,
        qty,
        price,
        note,
        menu_items (
          id,
          name,
          price
        )
      )
    `)
    .eq('tables.restaurant_id', restaurant_id)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('주문 조회 오류:', error)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">주문 관리</h1>
        <p className="text-red-600">주문을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'open':
        return { text: '주문 대기', color: 'bg-yellow-100 text-yellow-800' }
      case 'sent':
        return { text: '주문 확인', color: 'bg-blue-100 text-blue-800' }
      case 'served':
        return { text: '서빙 완료', color: 'bg-green-100 text-green-800' }
      case 'cancelled':
        return { text: '취소됨', color: 'bg-red-100 text-red-800' }
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800' }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">주문 관리</h1>
        <div className="text-sm text-gray-600">
          최근 24시간 주문 현황
        </div>
      </div>

      {orders && orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">현재 진행 중인 주문이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => {
            const status = getStatusDisplay(order.status)
            const totalItems = order.order_items?.reduce((sum: number, item: any) => sum + item.qty, 0) || 0
            const totalAmount = order.order_items?.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0) || 0

            return (
              <div key={order.id} className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        테이블 {order.tables?.[0]?.name || '알 수 없음'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      주문 시간: {new Date(order.created_at).toLocaleString('ko-KR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      아이템 {totalItems}개
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {totalAmount.toLocaleString()}원
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">주문 항목</h4>
                  <div className="space-y-2">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-start bg-gray-50 p-3 rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {item.menu_items?.[0]?.name || '메뉴 정보 없음'}
                            </span>
                            <span className="text-gray-600 text-sm">
                              × {item.qty}
                            </span>
                          </div>
                          {item.note && (
                            <div className="text-sm text-gray-600 mt-1">
                              요청사항: {item.note}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            {(item.price * item.qty).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex gap-2">
                    {order.status === 'open' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        주문 확인
                      </button>
                    )}
                    {order.status === 'sent' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        서빙 완료
                      </button>
                    )}
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                      주문 취소
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}