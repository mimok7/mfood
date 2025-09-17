import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* 404 일러스트 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-orange-200 mb-4">404</div>
          <div className="relative">
            <div className="w-32 h-32 bg-orange-300 rounded-full mx-auto opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-24 h-24 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m6 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            요청하신 페이지가 이동되었거나 삭제되었을 수 있습니다. 
            URL을 다시 확인해주세요.
          </p>
          <p className="text-sm text-gray-500">
            문제가 지속되면 <Link href="/contact" className="text-orange-600 hover:text-orange-700 underline">고객 지원팀</Link>에 문의해주세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            🏠 홈페이지로 돌아가기
          </Link>
          
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/features"
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium border-2 border-orange-600 hover:bg-orange-50 transition-colors"
            >
              📋 기능 보기
            </Link>
            <Link 
              href="/contact"
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium border-2 border-orange-600 hover:bg-orange-50 transition-colors"
            >
              💬 문의하기
            </Link>
          </div>
        </div>

        {/* 빠른 링크 */}
        <div className="mt-12 pt-8 border-t border-orange-200">
          <p className="text-sm text-gray-600 mb-4">또는 이런 페이지는 어떠세요?</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link href="/guest" className="text-orange-600 hover:text-orange-700 transition-colors">
              🍽️ QR 주문하기
            </Link>
            <Link href="/pricing" className="text-orange-600 hover:text-orange-700 transition-colors">
              💰 요금제 보기
            </Link>
            <Link href="/auth/sign-in" className="text-orange-600 hover:text-orange-700 transition-colors">
              🔑 로그인
            </Link>
            <Link href="/auth/sign-up" className="text-orange-600 hover:text-orange-700 transition-colors">
              ✨ 회원가입
            </Link>
          </div>
        </div>

        {/* mfood 로고 */}
        <div className="mt-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-gray-400">
              <span className="text-orange-400">m</span>food
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}