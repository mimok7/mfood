import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function KitchenPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer() as any

  // 키친 큐에서 현재 진행 중인 주문 아이템들 가져오기
  const { data: kitchenItemsRaw, error } = await supabase
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
    .in('status', ['queued', 'prepping', 'ready'])
  .in('station', ['main','dessert'])
    .order('created_at', { ascending: true })

  const kitchenItems = (kitchenItemsRaw ?? []) as any[]

  if (error) {
    console.error('키친 큐 조회 오류:', error)
  }

  // 스테이션별/상태별 그룹화
  const itemsByStationStatus = (kitchenItems ?? []).reduce(
    (
      acc: Record<string, { queued: any[]; prepping: any[]; ready: any[] }>,
      item: any
    ) => {
      const station = item.station || 'main'
      if (!acc[station]) {
        acc[station] = { queued: [], prepping: [], ready: [] }
      }
      if (item.status === 'queued') acc[station].queued.push(item)
      else if (item.status === 'prepping') acc[station].prepping.push(item)
      else if (item.status === 'ready') acc[station].ready.push(item)
      return acc
    },
    {} as Record<string, { queued: any[]; prepping: any[]; ready: any[] }>
  )

  // 상태별 집계
  const queuedCount = kitchenItems?.filter(item => item.status === 'queued').length || 0
  const preppingCount = kitchenItems?.filter(item => item.status === 'prepping').length || 0
  const readyCount = kitchenItems?.filter(item => item.status === 'ready').length || 0

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'queued': return { text: '대기중', color: 'bg-yellow-100 text-yellow-800' }
      case 'prepping': return { text: '준비중', color: 'bg-blue-100 text-blue-800' }
      case 'ready': return { text: '준비완료', color: 'bg-green-100 text-green-800' }
      default: return { text: status, color: 'bg-gray-100 text-gray-800' }
    }
  }

  const getStationDisplay = (station: string) => {
    switch (station) {
      case 'main': return '🍽️ 메인'
      case 'bar': return '🍷 바'
      case 'dessert': return '🍰 디저트'
      default: return station
    }
  }

  async function startPrep(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    const supabase = createSupabaseServer() as any
    const { error: upErr } = await supabase
      .from('kitchen_queue')
      .update({ status: 'prepping' })
      .eq('id', id)
      .eq('restaurant_id', restaurant_id)
    if (upErr) {
      console.error('준비 시작 업데이트 실패:', upErr)
    }
    revalidatePath('/manager/kitchen')
  }

  async function completePrep(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    const supabase = createSupabaseServer() as any
    const { error: upErr } = await supabase
      .from('kitchen_queue')
      .update({ status: 'ready' })
      .eq('id', id)
      .eq('restaurant_id', restaurant_id)
    if (upErr) {
      console.error('준비 완료 업데이트 실패:', upErr)
    }
    revalidatePath('/manager/kitchen')
  }

  async function markServed(formData: FormData) {
    'use server'
    const id = String(formData.get('id') || '')
    if (!id) return
    const supabase = createSupabaseServer() as any
    const { error: upErr } = await supabase
      .from('kitchen_queue')
      .update({ status: 'served' })
      .eq('id', id)
      .eq('restaurant_id', restaurant_id)
    if (upErr) {
      console.error('서빙 완료 업데이트 실패:', upErr)
    }
    revalidatePath('/manager/kitchen')
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-lg relative'>
        <div className='absolute top-6 right-6'>
          <Link
            href="/manager"
            className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
          >
            <span className="mr-2">🏠</span>
            홈
          </Link>
        </div>

        <div className='flex w-full items-center'>
          <h1 className='text-3xl font-bold'>👨‍🍳 키친</h1>
          <div className='flex-1 flex items-center justify-center gap-2 text-sm'>
            <span className='px-3 py-1 rounded-full bg-yellow-300/90 text-yellow-900 font-semibold'>⏳ 대기중: {queuedCount}</span>
            <span className='px-3 py-1 rounded-full bg-blue-500/90 text-white font-semibold'>🧑‍🍳 준비중: {preppingCount}</span>
            <span className='px-3 py-1 rounded-full bg-green-500/90 text-white font-semibold'>✅ 준비완료: {readyCount}</span>
          </div>
        </div>

        <p className='text-left text-yellow-100 mt-2'>주문 항목 진행 상태를 실시간으로 확인</p>
      </div>

      {/* 스테이션별 주문 목록 */}
  <div className='grid grid-cols-1 gap-6'>
        {Object.entries(itemsByStationStatus).map(([station, groups]) => (
          <div key={station} className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 flex items-center justify-between'>
                <span>{getStationDisplay(station)}</span>
                <span className='text-sm text-gray-500'>(총 {groups.queued.length + groups.prepping.length + groups.ready.length}개)</span>
              </h2>
            </div>

            {/* 상태 섹션을 한 행(3컬럼)으로 배치 */}
            <div className='p-4'>
              <div className='grid grid-cols-3 gap-4'>
                {/* 대기중 */}
                <div>
                  <h3 className='text-sm font-semibold text-gray-700 mb-2'>⏳ 대기중 ({groups.queued.length})</h3>
                  <div className='space-y-3 max-h-80 overflow-y-auto'>
                    {groups.queued.length > 0 ? (
                      groups.queued.map((item) => {
                        const statusInfo = getStatusDisplay(item.status)
                        const orderItem = item.order_items
                        const menuItem = orderItem?.menu_items
                        const order = orderItem?.orders
                        const table = order?.tables

                        return (
                          <div
                            key={item.id}
                            className='border rounded-lg p-4 bg-white hover:shadow-md transition-shadow'
                          >
                            {/* 주문 정보 헤더 */}
                            <div className='flex items-center justify-between mb-3'>
                              <div className='flex items-center gap-2 text-sm text-gray-700'>
                                <span className='font-medium'>🪑 {table?.name || '테이블 정보 없음'}</span>
                                <span className='text-gray-500'>
                                  {new Date(item.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <span className='text-sm font-medium text-gray-700'>
                                {statusInfo.text}
                              </span>
                            </div>

                            {/* 메뉴 정보 */}
                            <div className='space-y-2'>
                              <h3 className='text-lg font-semibold text-gray-900'>
                                {menuItem?.name || '메뉴 정보 없음'} × {orderItem?.qty || 1}
                              </h3>
                              {orderItem?.note && (
                                <div className='bg-yellow-50 border border-yellow-200 rounded p-2'>
                                  <p className='text-sm text-yellow-800'>
                                    📝 {orderItem.note}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* 액션 버튼들 */}
                            <div className='flex gap-2 mt-3 justify-end'>
                              <form action={startPrep}>
                                <input type='hidden' name='id' value={item.id} />
                                <button className='bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition-colors'>
                                  준비 시작
                                </button>
                              </form>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className='text-center py-6 text-gray-500'>
                        <div className='text-3xl mb-1'>🍽️</div>
                        <p>대기중 항목이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 조리중 */}
                <div>
                  <h3 className='text-sm font-semibold text-gray-700 mb-2'>🧑‍🍳 조리중 ({groups.prepping.length})</h3>
                  <div className='space-y-3 max-h-80 overflow-y-auto'>
                    {groups.prepping.length > 0 ? (
                      groups.prepping.map((item) => {
                        const statusInfo = getStatusDisplay(item.status)
                        const orderItem = item.order_items
                        const menuItem = orderItem?.menu_items
                        const order = orderItem?.orders
                        const table = order?.tables

                        return (
                          <div
                            key={item.id}
                            className='border rounded-lg p-4 bg-white hover:shadow-md transition-shadow'
                          >
                            {/* 주문 정보 헤더 */}
                            <div className='flex items-center justify-between mb-3'>
                              <div className='flex items-center gap-2 text-sm text-gray-700'>
                                <span className='font-medium'>🪑 {table?.name || '테이블 정보 없음'}</span>
                                <span className='text-gray-500'>
                                  {new Date(item.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <span className='text-sm font-medium text-gray-700'>
                                {statusInfo.text}
                              </span>
                            </div>

                            {/* 메뉴 정보 */}
                            <div className='space-y-2'>
                              <h3 className='text-lg font-semibold text-gray-900'>
                                {menuItem?.name || '메뉴 정보 없음'} × {orderItem?.qty || 1}
                              </h3>
                              {orderItem?.note && (
                                <div className='bg-yellow-50 border border-yellow-200 rounded p-2'>
                                  <p className='text-sm text-yellow-800'>
                                    📝 {orderItem.note}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* 액션 버튼들 */}
                            <div className='flex gap-2 mt-3 justify-end'>
                              <form action={completePrep}>
                                <input type='hidden' name='id' value={item.id} />
                                <button className='bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700 transition-colors'>
                                  준비 완료
                                </button>
                              </form>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className='text-center py-6 text-gray-500'>
                        <div className='text-3xl mb-1'>👨‍🍳</div>
                        <p>현재 조리중인 항목이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 준비완료 */}
                <div>
                  <h3 className='text-sm font-semibold text-gray-700 mb-2'>✅ 준비완료 ({groups.ready.length})</h3>
                  <div className='space-y-3 max-h-80 overflow-y-auto'>
                    {groups.ready.length > 0 ? (
                      groups.ready.map((item) => {
                        const statusInfo = getStatusDisplay(item.status)
                        const orderItem = item.order_items
                        const menuItem = orderItem?.menu_items
                        const order = orderItem?.orders
                        const table = order?.tables

                        return (
                          <div
                            key={item.id}
                            className='border rounded-lg p-4 bg-white hover:shadow-md transition-shadow'
                          >
                            {/* 주문 정보 헤더 */}
                            <div className='flex items-center justify-between mb-3'>
                              <div className='flex items-center gap-2 text-sm text-gray-700'>
                                <span className='font-medium'>🪑 {table?.name || '테이블 정보 없음'}</span>
                                <span className='text-gray-500'>
                                  {new Date(item.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <span className='text-sm font-medium text-gray-700'>
                                {statusInfo.text}
                              </span>
                            </div>

                            {/* 메뉴 정보 */}
                            <div className='space-y-2'>
                              <h3 className='text-lg font-semibold text-gray-900'>
                                {menuItem?.name || '메뉴 정보 없음'} × {orderItem?.qty || 1}
                              </h3>
                              {orderItem?.note && (
                                <div className='bg-yellow-50 border border-yellow-200 rounded p-2'>
                                  <p className='text-sm text-yellow-800'>
                                    📝 {orderItem.note}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* 액션 버튼들 */}
                            <div className='flex gap-2 mt-3 justify-end'>
                              <form action={markServed}>
                                <input type='hidden' name='id' value={item.id} />
                                <button className='bg-purple-600 text-white text-sm py-2 px-3 rounded hover:bg-purple-700 transition-colors'>
                                  서빙 완료
                                </button>
                              </form>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className='text-center py-6 text-gray-500'>
                        <div className='text-3xl mb-1'>✅</div>
                        <p>준비 완료된 항목이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 진행 중인 주문이 없을 때 */}
  {Object.keys(itemsByStationStatus).length === 0 && (
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>👨‍🍳</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>준비할 주문이 없습니다</h3>
            <p className='text-gray-500'>새로운 주문이 들어오면 여기에 표시됩니다.</p>
          </div>
        </div>
      )}

      {/* 요약 정보는 헤더로 이동 */}
    </div>
  )
}
