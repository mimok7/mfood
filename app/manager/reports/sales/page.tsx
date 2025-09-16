import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function SalesReportPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()

  // 오늘 날짜 계산
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  // 이번 달 계산
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  // 오늘 매출 데이터 가져오기
  const { data: todayOrders } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      created_at,
      order_items (
        id,
        qty,
        price,
        menu_items (
          id,
          name,
          category_id,
          menu_categories (
            id,
            name
          )
        )
      )
    `)
    .eq('restaurant_id', restaurant_id)
    .eq('status', 'served')
    .gte('created_at', todayStart.toISOString())
    .lt('created_at', todayEnd.toISOString())

  // 이번 달 매출 데이터 가져오기
  const { data: monthOrders } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      created_at,
      order_items (
        id,
        qty,
        price,
        menu_items (
          id,
          name,
          category_id,
          menu_categories (
            id,
            name
          )
        )
      )
    `)
    .eq('restaurant_id', restaurant_id)
    .eq('status', 'served')
    .gte('created_at', monthStart.toISOString())
    .lt('monthEnd', monthEnd.toISOString())

  // 매출 계산 함수
  const calculateSales = (orders: any[]) => {
    let totalRevenue = 0
    let totalOrders = orders?.length || 0
    const categorySales: Record<string, { revenue: number, count: number }> = {}
    const itemSales: Record<string, { revenue: number, count: number }> = {}

    orders?.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const revenue = item.qty * item.price
        totalRevenue += revenue

        // 카테고리별 매출
        const categoryName = item.menu_items?.menu_categories?.name || '기타'
        if (!categorySales[categoryName]) {
          categorySales[categoryName] = { revenue: 0, count: 0 }
        }
        categorySales[categoryName].revenue += revenue
        categorySales[categoryName].count += item.qty

        // 메뉴별 매출
        const itemName = item.menu_items?.name || '알 수 없음'
        if (!itemSales[itemName]) {
          itemSales[itemName] = { revenue: 0, count: 0 }
        }
        itemSales[itemName].revenue += revenue
        itemSales[itemName].count += item.qty
      })
    })

    return {
      totalRevenue,
      totalOrders,
      categorySales,
      itemSales
    }
  }

  const todaySales = calculateSales(todayOrders || [])
  const monthSales = calculateSales(monthOrders || [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>💰 매출</h1>
            <p className='text-green-100'>기간별 매출 현황과 상세 분석을 확인</p>
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

      {/* 주요 지표 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600 mb-2'>
              {formatCurrency(todaySales.totalRevenue)}
            </div>
            <div className='text-sm text-gray-600'>오늘 매출</div>
            <div className='text-xs text-gray-500 mt-1'>
              {todaySales.totalOrders}건 주문
            </div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600 mb-2'>
              {formatCurrency(monthSales.totalRevenue)}
            </div>
            <div className='text-sm text-gray-600'>이번 달 매출</div>
            <div className='text-xs text-gray-500 mt-1'>
              {monthSales.totalOrders}건 주문
            </div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-purple-600 mb-2'>
              {todaySales.totalOrders > 0 ? Math.round(todaySales.totalRevenue / todaySales.totalOrders) : 0}원
            </div>
            <div className='text-sm text-gray-600'>객단가 (오늘)</div>
            <div className='text-xs text-gray-500 mt-1'>
              평균 주문 금액
            </div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-orange-600 mb-2'>
              {Object.keys(todaySales.itemSales).length}
            </div>
            <div className='text-sm text-gray-600'>판매 메뉴 수</div>
            <div className='text-xs text-gray-500 mt-1'>
              오늘 판매된 메뉴 종류
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리별 매출 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>🍽️ 카테고리별 매출 (오늘)</h2>
          </div>
          <div className='p-6'>
            {Object.keys(todaySales.categorySales).length > 0 ? (
              <div className='space-y-4'>
                {Object.entries(todaySales.categorySales)
                  .sort(([,a], [,b]) => b.revenue - a.revenue)
                  .map(([category, data]) => (
                    <div key={category} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <div className='flex-1'>
                        <div className='font-medium text-gray-900'>{category}</div>
                        <div className='text-sm text-gray-600'>{data.count}개 판매</div>
                      </div>
                      <div className='text-right'>
                        <div className='font-semibold text-gray-900'>{formatCurrency(data.revenue)}</div>
                        <div className='text-sm text-gray-600'>
                          {todaySales.totalRevenue > 0 ? Math.round((data.revenue / todaySales.totalRevenue) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <div className='text-4xl mb-2'>📊</div>
                <p>오늘 판매된 메뉴가 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 인기 메뉴 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>⭐ 인기 메뉴 (오늘)</h2>
          </div>
          <div className='p-6'>
            {Object.keys(todaySales.itemSales).length > 0 ? (
              <div className='space-y-4'>
                {Object.entries(todaySales.itemSales)
                  .sort(([,a], [,b]) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map(([itemName, data]) => (
                    <div key={itemName} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <div className='flex-1'>
                        <div className='font-medium text-gray-900'>{itemName}</div>
                        <div className='text-sm text-gray-600'>{data.count}개 판매</div>
                      </div>
                      <div className='text-right'>
                        <div className='font-semibold text-gray-900'>{formatCurrency(data.revenue)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <div className='text-4xl mb-2'>🍽️</div>
                <p>오늘 판매된 메뉴가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 월간 추이 (간단한 차트 대신 텍스트로) */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>📈 월간 매출 추이</h2>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600 mb-2'>
                {formatCurrency(monthSales.totalRevenue)}
              </div>
              <div className='text-sm text-gray-600'>누적 매출</div>
              <div className='text-xs text-gray-500 mt-1'>
                {monthSales.totalOrders}건 주문
              </div>
            </div>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600 mb-2'>
                {monthSales.totalOrders > 0 ? Math.round(monthSales.totalRevenue / monthSales.totalOrders) : 0}원
              </div>
              <div className='text-sm text-gray-600'>평균 객단가</div>
              <div className='text-xs text-gray-500 mt-1'>
                이번 달 기준
              </div>
            </div>
            <div className='text-center p-4 bg-purple-50 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600 mb-2'>
                {Object.keys(monthSales.categorySales).length}
              </div>
              <div className='text-sm text-gray-600'>활성 카테고리</div>
              <div className='text-xs text-gray-500 mt-1'>
                판매된 카테고리 수
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
