import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function KitchenPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()
  // TODO: Fetch kitchen data for the restaurant
  return (
    <section>
      <h2 style={{ fontSize: '18px', fontWeight: 600 }}>키친 보드</h2>
      <p>주문 항목의 진행 상태를 표시합니다. (추후 KDS 컴포넌트 연동)</p>
    </section>
  )
}
