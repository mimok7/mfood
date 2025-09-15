export const dynamic = 'force-dynamic'
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function ManagerMenuPage() {
  const { restaurant_id } = await requireRole('manager')
  if (!restaurant_id) {
    return <p>소속된 레스토랑이 없습니다.</p>
  }
  const supabase = createSupabaseServer()
  const { data: items } = await supabase
    .from('menu_items')
    .select('id,name,price,category')
    .eq('restaurant_id', restaurant_id)
    .limit(200)

  return (
    <section>
      <h2 style={{fontSize:'18px', fontWeight:600}}>메뉴 관리</h2>
      <ul style={{marginTop:12}}>
        {(items ?? []).map(i => (
          <li key={i.id}>{i.name} - {i.price}원</li>
        ))}
      </ul>
    </section>
  )
}
