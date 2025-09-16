import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ManagerTablesPage() {
  const { restaurant_id } = await requireRole('manager')
  if (!restaurant_id) {
    return (
      <div className='p-6'>
        <p className='text-red-600'>소속된 레스토랑이 없습니다.</p>
      </div>
    )
  }

  const supabase = createSupabaseServer()

  // 테이블 정보 가져오기
  const { data: tables } = await supabase
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurant_id)
    .order('name', { ascending: true })

  // 현재 활성 주문들 가져오기 (테이블별 상태 확인용)
  const { data: activeOrders } = await supabase
    .from('orders')
    .select(`
      id,
      table_id,
      status,
      created_at,
      tables (
        id,
        name
      )
    `)
    .eq('restaurant_id', restaurant_id)
    .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
    .order('created_at', { ascending: false })

  // 테이블별 주문 상태 매핑
  const tableOrderMap = (activeOrders ?? []).reduce((acc, order) => {
    if (order.table_id) {
      acc[order.table_id] = order
    }
    return acc
  }, {} as Record<string, any>)

  const getTableStatus = (tableId: string) => {
    const order = tableOrderMap[tableId]
    if (!order) return { text: '비어있음', color: 'bg-gray-100 text-gray-800', icon: '🆓' }

    switch (order.status) {
      case 'pending':
      case 'confirmed':
        return { text: '주문 중', color: 'bg-blue-100 text-blue-800', icon: '📝' }
      case 'preparing':
        return { text: '준비 중', color: 'bg-orange-100 text-orange-800', icon: '👨‍🍳' }
      case 'ready':
        return { text: '서빙 대기', color: 'bg-green-100 text-green-800', icon: '🍽️' }
      default:
        return { text: '사용 중', color: 'bg-gray-100 text-gray-800', icon: '🪑' }
    }
  }

  // 테이블 통계
  const totalTables = tables?.length || 0
  const occupiedTables = Object.keys(tableOrderMap).length
  const availableTables = totalTables - occupiedTables

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>🪑 테이블</h1>
            <p className='text-purple-100'>테이블 배치도 및 상태 관리</p>
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

      {/* 테이블 통계 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-blue-600 mb-2'>{totalTables}</div>
            <div className='text-sm text-gray-600'>전체 테이블</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-green-600 mb-2'>{availableTables}</div>
            <div className='text-sm text-gray-600'>사용 가능</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-orange-600 mb-2'>{occupiedTables}</div>
            <div className='text-sm text-gray-600'>사용 중</div>
          </div>
        </div>
      </div>

      {/* 테이블 그리드 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>🏗️</span>
            테이블 배치도 ({tables?.length || 0}개)
          </h2>
          <p className='text-sm text-gray-600 mt-1'>실시간 테이블 상태</p>
        </div>

        {tables && tables.length > 0 ? (
          <div className='p-6'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {tables.map((table) => {
                const statusInfo = getTableStatus(table.id)

                return (
                  <div
                    key={table.id}
                    className='border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer'
                  >
                    {/* 테이블 헤더 */}
                    <div className='text-center mb-3'>
                      <div className='text-2xl mb-1'>🪑</div>
                      <div className='text-lg font-semibold text-gray-900'>{table.name}</div>
                      <div className='text-sm text-gray-600'>최대 {table.capacity || 4}명</div>
                    </div>

                    {/* 테이블 상태 */}
                    <div className='text-center'>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} mb-2`}>
                        <span className='mr-1'>{statusInfo.icon}</span>
                        {statusInfo.text}
                      </span>

                      {tableOrderMap[table.id] && (
                        <div className='text-xs text-gray-500'>
                          {new Date(tableOrderMap[table.id].created_at).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} 주문
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className='mt-3 flex gap-1'>
                      {statusInfo.text === '비어있음' ? (
                        <button className='flex-1 bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700 transition-colors'>
                          착석
                        </button>
                      ) : (
                        <>
                          <button className='flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors'>
                            상세
                          </button>
                          <button className='flex-1 bg-red-600 text-white text-xs py-1 px-2 rounded hover:bg-red-700 transition-colors'>
                            정리
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>🏗️</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>테이블이 없습니다</h3>
            <p className='text-gray-500 mb-4'>등록된 테이블이 없습니다. 관리자에게 문의하세요.</p>
            <Link
              href={`/manager`}
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <span className='mr-2'>🏠</span>
              대시보드
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}