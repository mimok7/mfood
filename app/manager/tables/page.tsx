import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import TablesClient from './TablesClient'

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

  // 테이블 정보 가져오기
  const { data: tables, error: tablesError } = await supabaseAdmin()
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurant_id)
    .order('name', { ascending: true })

  // 현재 활성 주문들 가져오기
  const { data: activeOrders, error: ordersError } = await supabaseAdmin()
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

  return (
    <TablesClient
      initialTables={tables || []}
      initialOrders={activeOrders as any || []}
    />
  )
}