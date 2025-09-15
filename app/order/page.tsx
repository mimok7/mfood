export const dynamic = 'force-dynamic'
import { createSupabaseServer } from '@/lib/supabase-server'
import { requireRole } from '@/lib/auth'

export default async function OrderPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()
  const { data: tables } = await supabase
    .from('tables')
    .select('id,name')
    .eq('restaurant_id', restaurant_id)
    .limit(50)

  return (
    <section>
      <h2 style={{ fontSize: '18px', fontWeight: 600 }}>주문 시작</h2>
      <p>테이블을 선택하세요.</p>
      <ul>
        {(tables ?? []).map(t => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </section>
  )
}
