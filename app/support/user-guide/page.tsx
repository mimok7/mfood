'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function UserGuidePage() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const tabs = [
    { id: 'getting-started', title: '시작하기', icon: '🚀' },
    { id: 'ordering', title: 'QR 주문', icon: '📱' },
    { id: 'kitchen', title: '주방 관리', icon: '👨‍🍳' },
    { id: 'reports', title: '매출 분석', icon: '📊' },
    { id: 'troubleshooting', title: '문제 해결', icon: '🔧' }
  ];

  const faqItems = [
    {
      question: 'QR 코드가 스캔되지 않아요',
      answer: 'QR 코드가 선명하게 보이는지 확인하고, 카메라 렌즈를 깨끗이 닦아주세요. 조명이 충분한 곳에서 다시 시도해보세요.'
    },
    {
      question: '주문이 주방에 전달되지 않아요',
      answer: '인터넷 연결 상태를 확인하고, 주방 디스플레이가 켜져 있는지 확인해주세요. 문제가 지속되면 기술 지원팀에 문의하세요.'
    },
    {
      question: '메뉴 수정은 어떻게 하나요?',
      answer: '관리자 계정으로 로그인 후 "메뉴 관리" 섹션에서 메뉴를 추가, 수정, 삭제할 수 있습니다.'
    },
    {
      question: '매출 리포트는 어디서 확인하나요?',
      answer: '관리자 대시보드의 "매출 분석" 탭에서 일별, 주별, 월별 매출 리포트를 확인할 수 있습니다.'
    },
    {
      question: '직원 계정은 어떻게 관리하나요?',
      answer: '관리자 권한으로 "사용자 관리"에서 직원 계정을 추가하고 권한을 설정할 수 있습니다.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">사용자 가이드</h1>
              <p className="text-gray-600 mt-2">mfood 시스템 사용법을 쉽게 배워보세요</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 네비게이션 */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">가이드 섹션</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* 시작하기 탭 */}
              {activeTab === 'getting-started' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 시작하기</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">1. 계정 설정</h3>
                      <div className="bg-blue-50 rounded-lg p-6">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                            <div>
                              <p className="font-medium">계정 생성</p>
                              <p className="text-gray-600">이메일과 비밀번호로 계정을 만드세요</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                            <div>
                              <p className="font-medium">레스토랑 정보 입력</p>
                              <p className="text-gray-600">레스토랑 이름, 주소, 연락처를 등록하세요</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                            <div>
                              <p className="font-medium">메뉴 등록</p>
                              <p className="text-gray-600">카테고리별로 메뉴와 가격을 입력하세요</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">2. 기본 설정</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-lg p-6">
                          <h4 className="font-semibold text-green-800 mb-3">테이블 설정</h4>
                          <p className="text-green-700">QR 코드를 생성하고 각 테이블에 배치하세요</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-6">
                          <h4 className="font-semibold text-purple-800 mb-3">직원 계정</h4>
                          <p className="text-purple-700">매니저와 직원 계정을 생성하고 권한을 설정하세요</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* QR 주문 탭 */}
              {activeTab === 'ordering' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📱 QR 주문 시스템</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">고객 주문 과정</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">📱</div>
                          <h4 className="font-semibold mb-2">QR 스캔</h4>
                          <p className="text-gray-600">테이블의 QR 코드를 스마트폰으로 스캔</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">🍽️</div>
                          <h4 className="font-semibold mb-2">메뉴 선택</h4>
                          <p className="text-gray-600">모바일 메뉴에서 원하는 음식 선택</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">✅</div>
                          <h4 className="font-semibold mb-2">주문 완료</h4>
                          <p className="text-gray-600">주문이 즉시 주방으로 전달</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">QR 코드 관리</h3>
                      <div className="bg-yellow-50 rounded-lg p-6">
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            각 테이블마다 고유한 QR 코드가 생성됩니다
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            QR 코드는 인쇄하여 테이블에 비치하세요
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            주기적으로 QR 코드 상태를 확인하세요
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 주방 관리 탭 */}
              {activeTab === 'kitchen' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">👨‍🍳 주방 관리</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">주문 처리 과정</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                          <div>
                            <p className="font-semibold">새 주문 알림</p>
                            <p className="text-gray-600">고객 주문이 실시간으로 주방 화면에 표시</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                          <div>
                            <p className="font-semibold">조리 시작</p>
                            <p className="text-gray-600">"조리 시작" 버튼을 눌러 주문 상태 업데이트</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                          <div>
                            <p className="font-semibold">조리 완료</p>
                            <p className="text-gray-600">음식이 준비되면 "완료" 버튼으로 서빙팀에 알림</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">주방 화면 기능</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-lg p-6">
                          <h4 className="font-semibold text-blue-800 mb-3">📋 주문 대기열</h4>
                          <p className="text-blue-700">대기 중인 모든 주문을 시간순으로 확인</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-6">
                          <h4 className="font-semibold text-green-800 mb-3">⏱️ 조리 시간</h4>
                          <p className="text-green-700">각 주문의 대기 시간과 예상 완료 시간 표시</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 매출 분석 탭 */}
              {activeTab === 'reports' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 매출 분석</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">리포트 종류</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-purple-600 text-2xl mb-2">📈</div>
                          <h4 className="font-semibold mb-2">일별 매출</h4>
                          <p className="text-gray-600">하루 단위 매출 현황과 주문 건수</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-blue-600 text-2xl mb-2">📊</div>
                          <h4 className="font-semibold mb-2">주간 분석</h4>
                          <p className="text-gray-600">주별 매출 트렌드와 성장률</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-green-600 text-2xl mb-2">📋</div>
                          <h4 className="font-semibold mb-2">메뉴 분석</h4>
                          <p className="text-gray-600">인기 메뉴와 매출 기여도</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">주요 지표</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">매출 지표</h4>
                            <ul className="space-y-2 text-gray-600">
                              <li>• 총 매출액</li>
                              <li>• 평균 주문 금액</li>
                              <li>• 시간대별 매출</li>
                              <li>• 월 대비 성장률</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">운영 지표</h4>
                            <ul className="space-y-2 text-gray-600">
                              <li>• 주문 처리 시간</li>
                              <li>• 테이블 회전율</li>
                              <li>• 고객 대기 시간</li>
                              <li>• 취소율</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 문제 해결 탭 */}
              {activeTab === 'troubleshooting' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🔧 문제 해결</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">자주 묻는 질문</h3>
                      <div className="space-y-4">
                        {faqItems.map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-2">❓ {item.question}</h4>
                            <p className="text-gray-700">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-red-800 mb-4">긴급 상황 대응</h3>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-red-700 mb-2">🚨 시스템 장애</h4>
                          <p className="text-gray-700">인터넷 연결을 확인하고, 페이지를 새로고침해보세요. 문제가 지속되면 즉시 기술 지원팀에 연락하세요.</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-orange-700 mb-2">⚠️ 주문 오류</h4>
                          <p className="text-gray-700">주문 내역을 다시 확인하고, 필요시 고객에게 직접 확인 후 수동으로 주문을 수정하세요.</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">추가 도움이 필요하세요?</h3>
                      <p className="text-blue-700 mb-6">기술 지원팀이 24/7 대기하고 있습니다</p>
                      <div className="space-y-3">
                        <Link
                          href="/support/technical"
                          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
                        >
                          기술 지원 요청
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          연락처
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}