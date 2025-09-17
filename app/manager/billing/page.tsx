import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function BillingPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()

  // 결제 대기 중인 주문들 가져오기
  const { data: pendingPayments } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      tables (
        name
      )
    `)
    .eq('restaurant_id', restaurant_id)
    .in('status', ['served', 'ready'])
    .order('created_at', { ascending: false })

  return (
    <div className='space-y-6'>
      {/* 헤더 */}
      <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2'>💳 계산 관리</h1>
        <p className='text-red-100'>결제 처리 및 계산서 관리</p>
      </div>

      {/* 결제 대기 목록 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>⏳</span>
            결제 대기
          </h2>
          <p className='text-sm text-gray-600 mt-1'>결제 대기 중인 주문들</p>
        </div>
        <div className='p-6'>
          {pendingPayments && pendingPayments.length > 0 ? (
            <div className='space-y-4'>
              {pendingPayments.map((order: any) => (
                <div key={order.id} className='border border-gray-200 rounded-lg p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='font-semibold'>주문 #{order.id.slice(-8)}</div>
                      <div className='text-sm text-gray-600'>
                        테이블: {order.tables?.name || 'N/A'} | {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-green-600'>
                        ₩{order.total_amount?.toLocaleString() || '0'}
                      </div>
                      <button className='mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
                        결제 처리
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <div className='text-4xl mb-2'>💳</div>
              <p>결제 대기 중인 주문이 없습니다</p>
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
          <div className='text-center py-8 text-gray-500'>
            <div className='text-4xl mb-2'>📊</div>
            <p>결제 완료 내역이 여기에 표시됩니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}