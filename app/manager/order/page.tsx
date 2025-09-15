export const dynamic = 'force-dynamic'
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function ManagerOrderPage() {
  const { restaurant_id } = await requireRole('manager')
  if (!restaurant_id) {
    return <p>소속된 레스토랑이 없습니다.</p>
  }
  const supabase = createSupabaseServer()
  const { data: tables } = await supabase
    .from('tables')
    .select('id,name')
    .eq('restaurant_id', restaurant_id)
    .limit(50)

  return (
    <section>
      <h2 style={{fontSize:'18px', fontWeight:600}}>주문 관리</h2>
      <p>테이블을 선택하세요.</p>
      <ul>
        {(tables ?? []).map(t => (<li key={t.id}>{t.name}</li>))}
      </ul>
    </section>
  )
}
