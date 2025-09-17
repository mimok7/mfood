'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminGuidePage() {
  const [activeSection, setActiveSection] = useState('restaurant-setup');

  const sections = [
    { id: 'restaurant-setup', title: '레스토랑 설정', icon: '🏪' },
    { id: 'user-management', title: '사용자 관리', icon: '👥' },
    { id: 'menu-management', title: '메뉴 관리', icon: '📋' },
    { id: 'qr-management', title: 'QR 관리', icon: '📱' },
    { id: 'analytics', title: '매출 분석', icon: '📊' },
    { id: 'system-settings', title: '시스템 설정', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 가이드</h1>
              <p className="text-gray-600 mt-2">mfood 시스템의 모든 관리 기능을 마스터하세요</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">관리 영역</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* 레스토랑 설정 */}
              {activeSection === 'restaurant-setup' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🏪 레스토랑 설정</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">기본 정보 관리</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">필수 정보</h4>
                          <ul className="space-y-2 text-gray-600">
                            <li>• 레스토랑 이름 및 브랜드</li>
                            <li>• 주소 및 위치 정보</li>
                            <li>• 연락처 (전화, 이메일)</li>
                            <li>• 영업 시간</li>
                            <li>• 테이블 수 및 배치</li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">브랜딩 설정</h4>
                          <ul className="space-y-2 text-gray-600">
                            <li>• 로고 업로드</li>
                            <li>• 테마 색상 선택</li>
                            <li>• 환영 메시지 설정</li>
                            <li>• 소셜 미디어 링크</li>
                            <li>• 특별 공지사항</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">운영 설정</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-green-700 mb-2">주문 설정</h4>
                          <p className="text-gray-600 text-sm">최소 주문 금액, 주문 마감 시간, 특별 옵션 설정</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-blue-700 mb-2">결제 설정</h4>
                          <p className="text-gray-600 text-sm">결제 방법, 할인 정책, 부가세 설정</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-orange-700 mb-2">알림 설정</h4>
                          <p className="text-gray-600 text-sm">주문 알림, 이메일 설정, SMS 알림</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 사용자 관리 */}
              {activeSection === 'user-management' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 사용자 관리</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-orange-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">권한 체계</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                          <h4 className="font-bold text-red-700 mb-3">관리자 (Admin)</h4>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            <li>• 모든 레스토랑 관리</li>
                            <li>• 사용자 계정 생성/삭제</li>
                            <li>• 시스템 설정 변경</li>
                            <li>• 전체 매출 분석</li>
                            <li>• 백업 및 복원</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
                          <h4 className="font-bold text-blue-700 mb-3">매니저 (Manager)</h4>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            <li>• 소속 레스토랑 관리</li>
                            <li>• 메뉴 및 가격 관리</li>
                            <li>• 직원 계정 관리</li>
                            <li>• 주문 및 주방 관리</li>
                            <li>• 매출 리포트 조회</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
                          <h4 className="font-bold text-green-700 mb-3">직원 (Staff)</h4>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            <li>• 주문 접수 및 처리</li>
                            <li>• 주방 화면 조작</li>
                            <li>• 기본 고객 서비스</li>
                            <li>• 일별 매출 조회</li>
                            <li>• 테이블 상태 관리</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">계정 관리 작업</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">신규 계정 생성</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ol className="space-y-2 text-gray-600">
                              <li>1. 사용자 관리 → 새 사용자 추가</li>
                              <li>2. 기본 정보 입력 (이름, 이메일)</li>
                              <li>3. 권한 레벨 선택</li>
                              <li>4. 소속 레스토랑 지정</li>
                              <li>5. 임시 비밀번호 발송</li>
                            </ol>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">계정 관리</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ul className="space-y-2 text-gray-600">
                              <li>• 권한 변경 및 업데이트</li>
                              <li>• 비밀번호 초기화</li>
                              <li>• 계정 비활성화/활성화</li>
                              <li>• 접속 기록 확인</li>
                              <li>• 활동 로그 모니터링</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 메뉴 관리 */}
              {activeSection === 'menu-management' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 메뉴 관리</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">메뉴 구조 관리</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">카테고리 관리</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ul className="space-y-2 text-gray-600">
                              <li>• 메인 카테고리 생성 (메인, 사이드, 음료 등)</li>
                              <li>• 서브 카테고리 추가</li>
                              <li>• 카테고리 순서 변경</li>
                              <li>• 시즌별 카테고리 관리</li>
                              <li>• 카테고리별 이미지 설정</li>
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">메뉴 아이템 관리</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ul className="space-y-2 text-gray-600">
                              <li>• 메뉴명, 설명, 가격 설정</li>
                              <li>• 고화질 이미지 업로드</li>
                              <li>• 옵션 및 사이즈 설정</li>
                              <li>• 알레르기 정보 표시</li>
                              <li>• 인기 메뉴 마킹</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">고급 메뉴 기능</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-yellow-700 mb-2">재고 관리</h4>
                          <p className="text-gray-600 text-sm">재료 부족 시 자동 품절 처리, 재고 알림</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-orange-700 mb-2">시간대별 메뉴</h4>
                          <p className="text-gray-600 text-sm">브런치, 런치, 디너 메뉴 자동 전환</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-red-700 mb-2">프로모션 관리</h4>
                          <p className="text-gray-600 text-sm">할인 메뉴, 세트 메뉴, 이벤트 메뉴</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">메뉴 최적화 팁</h3>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-blue-700 mb-2">💡 매출 향상 전략</h4>
                          <ul className="space-y-1 text-gray-600 text-sm">
                            <li>• 인기 메뉴를 상단에 배치</li>
                            <li>• 고마진 메뉴 하이라이트</li>
                            <li>• 세트 메뉴로 평균 주문 금액 증대</li>
                            <li>• 계절 메뉴로 신선함 유지</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* QR 관리 */}
              {activeSection === 'qr-management' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📱 QR 관리</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-indigo-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">QR 코드 생성 및 관리</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">QR 코드 생성</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ol className="space-y-2 text-gray-600">
                              <li>1. QR 관리 메뉴 접속</li>
                              <li>2. "새 QR 코드 생성" 클릭</li>
                              <li>3. 테이블 번호 지정</li>
                              <li>4. QR 코드 디자인 선택</li>
                              <li>5. PDF 다운로드 및 인쇄</li>
                            </ol>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">QR 코드 추적</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ul className="space-y-2 text-gray-600">
                              <li>• 테이블별 스캔 횟수</li>
                              <li>• 주문 전환율 분석</li>
                              <li>• 피크 시간대 파악</li>
                              <li>• 문제 있는 QR 코드 식별</li>
                              <li>• 사용 패턴 분석</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">QR 코드 커스터마이징</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="w-16 h-16 bg-cyan-100 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">🎨</div>
                          <h4 className="font-semibold text-cyan-700 mb-2">디자인 옵션</h4>
                          <p className="text-gray-600 text-sm">로고 삽입, 색상 변경, 프레임 스타일</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">📏</div>
                          <h4 className="font-semibold text-purple-700 mb-2">크기 조절</h4>
                          <p className="text-gray-600 text-sm">테이블 크기에 맞는 다양한 사이즈 제공</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">ℹ️</div>
                          <h4 className="font-semibold text-green-700 mb-2">정보 표시</h4>
                          <p className="text-gray-600 text-sm">테이블 번호, 사용법, 연락처 추가</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 매출 분석 */}
              {activeSection === 'analytics' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 매출 분석</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-emerald-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">핵심 성과 지표 (KPI)</h3>
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-emerald-600 mb-2">₩2.5M</div>
                          <p className="text-gray-600">월 매출</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                          <p className="text-gray-600">일 평균 주문</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">₩16K</div>
                          <p className="text-gray-600">평균 주문 금액</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
                          <p className="text-gray-600">고객 만족도</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">리포트 종류</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">매출 리포트</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ul className="space-y-2 text-gray-600">
                              <li>• 일/주/월/년 매출 현황</li>
                              <li>• 시간대별 매출 분석</li>
                              <li>• 결제 방법별 분석</li>
                              <li>• 할인 및 프로모션 효과</li>
                              <li>• 매출 트렌드 예측</li>
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">운영 리포트</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ul className="space-y-2 text-gray-600">
                              <li>• 주문 처리 시간 분석</li>
                              <li>• 테이블 회전율</li>
                              <li>• 직원별 성과 분석</li>
                              <li>• 고객 대기 시간</li>
                              <li>• 취소/환불 현황</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-violet-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">데이터 활용 전략</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-violet-700 mb-2">📈 성장 분석</h4>
                          <p className="text-gray-600 text-sm">매출 성장률, 고객 증가율, 리피트 고객 비율 분석</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-indigo-700 mb-2">🎯 타겟팅</h4>
                          <p className="text-gray-600 text-sm">고객 선호도 분석으로 맞춤형 프로모션 기획</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-blue-700 mb-2">⚡ 효율성</h4>
                          <p className="text-gray-600 text-sm">운영 효율성 개선 포인트 발견 및 최적화</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 시스템 설정 */}
              {activeSection === 'system-settings' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ 시스템 설정</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">보안 설정</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">접근 제어</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ul className="space-y-2 text-gray-600">
                              <li>• 2단계 인증 설정</li>
                              <li>• IP 접근 제한</li>
                              <li>• 세션 타임아웃 설정</li>
                              <li>• 비밀번호 정책</li>
                              <li>• 접속 로그 관리</li>
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700">데이터 보호</h4>
                          <div className="bg-white rounded-lg p-4">
                            <ul className="space-y-2 text-gray-600">
                              <li>• 자동 백업 설정</li>
                              <li>• 데이터 암호화</li>
                              <li>• 개인정보 보호 설정</li>
                              <li>• 감사 로그 관리</li>
                              <li>• 재해 복구 계획</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">알림 및 통합</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-orange-700 mb-2">📧 이메일 설정</h4>
                          <p className="text-gray-600 text-sm">SMTP 설정, 자동 알림, 리포트 발송</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-green-700 mb-2">📱 SMS 설정</h4>
                          <p className="text-gray-600 text-sm">주문 알림, 대기열 상태, 긴급 알림</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-blue-700 mb-2">🔗 API 연동</h4>
                          <p className="text-gray-600 text-sm">외부 시스템 연동, 웹훅 설정</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">시스템 모니터링</h3>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-red-700 mb-2">🚨 장애 대응</h4>
                          <ul className="space-y-1 text-gray-600 text-sm">
                            <li>• 실시간 시스템 상태 모니터링</li>
                            <li>• 자동 장애 감지 및 알림</li>
                            <li>• 성능 임계값 설정</li>
                            <li>• 장애 복구 절차 자동화</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 추가 리소스 */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">🎓 추가 학습 자료</h2>
          <p className="text-lg mb-6">관리자 역량 강화를 위한 추가 리소스</p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/support/user-guide"
              className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              사용자 가이드
            </Link>
            <Link
              href="/support/quick-start"
              className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              빠른 시작
            </Link>
            <Link
              href="/support/technical"
              className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
            >
              기술 지원
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}