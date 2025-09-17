import Link from 'next/link'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-orange-600">m</span>food
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/#features" className="text-orange-600 font-medium">기능</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">요금</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">문의</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/sign-in" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                로그인
              </Link>
              <Link 
                href="/guest" 
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                QR 주문하기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-orange-50 to-red-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            mfood의 <span className="text-orange-600">핵심 기능</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            레스토랑 운영의 모든 과정을 디지털화하여 효율성을 극대화하고 
            고객 만족도를 높이는 스마트 솔루션을 제공합니다.
          </p>
        </div>
      </section>

      {/* QR 주문 시스템 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">QR 코드 주문</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  테이블에 설치된 QR 코드를 스캔하면 즉시 메뉴를 확인하고 주문할 수 있습니다. 
                  접촉 없는 안전한 주문 방식으로 코로나19 이후 필수가 된 언택트 서비스를 제공합니다.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>테이블별 고유 QR 코드로 정확한 주문 처리</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>실시간 메뉴 업데이트 및 가격 변경</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>추가 요청사항 및 특별 지시 입력 가능</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>다국어 지원으로 외국인 고객도 편리하게 이용</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-red-200 rounded-xl p-8 text-center">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="w-32 h-32 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v2H7V7zm0 3h2v2H7v-2zm0 3h2v2H7v-2zm3-6h2v2h-2V7zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2zm3-6h2v2h-2V7zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2zm3-6h2v2h-2V7zm0 3h2v2h-2v-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">테이블 3번</h3>
                <p className="text-gray-600 mb-4">QR 코드를 스캔하여 주문하세요</p>
                <div className="text-sm text-gray-500">
                  📱 스마트폰으로 스캔 → 🍽️ 메뉴 선택 → ✅ 주문 완료
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 스마트 키친 관리 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-green-100 rounded-xl p-8">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">키친 대시보드</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">🍕 마르게리타 피자 x2</span>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">조리중</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">🥗 시저 샐러드 x1</span>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">대기중</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">🍝 까르보나라 x1</span>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">완료</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-green-600 text-white py-2 rounded text-sm">완료</button>
                    <button className="flex-1 bg-red-600 text-white py-2 rounded text-sm">취소</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">스마트 키친 관리</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  실시간으로 들어오는 주문을 효율적으로 관리하고, 조리 상태를 추적할 수 있습니다. 
                  스테이션별 업무 분배로 키친 운영을 최적화합니다.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>메인/바/디저트 스테이션별 주문 자동 분배</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>대기 → 조리중 → 완료 → 서빙 상태 관리</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>우선순위 표시 및 특급 주문 하이라이트</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>조리 시간 측정 및 성과 분석</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 매출 분석 및 리포트 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">매출 분석 & 리포트</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  실시간 매출 현황부터 상세한 분석 리포트까지, 데이터 기반의 경영 의사결정을 
                  지원하는 강력한 분석 도구를 제공합니다.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>실시간 매출 현황 및 목표 달성률</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>인기 메뉴 순위 및 판매량 분석</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>시간대별 매출 패턴 및 피크 시간 분석</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>월별/분기별 매출 트렌드 및 성장률</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl p-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">오늘의 매출 현황</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">총 매출</span>
                    <span className="text-2xl font-bold text-blue-600">₩1,247,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">주문 건수</span>
                    <span className="text-lg font-semibold">87건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">평균 주문 금액</span>
                    <span className="text-lg font-semibold">₩14,333</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-2">인기 메뉴 TOP 3</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>🍕 마르게리타 피자</span>
                        <span className="text-blue-600">23개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🍝 까르보나라</span>
                        <span className="text-blue-600">18개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🥗 시저 샐러드</span>
                        <span className="text-blue-600">15개</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 웨이팅 관리 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-purple-100 rounded-xl p-8">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">웨이팅 현황</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <span className="font-medium">김○○님 (2명)</span>
                        <div className="text-sm text-gray-600">대기번호 #03</div>
                      </div>
                      <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">15분 대기</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <span className="font-medium">이○○님 (4명)</span>
                        <div className="text-sm text-gray-600">대기번호 #04</div>
                      </div>
                      <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">25분 대기</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <span className="font-medium">박○○님 (3명)</span>
                        <div className="text-sm text-gray-600">대기번호 #05</div>
                      </div>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">35분 대기</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <button className="w-full bg-purple-600 text-white py-2 rounded text-sm">
                      다음 고객 호출
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">스마트 웨이팅 관리</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  QR 코드로 간편하게 웨이팅에 등록하고, 실시간으로 대기 현황을 확인할 수 있습니다. 
                  고객과 매장 모두에게 편리한 웨이팅 솔루션입니다.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>QR 코드 스캔으로 즉시 웨이팅 등록</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>실시간 대기 순서 및 예상 시간 안내</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>SMS 알림으로 입장 안내 자동 발송</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>웨이팅 패턴 분석으로 운영 최적화</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 추가 기능들 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">더 많은 편의 기능</h2>
            <p className="text-xl text-gray-600">레스토랑 운영을 더욱 효율적으로 만드는 추가 기능들</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">직원 관리</h3>
              <p className="text-gray-600">
                역할별 권한 설정, 근무 시간 관리, 
                성과 추적 등 체계적인 직원 관리 시스템
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">메뉴 관리</h3>
              <p className="text-gray-600">
                카테고리별 메뉴 구성, 가격 관리, 
                품절 처리, 시즌별 메뉴 운영 지원
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">모바일 최적화</h3>
              <p className="text-gray-600">
                모든 기능을 모바일에서도 완벽하게 이용할 수 있는 
                반응형 웹 디자인
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 바로 mfood를 체험해보세요
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            모든 기능을 무료로 체험하고 레스토랑 운영의 변화를 확인하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/guest" 
              className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              QR 주문 체험하기
            </Link>
            <Link 
              href="/auth/sign-up" 
              className="bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-orange-700 hover:bg-orange-800 transition-colors"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-orange-500">m</span>food
              </h3>
              <p className="text-gray-400">
                스마트한 레스토랑 관리 솔루션으로 비즈니스를 성장시키세요.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#qr-order" className="hover:text-white transition-colors">QR 주문 시스템</Link></li>
                <li><Link href="#kitchen" className="hover:text-white transition-colors">키친 관리</Link></li>
                <li><Link href="#analytics" className="hover:text-white transition-colors">매출 분석</Link></li>
                <li><Link href="#waitlist" className="hover:text-white transition-colors">웨이팅 관리</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/support/user-guide" className="hover:text-white transition-colors">사용자 가이드</Link></li>
                <li><Link href="/support/quick-start" className="hover:text-white transition-colors">빠른 시작</Link></li>
                <li><Link href="/support/admin-guide" className="hover:text-white transition-colors">관리자 가이드</Link></li>
                <li><Link href="/support/technical" className="hover:text-white transition-colors">기술 지원</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">홈</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">요금제</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">연락처</Link></li>
                <li><Link href="/auth/sign-up" className="hover:text-white transition-colors">무료 체험</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 mfood. All rights reserved. | Made with ❤️ for better restaurant experience</p>
          </div>
        </div>
      </footer>
    </div>
  )
}