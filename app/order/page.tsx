import { createSupabaseServer } from '@/lib/supabase-server'

export default async function OrderPage() {
  const supabase = createSupabaseServer()
  const { data: tables } = await supabase.from('tables').select('id,name').limit(50)

  return (
    <section>
      <h2 style={{fontSize:'18px', fontWeight:600}}>주문 시작</h2>
      <p>테이블을 선택하세요.</p>
      <ul>
        {(tables ?? []).map(t => (<li key={t.id}>{t.name}</li>))}
      </ul>
    </section>
  )
}
