import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function ServingPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()

  // 준비 완료된 주문 아이템들 가져오기 (서빙 대기)
  const { data: readyItemsRaw } = await supabase
    .from('kitchen_queue')
    .select(`
      id,
      station,
      status,
      created_at,
      order_item_id,
      order_items (
        id,
        quantity,
        notes,
        menu_items (
          id,
          name
        ),
        orders (
          id,
          table_id,
          status,
          tables (
            name
          )
        )
      )
    `)
    .eq('restaurant_id', restaurant_id)
    .eq('status', 'ready')
    .order('created_at', { ascending: true })

  const readyItems = (readyItemsRaw ?? []) as any[]

  // 테이블별로 그룹화
  const itemsByTable = (readyItems ?? []).reduce((acc: Record<string, { tableId: string | null, items: any[] }>, item: any) => {
    const tableId = item.order_items?.orders?.table_id
    const tableName = item.order_items?.orders?.tables?.name || '테이블 정보 없음'

    if (!acc[tableName]) {
      acc[tableName] = {
        tableId,
        items: []
      }
    }
    acc[tableName].items.push(item)
    return acc
  }, {} as Record<string, { tableId: string | null, items: any[] }>)

  const getStationDisplay = (station: string) => {
    switch (station) {
      case 'main': return '🍽️ 메인'
      case 'bar': return '🍷 바'
      case 'dessert': return '🍰 디저트'
      default: return station
    }
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>🍽️ 서빙</h1>
            <p className='text-teal-100'>준비 완료된 주문을 테이블별로 확인하고 서빙</p>
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

      {/* 테이블별 서빙 목록 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {Object.entries(itemsByTable).map(([tableName, { tableId, items }]) => (
          <div key={tableId || tableName} className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 flex items-center justify-between'>
                <span>🪑 {tableName}</span>
                <span className='text-sm text-gray-500'>({items.length}개)</span>
              </h2>
            </div>

            <div className='p-4 space-y-3 max-h-96 overflow-y-auto'>
              {items.length > 0 ? (
                items.map((item) => {
                  const orderItem = item.order_items
                  const menuItem = orderItem?.menu_items
                  const order = orderItem?.orders

                  return (
                    <div
                      key={item.id}
                      className='border rounded-lg p-4 bg-white hover:shadow-md transition-shadow'
                    >
                      {/* 주문 정보 헤더 */}
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center space-x-2'>
                          <span className='text-sm font-medium text-gray-900'>
                            주문 #{order?.id?.slice(0, 8)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                            준비완료
                          </span>
                        </div>
                      </div>

                      {/* 메뉴 정보 */}
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <h3 className='text-lg font-semibold text-gray-900'>
                            {menuItem?.name || '메뉴 정보 없음'}
                          </h3>
                          <span className='text-sm text-gray-600'>
                            × {orderItem?.quantity || 1}
                          </span>
                        </div>

                        <div className='flex items-center space-x-2 text-sm text-gray-600'>
                          <span>{getStationDisplay(item.station || 'main')}</span>
                          <span>•</span>
                          <span>
                            {new Date(item.created_at).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {orderItem?.notes && (
                          <div className='bg-yellow-50 border border-yellow-200 rounded p-2'>
                            <p className='text-sm text-yellow-800'>
                              📝 {orderItem.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 서빙 액션 버튼 */}
                      <div className='flex gap-2 mt-3'>
                        <button className='flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition-colors'>
                          서빙 중
                        </button>
                        <button className='flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700 transition-colors'>
                          서빙 완료
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <div className='text-4xl mb-2'>🍽️</div>
                  <p>서빙할 주문이 없습니다</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 서빙할 주문이 없을 때 */}
      {Object.keys(itemsByTable).length === 0 && (
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>🍽️</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>서빙할 주문이 없습니다</h3>
            <p className='text-gray-500'>준비 완료된 주문이 있으면 여기에 표시됩니다.</p>
          </div>
        </div>
      )}

      {/* 요약 정보 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-green-600 mb-2'>
              {readyItems?.length || 0}
            </div>
            <div className='text-sm text-gray-600'>서빙 대기</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-blue-600 mb-2'>
              {Object.keys(itemsByTable).length}
            </div>
            <div className='text-sm text-gray-600'>활성 테이블</div>
          </div>
        </div>
      </div>
    </div>
  )
}
