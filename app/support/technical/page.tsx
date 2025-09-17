'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TechnicalSupportPage() {
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    priority: 'medium',
    category: '',
    subject: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 실제 구현에서는 여기서 API 호출
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const faqItems = [
    {
      category: '로그인 문제',
      question: '로그인이 되지 않아요',
      answer: '비밀번호를 확인하고, 대소문자를 정확히 입력했는지 확인하세요. 여전히 문제가 있다면 "비밀번호 찾기"를 이용하세요.'
    },
    {
      category: 'QR 코드',
      question: 'QR 코드가 작동하지 않아요',
      answer: 'QR 코드가 손상되지 않았는지 확인하고, 조명이 충분한 곳에서 다시 시도해보세요. 문제가 지속되면 새 QR 코드를 생성하세요.'
    },
    {
      category: '주문 관리',
      question: '주문이 주방에 표시되지 않아요',
      answer: '인터넷 연결을 확인하고, 주방 화면을 새로고침해보세요. 주문 시스템 상태를 확인하고 문제가 지속되면 즉시 연락하세요.'
    },
    {
      category: '결제 문제',
      question: '결제가 처리되지 않아요',
      answer: '결제 정보를 다시 확인하고, 카드 한도나 계좌 잔액을 확인하세요. 다른 결제 방법을 시도해보거나 관리자에게 문의하세요.'
    },
    {
      category: '시스템 오류',
      question: '시스템이 느려요',
      answer: '브라우저 캐시를 정리하고, 다른 탭을 닫아보세요. 인터넷 연결 속도를 확인하고, 문제가 지속되면 기술 지원팀에 연락하세요.'
    }
  ];

  const quickSolutions = [
    {
      title: '로그인 문제',
      icon: '🔐',
      color: 'red',
      solutions: [
        '비밀번호 재설정 링크 사용',
        '브라우저 쿠키 및 캐시 삭제',
        '다른 브라우저에서 시도',
        '관리자에게 계정 상태 확인 요청'
      ]
    },
    {
      title: '주문 처리 오류',
      icon: '🍽️',
      color: 'orange',
      solutions: [
        '페이지 새로고침',
        '인터넷 연결 확인',
        '주방 화면 재시작',
        '수동 주문 입력으로 임시 대응'
      ]
    },
    {
      title: '결제 문제',
      icon: '💳',
      color: 'blue',
      solutions: [
        '다른 결제 방법 시도',
        '카드 정보 재입력',
        '현금 결제로 대체',
        '은행에 카드 상태 확인'
      ]
    },
    {
      title: '시스템 성능',
      icon: '⚡',
      color: 'green',
      solutions: [
        '불필요한 탭 및 프로그램 종료',
        '브라우저 재시작',
        '네트워크 연결 확인',
        '시스템 재부팅'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">기술 지원</h1>
              <p className="text-gray-600 mt-2">24/7 전문 기술 지원팀이 도와드립니다</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 긴급 연락처 */}
        <div className="bg-red-600 text-white rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
              🚨
            </div>
            <div>
              <h2 className="text-xl font-bold">긴급 지원</h2>
              <p>시스템 장애나 긴급 상황 시 즉시 연락하세요</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📞 긴급 전화</h3>
              <p className="text-lg font-bold">1588-1234</p>
              <p className="text-sm">24시간 운영</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💬 실시간 채팅</h3>
              <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                채팅 시작
              </button>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📧 이메일</h3>
              <p>emergency@mfood.co.kr</p>
              <p className="text-sm">1시간 내 응답</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 지원 티켓 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎫 지원 티켓 생성</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✅
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">티켓이 성공적으로 생성되었습니다!</h3>
                <p className="text-gray-600 mb-4">티켓 번호: #TK-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                <p className="text-gray-600 mb-6">담당자가 24시간 이내에 연락드리겠습니다.</p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setTicketForm({
                      name: '',
                      email: '',
                      priority: 'medium',
                      category: '',
                      subject: '',
                      description: ''
                    });
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  새 티켓 생성
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    <input
                      type="text"
                      required
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm({...ticketForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    <input
                      type="email"
                      required
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                      <option value="urgent">긴급</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      required
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">선택하세요</option>
                      <option value="login">로그인 문제</option>
                      <option value="orders">주문 관리</option>
                      <option value="payments">결제 문제</option>
                      <option value="qr">QR 코드</option>
                      <option value="reports">리포트 문제</option>
                      <option value="performance">시스템 성능</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="문제를 간단히 요약해주세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
                  <textarea
                    required
                    rows={6}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="문제가 언제 발생했는지, 어떤 상황에서 발생했는지 자세히 설명해주세요"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '티켓 생성 중...' : '지원 티켓 생성'}
                </button>
              </form>
            )}
          </div>

          {/* 빠른 해결 방법 */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ 빠른 해결 방법</h2>
              <div className="space-y-4">
                {quickSolutions.map((solution, index) => (
                  <div key={index} className={`bg-${solution.color}-50 rounded-lg p-4`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{solution.icon}</span>
                      <h3 className={`font-semibold text-${solution.color}-800`}>{solution.title}</h3>
                    </div>
                    <ul className="space-y-1">
                      {solution.solutions.map((item, idx) => (
                        <li key={idx} className={`text-${solution.color}-700 text-sm flex items-center gap-2`}>
                          <span className={`w-1.5 h-1.5 bg-${solution.color}-500 rounded-full`}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📞 연락처</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">📞</div>
                  <div>
                    <p className="font-semibold text-blue-800">일반 지원</p>
                    <p className="text-blue-600">02-1234-5678 (평일 9-18시)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">📧</div>
                  <div>
                    <p className="font-semibold text-green-800">이메일 지원</p>
                    <p className="text-green-600">support@mfood.co.kr</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">💬</div>
                  <div>
                    <p className="font-semibold text-purple-800">실시간 채팅</p>
                    <p className="text-purple-600">웹사이트 우하단 채팅 버튼</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">❓ 자주 묻는 질문</h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mt-3 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 리소스 */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">📚 추가 도움말</h2>
          <p className="text-lg mb-6">더 많은 정보와 가이드를 확인하세요</p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/support/user-guide"
              className="inline-block px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              사용자 가이드
            </Link>
            <Link
              href="/support/quick-start"
              className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              빠른 시작
            </Link>
            <Link
              href="/support/admin-guide"
              className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              관리자 가이드
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}