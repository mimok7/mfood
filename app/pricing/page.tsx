import Link from 'next/link'

export default function PricingPage() {
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
              <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">기능</Link>
              <Link href="/pricing" className="text-orange-600 font-medium">요금</Link>
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
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            합리적인 <span className="text-blue-600">요금제</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            레스토랑 규모와 필요에 맞는 플랜을 선택하세요. 
            모든 플랜에서 핵심 기능을 제공하며, 언제든지 업그레이드 가능합니다.
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            🎉 2025년 1월까지 모든 플랜 50% 할인!
          </div>
        </div>
      </section>

      {/* 요금제 비교 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* 스타터 플랜 */}
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">스타터</h3>
                <p className="text-gray-600 mb-6">소규모 카페/레스토랑을 위한 기본 플랜</p>
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-900">₩49,000</span>
                  <span className="text-gray-600">/월</span>
                  <div className="text-sm text-green-600 font-medium mt-1">
                    ~~₩98,000~~ 50% 할인 적용
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">QR 주문 시스템</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">기본 키친 관리</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">테이블 최대 10개</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">기본 매출 리포트</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">이메일 지원</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 text-gray-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>웨이팅 관리</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 text-gray-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>고급 분석</span>
                </li>
              </ul>

              <Link 
                href="/auth/sign-up"
                className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                스타터로 시작하기
              </Link>
            </div>

            {/* 프로페셔널 플랜 (추천) */}
            <div className="bg-white rounded-xl shadow-xl p-8 relative border-2 border-blue-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  가장 인기
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">프로페셔널</h3>
                <p className="text-gray-600 mb-6">중소 레스토랑을 위한 완전한 솔루션</p>
                <div className="text-center">
                  <span className="text-4xl font-bold text-blue-600">₩99,000</span>
                  <span className="text-gray-600">/월</span>
                  <div className="text-sm text-green-600 font-medium mt-1">
                    ~~₩198,000~~ 50% 할인 적용
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">스타터의 모든 기능</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">웨이팅 관리 시스템</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">테이블 최대 30개</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">고급 매출 분석</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">스테이션별 키친 관리</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">전화 지원</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 text-gray-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>다중 매장 관리</span>
                </li>
              </ul>

              <Link 
                href="/auth/sign-up"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                프로페셔널로 시작하기
              </Link>
            </div>

            {/* 엔터프라이즈 플랜 */}
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">엔터프라이즈</h3>
                <p className="text-gray-600 mb-6">대형 체인점 및 프랜차이즈를 위한 플랜</p>
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-900">₩199,000</span>
                  <span className="text-gray-600">/월</span>
                  <div className="text-sm text-green-600 font-medium mt-1">
                    ~~₩398,000~~ 50% 할인 적용
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">프로페셔널의 모든 기능</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">다중 매장 관리</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">무제한 테이블</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">맞춤형 리포트</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">API 연동 지원</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">전담 고객 관리자</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">24/7 우선 지원</span>
                </li>
              </ul>

              <Link 
                href="/contact"
                className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                영업팀에 문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 비교표 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">상세 기능 비교</h2>
            <p className="text-xl text-gray-600">플랜별 제공되는 기능을 자세히 비교해보세요</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">기능</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">스타터</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 bg-blue-50">프로페셔널</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">엔터프라이즈</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">QR 코드 주문</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">테이블 수</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">최대 10개</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 bg-blue-50">최대 30개</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">무제한</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">키친 관리</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">기본</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 bg-blue-50">스테이션별</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">고급 + 커스텀</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">웨이팅 관리</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">매출 분석</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">기본 리포트</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 bg-blue-50">고급 분석</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">맞춤형 리포트</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">다중 매장 관리</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">API 연동</td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50">
                    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">고객 지원</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">이메일</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 bg-blue-50">이메일 + 전화</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">24/7 전담</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
            <p className="text-xl text-gray-600">요금제에 대해 궁금한 점을 확인해보세요</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 결제는 어떻게 하나요?</h3>
              <p className="text-gray-600">
                월 단위 구독제로 운영되며, 신용카드 또는 계좌이체로 결제 가능합니다. 
                첫 달은 무료 체험 기간이 제공되며, 언제든지 해지 가능합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔄 플랜 변경이 가능한가요?</h3>
              <p className="text-gray-600">
                네, 언제든지 플랜 업그레이드나 다운그레이드가 가능합니다. 
                업그레이드는 즉시 적용되며, 다운그레이드는 다음 결제 주기부터 적용됩니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 데이터는 안전하게 보관되나요?</h3>
              <p className="text-gray-600">
                모든 데이터는 SSL 암호화되어 안전하게 보관됩니다. 
                정기적인 백업을 통해 데이터 손실을 방지하며, 개인정보보호법을 준수합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🛠️ 설치나 설정이 복잡한가요?</h3>
              <p className="text-gray-600">
                별도 설치 없이 웹 브라우저에서 바로 이용 가능합니다. 
                전담 매니저가 초기 설정을 도와드리며, 30분 내에 사용을 시작할 수 있습니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔧 기술 지원은 어떻게 받나요?</h3>
              <p className="text-gray-600">
                플랜별로 다양한 지원 채널을 제공합니다. 스타터는 이메일, 프로페셔널은 이메일+전화, 
                엔터프라이즈는 24/7 전담 매니저 지원을 받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            30일 무료 체험으로 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            신용카드 등록 없이 모든 기능을 무료로 체험할 수 있습니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/sign-up" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              무료 체험 시작하기
            </Link>
            <Link 
              href="/contact" 
              className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-700 hover:bg-blue-800 transition-colors"
            >
              영업팀에 문의하기
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
                <li><Link href="/features" className="hover:text-white transition-colors">기능</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">요금제</Link></li>
                <li><Link href="/guest" className="hover:text-white transition-colors">QR 주문</Link></li>
                <li><Link href="/auth/sign-up" className="hover:text-white transition-colors">무료 체험</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs/user-guide.md" className="hover:text-white transition-colors">사용자 가이드</Link></li>
                <li><Link href="/docs/quick-start.md" className="hover:text-white transition-colors">빠른 시작</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">기술 지원</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">홈</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">기능</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">연락처</Link></li>
                <li><Link href="/auth/sign-in" className="hover:text-white transition-colors">로그인</Link></li>
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