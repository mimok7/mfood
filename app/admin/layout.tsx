import Link from 'next/link'

export const metadata = {
  title: '관리자 패널 - Restaurant POS',
  description: '다중 식당 관리 시스템',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* 관리자 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                </div>
              </div>
            </div>
          </header>

          <div className="flex">
            {/* 사이드바 네비게이션 */}
            <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-4rem)]">
              <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">관리 메뉴</h2>
                <div className="space-y-1">
                  <a href="/admin" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">📊 대시보드</a>
                  <div className="pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">식당 관리</h3>
                    <a href="/admin/restaurants" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">🏪 레스토랑 설정</a>
                    <a href="/admin/restaurants/switch" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">🔄 레스토랑 전환</a>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">사용자 관리</h3>
                    <a href="/admin/restaurants" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">👥 사용자 관리(식당별)</a>
                    <a href="/admin/restaurants" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">🔐 권한 관리</a>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">시스템</h3>
                    <a href="/admin/settings" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">⚙️ 시스템 설정</a>
                    <a href="/admin/logs" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">🗂️ 시스템 로그</a>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">보고서</h3>
                    <a href="/admin/reports/sales" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">💰 매출 보고서</a>
                    <a href="/admin/reports/orders" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">📋 주문 보고서</a>
                  </div>
                </div>
              </div>
            </nav>

            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </>
  )
}
