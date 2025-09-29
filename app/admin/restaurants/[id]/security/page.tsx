export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'
import TimeRestrictionSettings from './TimeRestrictionSettings'

export default async function SecurityPage({ params }: { params?: Promise<{ id: string }> }) {
  const resolvedParams = params ? await params : undefined
  const rid = resolvedParams?.id

  // 보안 관련 데이터 조회 (실제로는 DB에서 가져와야 함)
  const { data: restaurant } = await supabaseAdmin()
    .from('restaurants')
    .select('name, created_at')
    .eq('id', rid)
    .maybeSingle()

  const safeRestaurantName = restaurant?.name || `식당 ${rid?.slice(0,8) ?? ''}`

  const { data: tables } = await supabaseAdmin()
    .from('tables')
    .select('id, name, token, created_at')
    .eq('restaurant_id', rid)
    .order('created_at')

  // 보안 로그 데이터 조회 (최근 주문 활동)
  const { data: securityLogs } = await supabaseAdmin()
    .from('orders')
    .select(`
      id,
      created_at,
      status,
      total_amount,
      table_id,
      tables!inner(table_number)
    `)
    .eq('restaurant_id', rid)
    .order('created_at', { ascending: false })
    .limit(6)

  // 사용자 활동 로그 조회
  const { data: userLogs } = await supabaseAdmin()
    .from('user_profiles')
    .select('id, updated_at, role')
    .eq('restaurant_id', rid)
    .order('updated_at', { ascending: false })
    .limit(3)

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2 flex items-center'>
          <span className='mr-3'>🔒</span>
          보안 설정
        </h1>
  <p className='text-red-100 mb-4'>{safeRestaurantName} 레스토랑의 보안 설정을 관리하세요</p>
        <div className='bg-red-700 bg-opacity-50 rounded-lg p-4 text-sm'>
          <div className='flex items-center mb-2'>
            <span className='mr-2'>⚠️</span>
            <strong>보안 중요성:</strong>
          </div>
          <ul className='text-red-100 space-y-1 ml-6'>
            <li>• QR 코드 URL을 보호하여 무단 접근을 방지하세요</li>
            <li>• 토큰을 정기적으로 재생성하여 보안을 유지하세요</li>
            <li>• 접근 로그를 모니터링하여 이상 징후를 감지하세요</li>
            <li>• 민감한 설정은 주기적으로 검토하세요</li>
          </ul>
        </div>
      </div>

      {/* URL 보호 설정 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>🔗</span>
            URL 보호 설정
          </h2>
          <p className='text-sm text-gray-600 mt-1'>QR 코드 URL의 보안 수준을 설정합니다</p>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* 토큰 만료 설정 */}
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
              <div className='text-center mb-4'>
                <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                  <span className='text-yellow-600 text-xl'>⏰</span>
                </div>
                <h3 className='text-lg font-medium text-yellow-900'>토큰 만료 설정</h3>
              </div>
              <div className='space-y-3'>
                <div>
                  <div className='font-medium text-gray-900 text-center mb-2'>자동 토큰 재생성</div>
                  <div className='text-sm text-gray-600 text-center mb-3'>지정된 기간마다 QR 코드 토큰을 자동으로 재생성합니다</div>
                  <div className='space-y-2'>
                    <select className='border border-gray-300 rounded-lg px-3 py-2 text-sm w-full'>
                      <option value="never">사용 안함</option>
                      <option value="daily">매일</option>
                      <option value="weekly">매주</option>
                      <option value="monthly">매월</option>
                    </select>
                    <button className='bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium w-full'>
                      적용
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* URL 표시 제한 */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='text-center mb-4'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                  <span className='text-blue-600 text-xl'>🔗</span>
                </div>
                <h3 className='text-lg font-medium text-blue-900'>URL 표시 제한</h3>
              </div>
              <div className='space-y-4'>
                <div className='text-center'>
                  <div className='font-medium text-gray-900 mb-2'>하위 URL 숨기기</div>
                  <div className='text-sm text-gray-600 mb-3'>QR 코드 URL의 하위 경로를 숨겨 보안을 강화합니다</div>
                </div>

                {/* URL 숨김 토글 */}
                <div className='flex items-center justify-center space-x-3 mb-4'>
                  <span className='text-sm text-gray-600'>표시</span>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input type='checkbox' className='sr-only peer' defaultChecked={true} />
                    <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'></div>
                  </label>
                  <span className='text-sm text-gray-600'>숨김</span>
                </div>

                {/* URL 예시 */}
                <div className='space-y-3'>
                  <div className='bg-white border border-gray-300 rounded-lg p-3'>
                    <div className='text-xs font-medium text-gray-700 mb-2'>현재 URL (숨김 설정)</div>
                    <div className='font-mono text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded border break-all'>
                      https://mfood.vercel.app/qr/***
                    </div>
                  </div>
                  
                  <div className='bg-white border border-gray-300 rounded-lg p-3'>
                    <div className='text-xs font-medium text-gray-700 mb-2'>전체 URL (표시 설정)</div>
                    <div className='font-mono text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border break-all'>
                      https://mfood.vercel.app/qr/abc123xyz789
                    </div>
                  </div>
                </div>

                {/* 보안 설명 */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                  <div className='text-sm font-medium text-blue-900 mb-2 flex items-center'>
                    <span className='mr-2'>💡</span>
                    보안 효과
                  </div>
                  <ul className='text-xs text-blue-700 space-y-1'>
                    <li>• 토큰 정보가 URL에 노출되지 않음</li>
                    <li>• QR 코드 스캔 외 접근 차단</li>
                    <li>• 브라우저 주소창에서 경로 숨김</li>
                    <li>• 무단 URL 공유 방지</li>
                  </ul>
                </div>

                {/* 적용 버튼 */}
                <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full'>
                  URL 숨김 적용
                </button>
              </div>
            </div>

            {/* 시간대 제한 */}
            <TimeRestrictionSettings restaurantId={rid || ''} />
          </div>
        </div>
      </div>

      {/* 토큰 관리 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>🔑</span>
            토큰 관리
          </h2>
          <p className='text-sm text-gray-600 mt-1'>QR 코드 토큰을 관리하고 재생성합니다</p>
        </div>

        <div className='p-6'>
          {(!tables || tables.length === 0) ? (
            <div className='text-center py-8 text-gray-500'>
              <div className='text-4xl mb-2'>🔑</div>
              <div>관리할 토큰이 없습니다</div>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
              {tables.map(table => (
                <div key={table.id} className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4'>
                  {/* 테이블 아이콘 */}
                  <div className='flex justify-center mb-3'>
                    <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                      <span className='text-blue-600 text-xl'>🪑</span>
                    </div>
                  </div>

                  {/* 테이블 정보 */}
                  <div className='text-center mb-4'>
                    <h3 className='font-medium text-gray-900 text-lg mb-1'>{table.name}</h3>
                    <p className='text-xs text-gray-500'>
                      생성일: {new Date(table.created_at).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* 토큰 표시 */}
                  <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>토큰</label>
                    <div className='bg-gray-50 px-2 py-1 rounded text-xs font-mono text-gray-600 text-center'>
                      {table.token?.substring(0, 8)}...
                    </div>
                  </div>

                  {/* 재생성 버튼 */}
                  <form method="post" action={`/api/admin/restaurants/${rid}/qr/regenerate`}>
                    <input type="hidden" name="table_id" value={table.id} />
                    <button 
                      type="submit" 
                      className='w-full bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1'
                    >
                      🔄 재생성
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <h4 className='font-medium text-red-900 mb-2 flex items-center'>
                <span className='mr-2'>⚠️</span>
                토큰 재생성 주의사항
              </h4>
              <ul className='text-sm text-red-800 space-y-1'>
                <li>• 토큰을 재생성하면 기존 QR 코드가 무효화됩니다</li>
                <li>• 새 QR 코드를 다시 인쇄하여 부착해야 합니다</li>
                <li>• 재생성 즉시 모든 고객의 접근이 차단됩니다</li>
                <li>• 보안을 위해 정기적으로 토큰을 재생성하는 것을 권장합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 보안 로그 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>📊</span>
            보안 로그
          </h2>
          <p className='text-sm text-gray-600 mt-1'>접근 기록 및 보안 이벤트를 확인합니다</p>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* 최근 주문 활동 로그 */}
            {securityLogs && securityLogs.length > 0 ? (
              securityLogs.map((log) => {
                const statusConfig = {
                  pending: { bg: 'bg-orange-50', border: 'border-orange-200', icon: '⏳', color: 'orange', text: '대기중' },
                  preparing: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '👨‍🍳', color: 'blue', text: '준비중' },
                  ready: { bg: 'bg-green-50', border: 'border-green-200', icon: '✅', color: 'green', text: '완료' },
                  delivered: { bg: 'bg-purple-50', border: 'border-purple-200', icon: '🍽️', color: 'purple', text: '제공완료' },
                  cancelled: { bg: 'bg-red-50', border: 'border-red-200', icon: '❌', color: 'red', text: '취소' }
                };
                
                const config = statusConfig[log.status as keyof typeof statusConfig] || statusConfig.pending;
                
                return (
                  <div key={log.id} className={`${config.bg} ${config.border} rounded-lg p-4`}>
                    <div className='flex items-center justify-center mb-3'>
                      <div className={`w-12 h-12 bg-${config.color}-100 rounded-full flex items-center justify-center`}>
                        <span className={`text-${config.color}-600 text-xl`}>{config.icon}</span>
                      </div>
                    </div>
                    <div className='text-center'>
                      <h3 className={`font-medium text-${config.color}-900 mb-1`}>
                        테이블 {log.tables?.table_number || 'N/A'}
                      </h3>
                      <p className={`text-sm text-${config.color}-700 mb-2`}>
                        {new Date(log.created_at).toLocaleString('ko-KR', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <div className='space-y-1'>
                        <span className={`inline-block text-xs bg-${config.color}-200 text-${config.color}-800 px-2 py-1 rounded-full`}>
                          {config.text}
                        </span>
                        <div className={`text-xs text-${config.color}-600 font-medium`}>
                          ₩{log.total_amount?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='col-span-3 bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
                <div className='text-gray-400 text-4xl mb-4'>📊</div>
                <h3 className='font-medium text-gray-600 mb-2'>활동 기록이 없습니다</h3>
                <p className='text-sm text-gray-500'>최근 보안 관련 활동이 기록되면 여기에 표시됩니다.</p>
              </div>
            )}

            
            {/* 사용자 활동 로그 */}
            {userLogs && userLogs.length > 0 && userLogs.slice(0, 5).map((user, index) => {
              const roleConfig = {
                admin: { bg: 'bg-purple-50', border: 'border-purple-200', icon: '👑', color: 'purple', text: '관리자' },
                manager: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '👨‍💼', color: 'blue', text: '매니저' },
                guest: { bg: 'bg-green-50', border: 'border-green-200', icon: '👤', color: 'green', text: '게스트' }
              };
              
              const config = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.guest;
              
              return (
                <div key={`${user.id}-${index}`} className={`${config.bg} ${config.border} rounded-lg p-4`}>
                  <div className='flex items-center justify-center mb-3'>
                    <div className={`w-12 h-12 bg-${config.color}-100 rounded-full flex items-center justify-center`}>
                      <span className={`text-${config.color}-600 text-xl`}>{config.icon}</span>
                    </div>
                  </div>
                  <div className='text-center'>
                    <h3 className={`font-medium text-${config.color}-900 mb-1`}>{config.text} 활동</h3>
                    <p className={`text-sm text-${config.color}-700 mb-2`}>
                      {new Date(user.updated_at).toLocaleString('ko-KR', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <span className={`inline-block text-xs bg-${config.color}-200 text-${config.color}-800 px-2 py-1 rounded-full`}>
                      활동
                    </span>
                  </div>
                </div>
              );
            })}

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-center justify-center mb-3'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                  <span className='text-blue-600 text-xl'>🔄</span>
                </div>
              </div>
              <div className='text-center'>
                <h3 className='font-medium text-blue-900 mb-1'>토큰 재생성</h3>
                <p className='text-sm text-blue-700 mb-2'>2024-01-10 14:20:05</p>
                <span className='inline-block text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full'>정보</span>
              </div>
            </div>

            {/* 추가 로그 아이템들 */}
            <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
              <div className='flex items-center justify-center mb-3'>
                <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                  <span className='text-purple-600 text-xl'>👤</span>
                </div>
              </div>
              <div className='text-center'>
                <h3 className='font-medium text-purple-900 mb-1'>사용자 생성</h3>
                <p className='text-sm text-purple-700 mb-2'>2024-01-08 16:15:30</p>
                <span className='inline-block text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full'>정보</span>
              </div>
            </div>

            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-center justify-center mb-3'>
                <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                  <span className='text-red-600 text-xl'>�</span>
                </div>
              </div>
              <div className='text-center'>
                <h3 className='font-medium text-red-900 mb-1'>로그인 실패</h3>
                <p className='text-sm text-red-700 mb-2'>2024-01-07 11:22:18</p>
                <span className='inline-block text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full'>실패</span>
              </div>
            </div>

            <div className='bg-indigo-50 border border-indigo-200 rounded-lg p-4'>
              <div className='flex items-center justify-center mb-3'>
                <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center'>
                  <span className='text-indigo-600 text-xl'>⚙️</span>
                </div>
              </div>
              <div className='text-center'>
                <h3 className='font-medium text-indigo-900 mb-1'>설정 변경</h3>
                <p className='text-sm text-indigo-700 mb-2'>2024-01-05 13:45:12</p>
                <span className='inline-block text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full'>정보</span>
              </div>
            </div>
          </div>

          <div className='mt-6 text-center'>
            <button className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium'>
              더 많은 로그 보기
            </button>
          </div>
        </div>
      </div>

      {/* 보안 권장사항 */}
      <div className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-bold mb-4 flex items-center'>
          <span className='mr-2'>💡</span>
          보안 권장사항
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-white bg-opacity-10 rounded-lg p-4'>
            <h3 className='font-semibold mb-2'>🔐 강력한 인증</h3>
            <p className='text-sm text-purple-100'>관리자 계정에 강력한 비밀번호를 사용하고, 2FA를 활성화하세요.</p>
          </div>
          <div className='bg-white bg-opacity-10 rounded-lg p-4'>
            <h3 className='font-semibold mb-2'>📱 QR 코드 관리</h3>
            <p className='text-sm text-purple-100'>QR 코드를 정기적으로 재생성하고, 인쇄본을 안전하게 보관하세요.</p>
          </div>
          <div className='bg-white bg-opacity-10 rounded-lg p-4'>
            <h3 className='font-semibold mb-2'>👀 모니터링</h3>
            <p className='text-sm text-purple-100'>접근 로그를 정기적으로 확인하고, 이상 징후를 모니터링하세요.</p>
          </div>
          <div className='bg-white bg-opacity-10 rounded-lg p-4'>
            <h3 className='font-semibold mb-2'>🔄 정기 업데이트</h3>
            <p className='text-sm text-purple-100'>시스템과 보안 패치를 정기적으로 업데이트하세요.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
