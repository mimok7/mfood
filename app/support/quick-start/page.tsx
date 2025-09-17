'use client';

import Link from 'next/link';

export default function QuickStartPage() {
  const steps = [
    {
      title: '계정 생성',
      description: '무료 계정을 만들고 레스토랑 정보를 입력하세요',
      time: '5분',
      icon: '👤',
      color: 'blue'
    },
    {
      title: '메뉴 등록',
      description: '카테고리별로 메뉴와 가격을 추가하세요',
      time: '15분',
      icon: '🍽️',
      color: 'green'
    },
    {
      title: 'QR 코드 생성',
      description: '각 테이블용 QR 코드를 생성하고 출력하세요',
      time: '10분',
      icon: '📱',
      color: 'purple'
    },
    {
      title: '첫 주문 테스트',
      description: 'QR 코드를 스캔하여 시스템을 테스트해보세요',
      time: '5분',
      icon: '✅',
      color: 'orange'
    }
  ];

  const features = [
    {
      title: 'QR 주문 시스템',
      description: '고객이 QR 코드를 스캔하여 직접 주문',
      benefits: [
        '대기 시간 단축',
        '주문 정확도 향상',
        '인건비 절약'
      ]
    },
    {
      title: '실시간 주방 관리',
      description: '주문이 즉시 주방으로 전달되어 효율적인 조리',
      benefits: [
        '주문 누락 방지',
        '조리 시간 최적화',
        '실시간 상태 확인'
      ]
    },
    {
      title: '매출 분석',
      description: '상세한 매출 리포트와 비즈니스 인사이트',
      benefits: [
        '매출 트렌드 분석',
        '인기 메뉴 파악',
        '데이터 기반 의사결정'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">빠른 시작 가이드</h1>
              <p className="text-gray-600 mt-2">30분 만에 mfood 시스템을 완전히 설정하세요</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 진행 과정 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">4단계로 완성하는 설정</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 border-${step.color}-500`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${step.color}-100 rounded-full flex items-center justify-center text-2xl`}>
                      {step.icon}
                    </div>
                    <span className={`text-sm px-3 py-1 bg-${step.color}-100 text-${step.color}-700 rounded-full`}>
                      {step.time}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 상세 단계 */}
        <div className="space-y-12">
          {/* 1단계 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">👤</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">1단계: 계정 생성</h3>
                <p className="text-gray-600">약 5분 소요</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">필요한 정보</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    이메일 주소
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    안전한 비밀번호
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    레스토랑 이름
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    주소 및 연락처
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">진행 방법</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-blue-800 font-medium">1. 회원가입 페이지 접속</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-blue-800 font-medium">2. 기본 정보 입력</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-blue-800 font-medium">3. 이메일 인증 완료</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/auth/sign-up"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                계정 만들기
              </Link>
            </div>
          </div>

          {/* 2단계 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">🍽️</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">2단계: 메뉴 등록</h3>
                <p className="text-gray-600">약 15분 소요</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-3">카테고리 생성</h4>
                  <p className="text-green-700">메인 요리, 사이드, 음료 등 카테고리를 만드세요</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-3">메뉴 추가</h4>
                  <p className="text-green-700">각 카테고리에 메뉴와 가격, 설명을 입력하세요</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-3">이미지 업로드</h4>
                  <p className="text-green-700">메뉴 사진을 추가하여 더욱 매력적으로 만드세요</p>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-800 mb-3">💡 팁</h4>
                <p className="text-yellow-700">메뉴 이름은 간단명료하게, 가격은 정확하게 입력하세요. 나중에 언제든 수정할 수 있습니다.</p>
              </div>
            </div>
          </div>

          {/* 3단계 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">📱</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">3단계: QR 코드 생성</h3>
                <p className="text-gray-600">약 10분 소요</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">테이블 설정</h4>
                <div className="bg-purple-50 rounded-lg p-6">
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                      <span>관리자 패널에서 "QR 관리" 선택</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                      <span>테이블 수만큼 QR 코드 생성</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                      <span>QR 코드 PDF 다운로드 및 인쇄</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                      <span>각 테이블에 QR 코드 부착</span>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">QR 코드 배치 팁</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">📍 테이블 중앙에 배치</p>
                    <p className="text-blue-600 text-sm">모든 고객이 쉽게 볼 수 있는 위치</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-green-800 font-medium">🔒 라미네이팅 처리</p>
                    <p className="text-green-600 text-sm">물이나 오염으로부터 보호</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-orange-800 font-medium">📏 적절한 크기</p>
                    <p className="text-orange-600 text-sm">스마트폰으로 스캔하기 쉬운 크기</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4단계 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">✅</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">4단계: 첫 주문 테스트</h3>
                <p className="text-gray-600">약 5분 소요</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-orange-50 rounded-lg p-6">
                <h4 className="font-semibold text-orange-800 mb-4">테스트 체크리스트</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-orange-600" />
                      <span>QR 코드 스캔 확인</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-orange-600" />
                      <span>메뉴 정상 표시 확인</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-orange-600" />
                      <span>주문 기능 테스트</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-orange-600" />
                      <span>주방 화면에 주문 표시</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-orange-600" />
                      <span>주문 상태 변경 테스트</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-orange-600" />
                      <span>매출 데이터 확인</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 주요 기능 소개 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">이제 이런 기능들을 사용할 수 있습니다</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">🎉 설정 완료!</h2>
          <p className="text-lg mb-6">이제 mfood의 모든 기능을 활용할 수 있습니다</p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/support/user-guide"
              className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              상세 사용법 보기
            </Link>
            <Link
              href="/support/admin-guide"
              className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              관리자 가이드
            </Link>
            <Link
              href="/support/technical"
              className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              기술 지원
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}