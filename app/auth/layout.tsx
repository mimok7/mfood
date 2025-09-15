import { getSession } from '../../lib/auth'
import { redirect } from 'next/navigation'
import type { Route } from 'next'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = await getSession()

  if (user) {
    if (role === 'admin') {
      redirect('/admin' as Route)
    } else if (role === 'manager') {
      redirect('/manager' as Route)
    } else {
      redirect('/' as Route)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md mx-auto">{children}</div>
    </main>
  )
}
