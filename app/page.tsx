import { getSession } from '@/lib/auth'
import Link from 'next/link'
import type { Route } from 'next'

export default async function Home() {
  const { user, role } = await getSession()

  // 로그인된 사용자는 해당 대시보드로 리디렉션
  if (user) {
    if (role === 'admin') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">관리자로 로그인되었습니다</h1>
            <Link 
              href="/admin" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              관리자 대시보드로 이동
            </Link>
          </div>
        </div>
      )
    }
    if (role === 'manager') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">매니저로 로그인되었습니다</h1>
            <Link 
              href="/manager" 
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              매니저 대시보드로 이동
            </Link>
          </div>
        </div>
      )
    }
    
    // 게스트인 경우
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">게스트로 로그인되었습니다</h1>
          <Link 
            href="/guest" 
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            게스트 페이지로 이동
          </Link>
        </div>
      </div>
    )
  }

  // 비로그인 사용자를 위한 홈페이지
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-orange-600">m</span>food
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">기능</Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              스마트한 레스토랑 관리의 
              <br />
              <span className="text-orange-600">새로운 기준</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              QR 코드 주문부터 키친 관리, 매출 분석까지. 
              mfood와 함께 레스토랑 운영을 혁신하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/guest" 
                className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                QR 주문 체험하기
              </Link>
              <Link 
                href="/auth/sign-in" 
                className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-orange-600 hover:bg-orange-50 transition-colors"
              >
                관리자 로그인
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">핵심 기능</h2>
            <p className="text-xl text-gray-600">레스토랑 운영의 모든 것을 하나로</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* QR 주문 */}
            <div className="text-center p-8 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">QR 코드 주문</h3>
              <p className="text-gray-600">
                테이블에서 QR 코드를 스캔하면 즉시 주문 가능. 
                접촉 없는 안전한 주문 시스템.
              </p>
            </div>

            {/* 키친 관리 */}
            <div className="text-center p-8 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">스마트 키친</h3>
              <p className="text-gray-600">
                실시간 주문 접수, 조리 상태 관리, 스테이션별 업무 분배로 
                효율적인 키친 운영.
              </p>
            </div>

            {/* 매출 분석 */}
            <div className="text-center p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">매출 분석</h3>
              <p className="text-gray-600">
                실시간 매출 현황, 인기 메뉴 분석, 시간대별 통계로 
                데이터 기반 의사결정 지원.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 사용자 유형별 기능 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">모든 사용자를 위한 솔루션</h2>
            <p className="text-xl text-gray-600">역할별 맞춤 인터페이스와 기능</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 게스트 */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">게스트</h3>
                <p className="text-gray-600 mt-2">고객을 위한 간편한 주문 경험</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  QR 코드 스캔으로 즉시 주문
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  실시간 웨이팅 등록
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  주문 상태 실시간 확인
                </li>
              </ul>
            </div>

            {/* 매니저 */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">매니저</h3>
                <p className="text-gray-600 mt-2">레스토랑 운영의 중추</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  키친 주문 관리 및 조리 지시
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  서빙 및 테이블 관리
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  실시간 매출 현황 및 분석
                </li>
              </ul>
            </div>

            {/* 관리자 */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">관리자</h3>
                <p className="text-gray-600 mt-2">시스템 전체 관리 및 설정</p>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  다중 레스토랑 관리
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  메뉴 및 직원 관리
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  QR 코드 생성 및 관리
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            mfood로 레스토랑 운영을 혁신하고 고객 만족도를 높이세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/guest" 
              className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              QR 주문 체험
            </Link>
            <Link 
              href="/auth/sign-in" 
              className="bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-orange-700 hover:bg-orange-800 transition-colors"
            >
              시스템 도입 문의
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
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
                <li><Link href="/features" className="hover:text-white transition-colors">QR 주문 시스템</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">키친 관리</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">매출 분석</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">웨이팅 관리</Link></li>
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

            <div>
              <h4 className="text-lg font-semibold mb-4">연락처</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 contact@mfood.com</li>
                <li>📞 1588-1234</li>
                <li>🏢 서울시 강남구 테헤란로</li>
                <li>⏰ 평일 09:00-18:00</li>
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
