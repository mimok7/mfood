import { requireRole } from '@/lib/auth'

export default async function SalesReportPage() {
  await requireRole('manager')
  return (
    <section>
      <h2 style={{fontSize:'18px', fontWeight:600}}>매출 리포트</h2>
      <p>기간/분류별 매출 요약을 확인합니다.</p>
    </section>
  )
}
