export const metadata = {
  title: '매니저 콘솔 - Restaurant POS',
  description: '매장 운영 전용 화면',
}

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex">
          {/* 좌측 네비게이션 */}
          <aside className="w-56 bg-white border-r border-gray-200 p-4">
            <div className="mb-4">
              <h1 className="text-lg font-bold">🏬 매니저</h1>
              <p className="text-xs text-gray-500">운영 전용</p>
            </div>
            <nav className="space-y-2 text-sm">
              <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager">대시보드</a>
              <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/menu">메뉴</a>
              <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/order">주문</a>
              <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/kitchen">주방</a>
              <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/serving">서빙</a>
              <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/waitlist">대기</a>
              <a className="block px-3 py-2 rounded hover:bg-gray-100" href="/manager/reports/sales">매출 리포트</a>
            </nav>
          </aside>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
