export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { cookies } from 'next/headers'
import LogoutButton from './LogoutButton'

export const metadata = {
  title: '관리자 패널 - Restaurant POS',
  description: '다중 식당 관리 시스템',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const selected = cookieStore.get('admin_restaurant_id')?.value ?? null
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* 관리자 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
            <div className="">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <a href="/admin" className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">👑</span>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-gray-900">관리자 패널</h1>
                      <p className="text-xs text-gray-500">다중 식당 관리 시스템</p>
                    </div>
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">🏠 메인</a>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </header>

          <div className="w-full py-8">
            {children}
          </div>
        </div>
      </>
  )
}
