import { requireRole } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireRole('admin')

  return (
    <section>
      <h2 style={{fontSize:'18px', fontWeight:600}}>관리자</h2>
      <p style={{marginTop:8}}>식당 생성/사용자 생성 같은 상위 관리 작업이 들어갈 자리입니다.</p>
    </section>
  )
}
