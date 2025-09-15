import { requireRole } from '@/lib/auth'

export default async function ServingPage() {
  await requireRole('manager')
  return (
    <section>
      <h2 style={{fontSize:'18px', fontWeight:600}}>서빙 보드</h2>
      <p>서빙 대기/완료 상태를 표시합니다. (추후 bulk-serve 연동)</p>
    </section>
  )
}
