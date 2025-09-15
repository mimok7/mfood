import '../styles/globals.css'

export const metadata = {
  title: 'Restaurant POS',
  description: '매장 운영 통합 패널',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* 사이드 네비게이션 (food 스타일) */}
          <nav className="w-56 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">🍽️ Restaurant POS</h1>
              <p className="text-sm text-gray-500 mt-1">통합 관리 시스템</p>
            </div>
            <div className="flex-1 p-4">
              <div className="space-y-2 text-sm">
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/">대시보드</a>
                {/* 매니저 네비 순서: menu → order → kitchen → serving → waitlist → reports/sales */}
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/menu">메뉴 관리</a>
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/order">주문 관리</a>
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/kitchen">주방 관리</a>
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/serving">서빙 관리</a>
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/waitlist">대기 관리</a>
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/reports/sales">매출 리포트</a>
                <hr className="my-2" />
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/admin">관리자</a>
                <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/guest">게스트</a>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500">© 2025 Restaurant POS</div>
          </nav>

          {/* 메인 컨텐츠 영역 */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">POS 시스템</h2>
                  <p className="text-sm text-gray-500">실시간 운영 및 모니터링</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
                  })}
                </div>
              </div>
            </header>
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
