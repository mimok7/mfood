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
    <div className="min-h-screen bg-starbucks-canvas text-starbucks-textBlack">
      {/* 헤더 */}
      <header className="bg-starbucks-ceramic border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight text-starbucks-house">
                <span className="text-starbucks-green font-rewards-serif">m</span>food
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <Link href="/features" className="text-starbucks-textBlackSoft hover:text-starbucks-green transition-colors">기능</Link>
              <Link href="/pricing" className="text-starbucks-textBlackSoft hover:text-starbucks-green transition-colors">요금</Link>
              <Link href="/contact" className="text-starbucks-textBlackSoft hover:text-starbucks-green transition-colors">문의</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/sign-in" 
                className="text-sm font-semibold text-starbucks-textBlackSoft hover:text-starbucks-green transition-colors"
              >
                로그인
              </Link>
              <Link 
                href="/guest" 
                className="bg-starbucks-accent text-white px-5 py-2.5 rounded-pill text-sm font-semibold btn-starbucks shadow-sm"
              >
                QR 주문하기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-starbucks-house via-[#162f28] to-starbucks-green py-20 relative overflow-hidden border-b border-starbucks-uplift">
        {/* 장식용 은은한 구체 광선 */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-starbucks-light/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-starbucks-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-white/60 text-center mx-auto transition-transform hover:scale-[1.01] duration-300">
            {/* 로고 영역 */}
            <div className="w-32 h-32 mb-6 mx-auto rounded-3xl overflow-hidden shadow-lg border border-slate-100/30">
              <img src="/icon-512.png" alt="mFood Logo" className="w-full h-full object-cover" />
            </div>

            {/* 타이틀 및 소개글 */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-starbucks-light text-starbucks-green border border-starbucks-green/20 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-starbucks-green animate-pulse"></span>
              Stay Halong Cafe POS
            </span>
            <h1 className="text-3xl font-black text-starbucks-house tracking-tight mb-3">
              mfood System
            </h1>
            <p className="text-sm text-starbucks-textBlackSoft leading-relaxed mb-8 max-w-md mx-auto">
              스마트한 레스토랑 관리의 새로운 기준.<br />
              QR 코드 주문으로 인건비 절감부터 키친 관리, 매출 분석까지. <span className="font-semibold text-starbucks-green">mfood</span>와 함께 시작하세요.
            </p>

            {/* 액션 버튼 */}
            <div className="space-y-3">
              <Link 
                href="/guest" 
                className="block w-full py-3.5 bg-starbucks-accent text-white rounded-full text-base font-bold text-center hover:bg-starbucks-green transition-all shadow-md btn-starbucks"
              >
                QR 주문 체험하기
              </Link>
              <Link 
                href="/auth/sign-in" 
                className="block w-full py-3.5 bg-transparent text-starbucks-green rounded-full text-sm font-bold text-center border-2 border-starbucks-green hover:bg-starbucks-green/5 transition-all btn-starbucks"
              >
                관리자 로그인
              </Link>
            </div>

            {/* 안내 텍스트 */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-left">
              <p className="text-[11px] font-bold text-starbucks-green mb-1 flex items-center gap-1.5 bg-starbucks-light/40 px-2 py-1 rounded-lg border border-starbucks-light/60">
                <span>📱 PWA 모바일 설치 지원</span>
              </p>
              <p className="text-[10px] text-starbucks-textBlackSoft leading-normal pl-1">
                기기 브라우저 메뉴에서 "홈 화면에 추가"를 누르시면 앱처럼 단독 실행 및 설치가 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-starbucks-house font-rewards-serif mb-4">핵심 기능</h2>
            <p className="text-base text-starbucks-textBlackSoft">레스토랑 운영의 모든 것을 하나로</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* QR 주문 */}
            <div className="text-center p-8 rounded-card bg-starbucks-canvas/30 border border-gray-100 hover:bg-starbucks-canvas/50 transition-colors">
              <div className="w-14 h-14 bg-starbucks-green text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-starbucks-house mb-3">QR 코드 주문</h3>
              <p className="text-sm text-starbucks-textBlackSoft leading-relaxed">
                테이블에서 QR 코드를 스캔하면 즉시 주문 가능. 
                대기 없는 편리하고 안전한 주문 시스템.
              </p>
            </div>

            {/* 키친 관리 */}
            <div className="text-center p-8 rounded-card bg-starbucks-canvas/30 border border-gray-100 hover:bg-starbucks-canvas/50 transition-colors">
              <div className="w-14 h-14 bg-starbucks-green text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-starbucks-house mb-3">스마트 키친</h3>
              <p className="text-sm text-starbucks-textBlackSoft leading-relaxed">
                실시간 주문 접수, 조리 상태 관리, 스테이션별 업무 분배로 
                동선을 최소화하는 효율적인 주방 운영.
              </p>
            </div>

            {/* 매출 분석 */}
            <div className="text-center p-8 rounded-card bg-starbucks-canvas/30 border border-gray-100 hover:bg-starbucks-canvas/50 transition-colors">
              <div className="w-14 h-14 bg-starbucks-green text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-starbucks-house mb-3">매출 분석</h3>
              <p className="text-sm text-starbucks-textBlackSoft leading-relaxed">
                실시간 매출 현황, 인기 메뉴 분석, 시간대별 통계로 
                데이터 기반의 완벽한 경영 의사결정 지원.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 사용자 유형별 기능 */}
      <section className="py-24 bg-starbucks-ceramic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-starbucks-house font-rewards-serif mb-4">모든 사용자를 위한 솔루션</h2>
            <p className="text-base text-starbucks-textBlackSoft">역할별 맞춤 인터페이스와 편리함</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 게스트 */}
            <div className="bg-white rounded-card p-8 border border-gray-200/50 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-starbucks-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-starbucks-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-starbucks-house">게스트</h3>
                <p className="text-xs text-starbucks-textBlackSoft mt-1">고객을 위한 직관적인 주문 경험</p>
              </div>
              <ul className="space-y-3.5 text-sm text-starbucks-textBlack">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>QR 코드 스캔으로 대기 없이 테이블 주문</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>실시간 모바일 웨이팅 접수</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>내 주문 진행 상태 실시간 확인</span>
                </li>
              </ul>
            </div>

            {/* 매니저 */}
            <div className="bg-white rounded-card p-8 border border-gray-200/50 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-starbucks-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-starbucks-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-starbucks-house">매니저</h3>
                <p className="text-xs text-starbucks-textBlackSoft mt-1">효율적이고 스마트한 운영 관리</p>
              </div>
              <ul className="space-y-3.5 text-sm text-starbucks-textBlack">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>KDS 시스템으로 실시간 주문 및 조리 지시</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>테이블 오더 및 실시간 좌석 상태 확인</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>매출 통계 및 정산 데이터 모니터링</span>
                </li>
              </ul>
            </div>

            {/* 관리자 */}
            <div className="bg-white rounded-card p-8 border border-gray-200/50 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-starbucks-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-starbucks-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-starbucks-house">관리자</h3>
                <p className="text-xs text-starbucks-textBlackSoft mt-1">전체 지점 및 프랜차이즈 관리</p>
              </div>
              <ul className="space-y-3.5 text-sm text-starbucks-textBlack">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>멀티 매장 및 지점 활성화/생성 관리</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>통합 메뉴 데이터베이스 및 카테고리 구성</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-starbucks-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>매장별 QR 코드 출력 및 기기 보안 관리</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 bg-starbucks-house text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-rewards-serif mb-6">
            지금 바로 비즈니스를 업그레이드하세요
          </h2>
          <p className="text-base text-starbucks-light mb-10 leading-relaxed max-w-xl mx-auto">
            mfood로 레스토랑 운영을 스마트하게 혁신하고,<br />고객에게 품격 있는 대기 및 주문 환경을 제공해 보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/guest" 
              className="bg-white text-starbucks-house hover:bg-starbucks-canvas px-8 py-3.5 rounded-pill text-base font-semibold btn-starbucks shadow-sm"
            >
              QR 주문 체험
            </Link>
            <Link 
              href="/auth/sign-in" 
              className="bg-starbucks-accent text-white hover:bg-starbucks-green px-8 py-3.5 rounded-pill text-base font-semibold border border-starbucks-accent btn-starbucks shadow-sm"
            >
              시스템 도입 문의
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer id="contact" className="bg-starbucks-house border-t border-starbucks-uplift text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold font-rewards-serif mb-4">
                <span className="text-starbucks-gold">m</span>food
              </h3>
              <p className="text-xs text-starbucks-light/75 leading-relaxed">
                스마트한 레스토랑 관리 솔루션으로 비즈니스를 성장시키세요.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-starbucks-gold tracking-wider mb-4">제품</h4>
              <ul className="space-y-2.5 text-xs text-starbucks-light/80">
                <li><Link href="/features" className="hover:text-white transition-colors">QR 주문 시스템</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">키친 관리</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">매출 분석</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">웨이팅 관리</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-starbucks-gold tracking-wider mb-4">지원</h4>
              <ul className="space-y-2.5 text-xs text-starbucks-light/80">
                <li><Link href="/support/user-guide" className="hover:text-white transition-colors">사용자 가이드</Link></li>
                <li><Link href="/support/quick-start" className="hover:text-white transition-colors">빠른 시작</Link></li>
                <li><Link href="/support/admin-guide" className="hover:text-white transition-colors">관리자 가이드</Link></li>
                <li><Link href="/support/technical" className="hover:text-white transition-colors">기술 지원</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-starbucks-gold tracking-wider mb-4">회사</h4>
              <ul className="space-y-2.5 text-xs text-starbucks-light/80">
                <li><Link href="/" className="hover:text-white transition-colors">홈</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">요금제</Link></li>
                <li><Link href={'/contact/card' as Route} className="hover:text-white transition-colors">연락처</Link></li>
                <li><Link href="/auth/sign-up" className="hover:text-white transition-colors">무료 체험</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-starbucks-gold tracking-wider mb-4">연락처</h4>
              <ul className="space-y-2.5 text-xs text-starbucks-light/80 leading-relaxed">
                <li>📧 mfood@stayhalong.com</li>
                <li>📞 010-6282-3959</li>
                <li>🏢 경기도 용인시 수지구 광교마을로</li>
                <li>⏰ 평일 09:00-18:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-starbucks-uplift pt-8 text-center text-xs text-starbucks-light/50">
            <p>&copy; 2025 mfood. All rights reserved. | Made with ❤️ for better restaurant experience</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
