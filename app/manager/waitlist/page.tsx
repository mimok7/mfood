import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function WaitlistPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()
  // TODO: Fetch waitlist data for the restaurant
  return (
    <section>
      <h2 style={{ fontSize: '18px', fontWeight: 600 }}>웨이팅 관리</h2>
      <p>웨이팅 신청/만료/호출을 관리합니다.</p>
    </section>
  )
}
