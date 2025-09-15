import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Route } from 'next'

export default async function Home() {
  const { user, role } = await getSession()

  if (!user) {
    redirect('/auth/sign-in' as Route)
  }

  if (role === 'admin') {
    redirect('/admin' as Route)
  }
  if (role === 'manager') {
    redirect('/manager' as Route)
  }

  // 기본값: 게스트 대시보드로 이동
  redirect('/guest' as Route)
}
