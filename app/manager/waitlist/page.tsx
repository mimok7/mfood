import { requireRole } from '@/lib/auth'

export default async function WaitlistPage() {
  await requireRole('manager')
  return (
    <section>
      <h2 style={{fontSize:'18px', fontWeight:600}}>웨이팅 관리</h2>
      <p>웨이팅 신청/만료/호출을 관리합니다.</p>
    </section>
  )
}
