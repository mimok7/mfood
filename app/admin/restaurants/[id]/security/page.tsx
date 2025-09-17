export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

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

        <div className='p-6 space-y-6'>
          {/* 토큰 만료 설정 */}
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <h3 className='text-lg font-medium text-yellow-900 mb-3 flex items-center'>
              <span className='mr-2'>⏰</span>
              토큰 만료 설정
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium text-gray-900'>자동 토큰 재생성</div>
                  <div className='text-sm text-gray-600'>지정된 기간마다 QR 코드 토큰을 자동으로 재생성합니다</div>
                </div>
                <div className='flex items-center space-x-3'>
                  <select className='border border-gray-300 rounded-lg px-3 py-2 text-sm'>
                    <option value="never">사용 안함</option>
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                    <option value="monthly">매월</option>
                  </select>
                  <button className='bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium'>
                    적용
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 접근 제한 설정 */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <h3 className='text-lg font-medium text-blue-900 mb-3 flex items-center'>
              <span className='mr-2'>🚫</span>
              접근 제한 설정
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium text-gray-900'>IP 주소 제한</div>
                  <div className='text-sm text-gray-600'>특정 IP 주소에서만 접근을 허용합니다</div>
                </div>
                <div className='flex items-center space-x-3'>
                  <span className='text-sm text-gray-500'>비활성화됨</span>
                  <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'>
                    설정
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium text-gray-900'>시간대 제한</div>
                  <div className='text-sm text-gray-600'>특정 시간대에만 QR 코드 접근을 허용합니다</div>
                </div>
                <div className='flex items-center space-x-3'>
                  <span className='text-sm text-gray-500'>비활성화됨</span>
                  <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'>
                    설정
                  </button>
                </div>
              </div>
            </div>
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
          <div className='space-y-4'>
            {tables?.map(table => (
              <div key={table.id} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200'>
                <div className='flex items-center space-x-4'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-semibold'>🪑</span>
                  </div>
                  <div>
                    <div className='font-medium text-gray-900'>{table.name}</div>
                    <div className='text-sm text-gray-500'>생성일: {new Date(table.created_at).toLocaleDateString('ko-KR')}</div>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <div className='text-xs bg-gray-200 px-2 py-1 rounded font-mono'>
                    {table.token?.substring(0, 8)}...
                  </div>
                  <form method="post" action={`/api/admin/restaurants/${rid}/qr/regenerate`}>
                    <input type="hidden" name="table_id" value={table.id} />
                    <button type="submit" className='bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors'>
                      🔄 재생성
                    </button>
                  </form>
                </div>
              </div>
            ))}

            {(!tables || tables.length === 0) && (
              <div className='text-center py-8 text-gray-500'>
                <div className='text-4xl mb-2'>🔑</div>
                <div>관리할 토큰이 없습니다</div>
              </div>
            )}
          </div>

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
          <div className='space-y-3'>
            <div className='flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                  <span className='text-green-600'>✓</span>
                </div>
                <div>
                  <div className='font-medium text-green-900'>관리자 로그인</div>
                  <div className='text-sm text-green-700'>2024-01-15 09:30:15</div>
                </div>
              </div>
              <span className='text-xs bg-green-200 text-green-800 px-2 py-1 rounded'>성공</span>
            </div>

            <div className='flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center'>
                  <span className='text-yellow-600'>⚠</span>
                </div>
                <div>
                  <div className='font-medium text-yellow-900'>비정상 접근 시도</div>
                  <div className='text-sm text-yellow-700'>2024-01-14 23:45:22</div>
                </div>
              </div>
              <span className='text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded'>경고</span>
            </div>

            <div className='flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                  <span className='text-blue-600'>🔄</span>
                </div>
                <div>
                  <div className='font-medium text-blue-900'>토큰 재생성</div>
                  <div className='text-sm text-blue-700'>2024-01-10 14:20:05</div>
                </div>
              </div>
              <span className='text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded'>정보</span>
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
