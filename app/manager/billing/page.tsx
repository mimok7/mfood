import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BillingPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()

  // 테이블별로 묶기 위해 orders + tables + order_items를 조회합니다.
  // 결제 페이지 특성상 취소된 주문은 제외합니다.
  // 1차 시도: 미결제만 필터 (is_paid 컬럼이 존재하지 않을 경우 오류 → 2차 시도로 폴백)
  let orders: any[] | null = null
  let error: any = null
  {
    const res = await supabase
      .from('orders')
      .select(`
        id,
        table_id,
        status,
        created_at,
        is_paid,
        paid_at,
        tables!inner (
          id,
          name
        ),
        order_items (
          id,
          qty,
          price,
          menu_items!inner (
            id,
            name
          )
        )
      `)
      .eq('tables.restaurant_id', restaurant_id)
      .neq('status', 'cancelled')
      .eq('is_paid', false)
      .order('created_at', { ascending: false })
    orders = res.data
    error = res.error
  }

  if (error) {
    // 컬럼 미적용 등으로 실패 시, 혼동을 막기 위해 빈 목록을 표시합니다.
    orders = []
  }

  // 안전장치: 혹시라도 잘못된 결과가 포함될 수 있으므로, 미결제 배열에서 유료건을 제거
  if (orders) {
    orders = orders.filter((o: any) => o?.is_paid === false || (!('is_paid' in o) && !o?.paid_at))
  }

  // 데이터가 0건이면 최근 주문(24시간)이라도 보여주도록 폴백
  if (!error && (!orders || orders.length === 0)) {
    const res3 = await supabase
      .from('orders')
      .select(`
        id,
        table_id,
        status,
        created_at,
        tables!inner (
          id,
          name
        ),
        order_items (
          id,
          qty,
          price,
          menu_items!inner (
            id,
            name
          )
        )
      `)
      .eq('tables.restaurant_id', restaurant_id)
      .neq('status', 'cancelled')
      .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString())
      .order('created_at', { ascending: false })
    if (!res3.error) {
      orders = res3.data
    }
  }

  // 결제 완료된 주문(오늘) 조회
  let paidOrders: any[] | null = null
  {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0)
    const res = await supabase
      .from('orders')
      .select(`
        id,
        table_id,
        status,
        created_at,
        paid_at,
        is_paid,
        tables!inner (
          id,
          name
        ),
        order_items (
          id,
          qty,
          price,
          menu_items!inner (
            id,
            name
          )
        )
      `)
      .eq('tables.restaurant_id', restaurant_id)
      .eq('is_paid', true)
      .gte('paid_at', startOfDay.toISOString())
      .order('paid_at', { ascending: false })
    paidOrders = res.data || []
  }

  // 안전장치: 결제완료 배열은 paid_at이 있거나 is_paid가 true인 건만 포함
  paidOrders = (paidOrders || []).filter((o: any) => o?.is_paid === true || !!o?.paid_at)

  // 최종 가드: 같은 주문이 양쪽에 동시에 뜨지 않도록, paid에 포함된 주문 ID는 unpaid에서 제거
  const paidIds = new Set((paidOrders || []).map((o: any) => o.id))
  if (orders) {
    orders = orders.filter((o: any) => !paidIds.has(o.id))
  }

  // 그룹핑: table_id 기준으로 묶고, 테이블명/총액을 계산
  type Group = { tableId: string, tableName: string, orders: any[], totalAmount: number }
  const groupsMap = new Map<string, Group>()
  if (orders) {
    for (const o of orders) {
      const tableObj = Array.isArray(o.tables) ? o.tables[0] : o.tables
      const tableId = o.table_id || tableObj?.id
      const tableName = tableObj?.name || '미지정'
      const amount = (o.order_items || []).reduce((sum: number, it: any) => sum + it.price * it.qty, 0)
      if (!tableId) continue
      const prev = groupsMap.get(tableId)
      if (!prev) {
        groupsMap.set(tableId, { tableId, tableName, orders: [o], totalAmount: amount })
      } else {
        prev.orders.push(o)
        prev.totalAmount += amount
      }
    }
  }
  const groups = Array.from(groupsMap.values()).sort((a, b) => a.tableName.localeCompare(b.tableName, 'ko'))

  // 결제 완료 그룹핑
  const paidGroupsMap = new Map<string, Group>()
  if (paidOrders) {
    for (const o of paidOrders) {
      const tableObj = Array.isArray(o.tables) ? o.tables[0] : o.tables
      const tableId = o.table_id || tableObj?.id
      const tableName = tableObj?.name || '미지정'
      const amount = (o.order_items || []).reduce((sum: number, it: any) => sum + it.price * it.qty, 0)
      if (!tableId) continue
      const prev = paidGroupsMap.get(tableId)
      if (!prev) {
        paidGroupsMap.set(tableId, { tableId, tableName, orders: [o], totalAmount: amount })
      } else {
        prev.orders.push(o)
        prev.totalAmount += amount
      }
    }
  }
  const paidGroups = Array.from(paidGroupsMap.values()).sort((a, b) => a.tableName.localeCompare(b.tableName, 'ko'))

  // 결제 처리 서버 액션: 해당 테이블의 미결제 주문들을 결제 완료로 마킹
  async function settleTable(formData: FormData) {
    'use server'
    const tableId = String(formData.get('tableId') || '')
    if (!tableId) return
    const { restaurant_id } = await requireRole('manager')
    const admin = supabaseAdmin()
    const { error } = await admin
      .from('orders')
      .update({ is_paid: true, paid_at: new Date().toISOString() })
      .eq('table_id', tableId)
      .eq('restaurant_id', restaurant_id)
      .eq('is_paid', false)
      .neq('status', 'cancelled')

    if (error) {
      console.error('결제 처리 오류:', error)
    }

    // 테이블 사용 가능으로 변경 (is_available 컬럼이 있을 경우)
    try {
      await admin
        .from('tables')
        .update({ is_available: true })
        .eq('id', tableId)
        .eq('restaurant_id', restaurant_id)
    } catch (e) {
      console.warn('테이블 상태 업데이트 건너뜀(컬럼 미존재 가능):', e)
    }
    revalidatePath('/manager/billing')
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 */}
      <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>💳 계산 관리</h1>
            <p className='text-red-100'>테이블별 주문 합계 및 결제 처리</p>
          </div>
          <Link
            href="/manager"
            className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
          >
            <span className="mr-2">🏠</span>
            홈
          </Link>
        </div>
      </div>

      {/* 테이블별 주문 목록 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>🧾</span>
            테이블별 주문
          </h2>
          <p className='text-sm text-gray-600 mt-1'>들어온 주문을 테이블 단위로 묶어서 표시합니다</p>
        </div>
        <div className='p-6'>
          {groups.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {groups.map((g) => (
                <div key={g.tableId} className='border border-gray-200 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <div>
                      <div className='text-lg font-semibold'>{g.tableName}</div>
                      <div className='text-sm text-gray-600'>주문 {g.orders.length}건</div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xl font-bold text-green-600'>₩{g.totalAmount.toLocaleString()}</div>
                      <form action={settleTable} className='mt-2'>
                        <input type='hidden' name='tableId' value={g.tableId} />
                        <button type='submit' className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
                          결제 처리
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    {g.orders.map((o) => {
                      const amount = (o.order_items || []).reduce((s: number, it: any) => s + it.price * it.qty, 0)
                      return (
                        <div key={o.id} className='bg-gray-50 p-3 rounded'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <div className='text-sm text-gray-600'>{new Date(o.created_at).toLocaleString('ko-KR')}</div>
                            </div>
                            <div className='text-right font-semibold'>₩{amount.toLocaleString()}</div>
                          </div>
                          <div className='mt-2 space-y-1'>
                            {(o.order_items || []).map((it: any) => {
                              const menuObj = Array.isArray(it.menu_items) ? it.menu_items[0] : it.menu_items
                              return (
                              <div key={it.id} className='flex items-start justify-between text-sm'>
                                <div className='pr-2'>
                                  <span className='font-medium'>{menuObj?.name || '메뉴'}</span>
                                  <span className='text-gray-600'> × {it.qty}</span>
                                  {it.note && (
                                    <span className='ml-2 text-gray-500'>({it.note})</span>
                                  )}
                                </div>
                                <div className='text-right whitespace-nowrap'>₩{(it.price * it.qty).toLocaleString()}</div>
                              </div>
                            )})}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <div className='text-4xl mb-2'>💳</div>
              <p>표시할 주문이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 결제 완료 내역 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>✅</span>
            결제 완료
          </h2>
          <p className='text-sm text-gray-600 mt-1'>오늘 결제 완료된 주문들</p>
        </div>
        <div className='p-6'>
          {paidGroups.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {paidGroups.map((g) => (
                <div key={g.tableId} className='border border-gray-200 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <div>
                      <div className='text-lg font-semibold'>{g.tableName}</div>
                      <div className='text-sm text-gray-600'>결제 {g.orders.length}건</div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xl font-bold text-green-600'>₩{g.totalAmount.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    {g.orders.map((o) => {
                      const amount = (o.order_items || []).reduce((s: number, it: any) => s + it.price * it.qty, 0)
                      return (
                        <div key={o.id} className='bg-gray-50 p-3 rounded'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <div className='text-sm text-gray-600'>결제시간: {new Date(o.paid_at || o.created_at).toLocaleString('ko-KR')}</div>
                            </div>
                            <div className='text-right font-semibold'>₩{amount.toLocaleString()}</div>
                          </div>
                          <div className='mt-2 space-y-1'>
                            {(o.order_items || []).map((it: any) => {
                              const menuObj = Array.isArray(it.menu_items) ? it.menu_items[0] : it.menu_items
                              return (
                                <div key={it.id} className='flex items-start justify-between text-sm'>
                                  <div className='pr-2'>
                                    <span className='font-medium'>{menuObj?.name || '메뉴'}</span>
                                    <span className='text-gray-600'> × {it.qty}</span>
                                  </div>
                                  <div className='text-right whitespace-nowrap'>₩{(it.price * it.qty).toLocaleString()}</div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <div className='text-4xl mb-2'>📊</div>
              <p>오늘 결제 완료된 주문이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}