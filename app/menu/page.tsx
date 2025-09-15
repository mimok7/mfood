export const dynamic = 'force-dynamic'
import { createSupabaseServer } from '@/lib/supabase-server'
import { requireRole } from '@/lib/auth'

export default async function MenuPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()
  const { data: items } = await supabase
    .from('menu_items')
    .select('id,name,price,category')
    .eq('restaurant_id', restaurant_id)
    .limit(200)

  return (
    <section>
      <h2 style={{ fontSize: '18px', fontWeight: 600 }}>메뉴</h2>
      <ul style={{ marginTop: 12 }}>
        {(items ?? []).map(i => (
          <li key={i.id}>
            {i.name} - {i.price}원
          </li>
        ))}
      </ul>
    </section>
  )
}
