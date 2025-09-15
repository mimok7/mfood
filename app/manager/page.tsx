import { requireRole } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function ManagerPage() {
  await requireRole('manager')

  return (
    <section>
      <h2 style={{fontSize:'18px', fontWeight:600}}>매니저</h2>
      <p style={{marginTop:8}}>식당 관리 기능(메뉴/테이블/주문 관리 등)이 들어갈 자리입니다.</p>
    </section>
  )
}
