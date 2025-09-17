import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function ServingPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()

  // 서버 액션: 서빙 완료 처리
  async function markServed(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    const sb = createSupabaseServer()
    const { error } = await sb
      .from('kitchen_queue')
      .update({ status: 'served' })
      .eq('id', id)
      .eq('restaurant_id', restaurant_id)
    if (error) {
      console.error('서빙 완료 업데이트 실패:', error)
    }
    revalidatePath('/manager/serving')
  }

  // kitchen_queue에서 ready/served 모두 조회 후 분류
  const { data: itemsRaw, error } = await supabase
    .from('kitchen_queue')
    .select(`
      id,
      station,
      status,
      created_at,
      order_item_id,
      order_items (
        id,
        qty,
        note,
        menu_items (
          id,
          name
        ),
        orders (
          id,
          table_id,
          tables (
            name
          )
        )
      )
    `)
    .eq('restaurant_id', restaurant_id)
    .in('status', ['ready','served'])
    .order('created_at', { ascending: true })

  if (error) {
    console.error('서빙 페이지 조회 오류:', error)
  }

  const items = (itemsRaw ?? []) as any[]
  const readyItems = items.filter(i => i.status === 'ready')
  const servedItems = items.filter(i => i.status === 'served')

  const mealsReady = readyItems.filter(i => (i.station || 'main') === 'main' || (i.station || '') === 'dessert')
  const drinksReady = readyItems.filter(i => (i.station || 'main') === 'bar')

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

      {/* 3개 카드: 식사/안주, 주류/음료, 서빙완료 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* 식사/안주 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900 flex items-center justify-between'>
              <span>🍽️ 식사/안주</span>
              <span className='text-sm text-gray-500'>({mealsReady.length}개)</span>
            </h2>
          </div>
          <div className='p-4 space-y-3 max-h-96 overflow-y-auto'>
            {mealsReady.length > 0 ? (
              mealsReady.map((item) => {
                const orderItem = item.order_items
                const menuItem = orderItem?.menu_items
                const table = orderItem?.orders?.tables
                return (
                  <div key={item.id} className='border rounded-lg p-4 bg-white hover:shadow-md transition-shadow'>
                    <div className='flex items-center justify-between mb-2 text-sm text-gray-700'>
                      <span className='font-medium'>🪑 {table?.name || '테이블 정보 없음'}</span>
                      <span className='text-gray-500'>{new Date(item.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className='space-y-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {menuItem?.name || '메뉴 정보 없음'} × {orderItem?.qty || 1}
                      </h3>
                      {orderItem?.note && (
                        <div className='bg-yellow-50 border border-yellow-200 rounded p-2'>
                          <p className='text-sm text-yellow-800'>📝 {orderItem.note}</p>
                        </div>
                      )}
                    </div>
                    <div className='flex gap-2 mt-3 justify-end'>
                      <form action={markServed}>
                        <input type='hidden' name='id' value={item.id} />
                        <button className='bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700 transition-colors'>서빙 완료</button>
                      </form>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <div className='text-4xl mb-2'>🍽️</div>
                <p>서빙할 식사/안주가 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 주류/음료 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900 flex items-center justify-between'>
              <span>🍷 주류/음료</span>
              <span className='text-sm text-gray-500'>({drinksReady.length}개)</span>
            </h2>
          </div>
          <div className='p-4 space-y-3 max-h-96 overflow-y-auto'>
            {drinksReady.length > 0 ? (
              drinksReady.map((item) => {
                const orderItem = item.order_items
                const menuItem = orderItem?.menu_items
                const table = orderItem?.orders?.tables
                return (
                  <div key={item.id} className='border rounded-lg p-4 bg-white hover:shadow-md transition-shadow'>
                    <div className='flex items-center justify-between mb-2 text-sm text-gray-700'>
                      <span className='font-medium'>🪑 {table?.name || '테이블 정보 없음'}</span>
                      <span className='text-gray-500'>{new Date(item.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className='space-y-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {menuItem?.name || '메뉴 정보 없음'} × {orderItem?.qty || 1}
                      </h3>
                      {orderItem?.note && (
                        <div className='bg-yellow-50 border border-yellow-200 rounded p-2'>
                          <p className='text-sm text-yellow-800'>📝 {orderItem.note}</p>
                        </div>
                      )}
                    </div>
                    <div className='flex gap-2 mt-3 justify-end'>
                      <form action={markServed}>
                        <input type='hidden' name='id' value={item.id} />
                        <button className='bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700 transition-colors'>서빙 완료</button>
                      </form>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <div className='text-4xl mb-2'>🥂</div>
                <p>서빙할 주류/음료가 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 서빙완료 */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900 flex items-center justify-between'>
              <span>✅ 서빙완료</span>
              <span className='text-sm text-gray-500'>({servedItems.length}개)</span>
            </h2>
          </div>
          <div className='p-4 space-y-3 max-h-96 overflow-y-auto'>
            {servedItems.length > 0 ? (
              servedItems.map((item) => {
                const orderItem = item.order_items
                const menuItem = orderItem?.menu_items
                const table = orderItem?.orders?.tables
                return (
                  <div key={item.id} className='border rounded-lg p-4 bg-white hover:shadow-md transition-shadow'>
                    <div className='flex items-center justify-between mb-2 text-sm text-gray-700'>
                      <span className='font-medium'>🪑 {table?.name || '테이블 정보 없음'}</span>
                      <span className='text-gray-500'>{new Date(item.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className='space-y-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {menuItem?.name || '메뉴 정보 없음'} × {orderItem?.qty || 1}
                      </h3>
                      {orderItem?.note && (
                        <div className='bg-yellow-50 border border-yellow-200 rounded p-2'>
                          <p className='text-sm text-yellow-800'>📝 {orderItem.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <div className='text-4xl mb-2'>✅</div>
                <p>서빙 완료된 항목이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모두 비었을 때 */}
      {mealsReady.length === 0 && drinksReady.length === 0 && servedItems.length === 0 && (
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>🍽️</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>표시할 항목이 없습니다</h3>
            <p className='text-gray-500'>준비 완료 또는 서빙 완료된 항목이 여기 표시됩니다.</p>
          </div>
        </div>
      )}
    </div>
  )
}
