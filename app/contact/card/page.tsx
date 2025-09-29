import Link from 'next/link'

export default function ContactCardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white">
          {/* Top banner */}
          <div className="h-28 bg-gradient-to-r from-orange-600 to-red-600" />

          {/* Avatar */}
          <div className="-mt-12 px-6">
            <div className="w-24 h-24 rounded-2xl ring-4 ring-white bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              m
            </div>
          </div>

          {/* Info */}
          <div className="px-6 pt-4 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">mfood</h1>
            <p className="text-gray-500">스마트 레스토랑 POS · QR 주문 · 키친 관리 · 매출 분석</p>

            <div className="mt-6 space-y-3">
              <a href="tel:01062823959" className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">전화</div>
                  <div className="text-gray-900 font-medium">010-6282-3959</div>
                </div>
              </a>

              <a href="mailto:mfood@stayhalong.com" className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">이메일</div>
                  <div className="text-gray-900 font-medium">mfood@stayhalong.com</div>
                </div>
              </a>

              <div className="flex items-center p-3 rounded-xl bg-gray-50">
                <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">주소</div>
                  <div className="text-gray-900 font-medium">경기도 용인시 수지구 광교마을로</div>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-xl bg-gray-50">
                <svg className="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">상담 가능 시간</div>
                  <div className="text-gray-900 font-medium">평일 09:00 - 18:00</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href="tel:01062823959" className="text-center px-4 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors">전화하기</a>
              <a href="mailto:mfood@stayhalong.com" className="text-center px-4 py-3 rounded-xl bg-white border-2 border-orange-600 text-orange-600 font-semibold hover:bg-orange-50 transition-colors">이메일</a>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">홈으로 돌아가기</Link>
            </div>
          </div>
        </div>

        {/* Small caption */}
        <div className="mt-6 text-center text-xs text-gray-500">
          © 2025 mfood — 스마트한 레스토랑 경험을 만듭니다
        </div>
      </div>
    </div>
  )
}
