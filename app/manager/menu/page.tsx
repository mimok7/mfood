import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function ManagerMenuPage() {
  await requireRole('manager')
  const supabase = createSupabaseServer()
  const { data: items } = await supabase.from('menu_items').select('id,name,price,category').limit(200)

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
