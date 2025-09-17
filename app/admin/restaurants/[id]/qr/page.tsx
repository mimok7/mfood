export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PrintButton } from './PrintButton'
import { headers } from 'next/headers'

function Qr({ url, className = "", size = 250 }: { url: string, className?: string, size?: number }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
  return (
    <div className={`bg-white p-2 rounded-lg border-2 border-gray-200 shadow-sm ${className}`}>
      <img src={src} alt="QR 코드" className="w-full h-auto rounded" />
    </div>
  )
}

export default async function RestaurantQrPage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const rid = resolvedParams?.id
  const { data: tables } = await sb.from('tables').select('id, name, token, capacity').eq('restaurant_id', rid).order('created_at')
  const { data: restaurant } = await sb.from('restaurants').select('name, waitlist_token').eq('id', rid).maybeSingle()
  const displayName = restaurant?.name ?? ''
  const safeDisplayName = displayName || `식당 ${rid?.slice(0,8) ?? ''}`
  const hdrs = await headers()
  const proto = hdrs.get('x-forwarded-proto')
    ?? (process.env.NEXT_PUBLIC_BASE_URL?.startsWith('https') ? 'https' : 'http')
  const host = hdrs.get('host')
    ?? (process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\//, '') : 'localhost:3000')
  const base = `${proto}://${host}`

  return (
    <div className='space-y-6'>
      {/* 인쇄 전용 전체 QR 레이아웃 - QR 코드만 표시 */}
      <div className='print:block hidden'>
        {/* Print: chunk tables into pages of 9 (3 cols x 3 rows) */}
        {(() => {
          const list = tables ?? []
          const perPage = 9 // 3 cols x 3 rows
          const pages: any[] = []
          for (let i = 0; i < list.length; i += perPage) pages.push(list.slice(i, i + perPage))
          return (
            <>
              {pages.map((page, pi) => (
                <div
                  key={pi}
                  // ensure page-break after each page except last
                  style={{ pageBreakAfter: pi === pages.length - 1 ? 'auto' : 'always' }}
                  className='print:block w-full p-4'
                >
                  <div className='w-full text-center mb-4'>
                    <h1 className='text-2xl font-semibold text-gray-900'>{displayName}</h1>
                  </div>
                  <div className='grid grid-cols-3 gap-2 items-start'>
                    {page.map((t: any) => {
                      const url = `${base}/guest/qr/${rid}/${t.token}`
                      return (
                        <div key={t.id} className='flex flex-col items-center justify-center p-2 text-center'>
                          <div className='font-semibold text-lg mb-1'>{t.name}</div>
                          <div className='text-sm text-gray-700 mb-1'>{displayName} · {t.capacity || 'N/A'}명</div>
                          <div className='mb-2 text-sm text-gray-600'>{displayName}</div>
                          <Qr url={url} size={180} className='w-44 h-44 p-1' />
                          <div className='text-xs text-gray-600 mt-1'>📱 스캔 후 바로 주문하기</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* append waiting QR as its own page (3 duplicates) */}
              <div style={{ pageBreakAfter: 'auto' }} className='print:block w-full p-4'>
                <div className='w-full text-center mb-4'>
                  <h1 className='text-2xl font-semibold text-gray-900'>{displayName}</h1>
                </div>
                <div className='grid grid-cols-3 gap-4 items-start'>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className='flex flex-col items-center justify-center p-2 text-center'>
                      <div className='font-semibold text-lg mb-1'>{displayName}</div>
                      <div className='text-lg text-gray-700 mb-1'>대기 등록</div>
                      <div className='mb-2 text-sm text-gray-600'>{displayName}</div>
                      <Qr url={`${base}/guest/waitlist?restaurant_id=${rid}${restaurant?.waitlist_token ? `&wt=${restaurant.waitlist_token}` : ''}`} size={180} className='w-44 h-44 p-1' />
                      <div className='text-xs text-gray-600 mt-1'>📝 대기자 등록 후 순번 확인</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )
        })()}
      </div>

      {/* 일반 화면용 레이아웃 - 인쇄 시 완전히 숨김 */}
      <div className='print:hidden'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h1 className='text-3xl font-bold mb-2 flex items-center'>
              <span className='mr-3'>📱</span>
              QR 코드 관리
            </h1>
            <p className='text-green-100'>{displayName} 레스토랑의 테이블 QR 코드를 관리하세요</p>
          </div>
          <PrintButton />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-green-700 bg-opacity-50 rounded-lg p-4 text-sm'>
            <div className='flex items-center mb-2'>
              <span className='mr-2'>ℹ️</span>
              <strong>QR 코드 사용법:</strong>
            </div>
            <ul className='text-green-100 space-y-1 ml-6'>
              <li>• 고객이 QR 코드를 스캔하면 주문 페이지로 이동합니다</li>
              <li>• 각 테이블마다 고유한 QR 코드가 생성됩니다</li>
              <li>• 웨이팅 QR 코드를 입구에 부착하여 대기 등록을 받으세요</li>
              <li>• QR 코드를 인쇄하여 테이블과 입구에 부착하세요</li>
            </ul>
          </div>

          <div className='bg-green-700 bg-opacity-50 rounded-lg p-4 text-sm'>
            <div className='flex items-center mb-1'>
              <span className='mr-2'>🖨️</span>
              <strong>PDF 인쇄 팁:</strong>
            </div>
            <ul className='text-green-100 space-y-1 ml-6 text-xs'>
              <li>• 브라우저 인쇄에서 'PDF로 저장' 선택</li>
              <li>• 용지 방향은 세로로 설정</li>
              <li>• 여백은 최소로 설정하여 QR 코드가 선명하게</li>
              <li>• 고해상도 PDF로 저장하여 인쇄 품질 향상</li>
            </ul>
          </div>
        </div>
      </div>

      {/* QR 코드 그리드 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>🔗</span>
            테이블 QR 코드
          </h2>
          <div className='flex items-center gap-3'>
            <p className='text-sm text-gray-600'>총 {tables?.length ?? 0}개</p>
            <form method="post" action={`/api/admin/restaurants/${rid}/qr/regenerate`} className='print:hidden'>
              <input type="hidden" name="all" value="1" />
              <button type="submit" className='inline-flex items-center gap-2 bg-red-600 text-white text-xs font-semibold py-2 px-3 rounded-md hover:bg-red-700 transition-colors'>
                🔄 전체 새 생성
              </button>
            </form>
            <form method="post" action={`/api/admin/restaurants/${rid}/qr/regenerate`} className='print:hidden'>
              <input type="hidden" name="waitlist" value="1" />
              <button type="submit" className='inline-flex items-center gap-2 bg-orange-600 text-white text-xs font-semibold py-2 px-3 rounded-md hover:bg-orange-700 transition-colors'>
                ⏳ 대기 QR 새 생성
              </button>
            </form>
          </div>
        </div>

        {tables && tables.length > 0 ? (
          <div className='p-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {tables.map(t => {
                const url = `${base}/guest/qr/${rid}/${t.token}`
                return (
                  <div key={t.id} className='bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200'>
                    <div className='text-center mb-4'>
                        <div className='text-sm font-medium text-gray-700 mb-2 bg-white px-3 py-1 rounded-full inline-block'>
                        🏪 {safeDisplayName}
                      </div>
                      <h3 className='text-lg font-semibold text-gray-900 mb-1'>{t.name || `테이블 ${t.id?.slice(0,8) ?? ''}`}</h3>
                      <div className='text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block'>
                        🪑 {t.capacity || 4}명 수용
                      </div>
                    </div>

                    <div className='flex justify-center mb-4'>
                      <Qr url={url} />
                    </div>

                    <div className='text-center mb-4'>
                      <div className='text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg inline-block'>
                        📱 스캔 후 바로 주문하기
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='bg-white border border-gray-200 rounded-lg p-3'>
                        <div className='text-xs text-gray-500 mb-1'>QR URL</div>
                        <div className='text-xs text-blue-600 break-all font-mono bg-blue-50 p-2 rounded'>
                          {url}
                        </div>
                      </div>

                      <div className='flex gap-2 print:hidden'>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className='flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center'
                        >
                          🔗 테스트
                        </a>

                        <form method="post" action={`/api/admin/restaurants/${rid}/qr/regenerate`} className=''>
                          <input type="hidden" name="table_id" value={t.id} />
                          <button type="submit" className='bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors'>
                            🔄 새 생성
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>📱</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>QR 코드가 없습니다</h3>
            <p className='text-gray-500 mb-6'>먼저 테이블을 생성해야 QR 코드를 만들 수 있습니다.</p>
            <a
              href={`/admin/restaurants/${rid}/tables`}
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              🪑 테이블 설정하기
            </a>
          </div>
        )}
      </div>

      {/* 웨이팅 QR 코드 섹션 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>⏳</span>
            웨이팅 QR 코드
          </h2>
          <p className='text-sm text-gray-600 mt-1'>총 {tables?.length ?? 0}개의 테이블 QR 코드가 생성되었습니다</p>
        </div>

        <div className='p-6'>
          <div className='max-w-md mx-auto'>
            <div className='bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200'>
              <div className='text-center mb-4'>
                <div className='text-sm font-medium text-gray-700 mb-2 bg-white px-3 py-1 rounded-full inline-block'>
                  🏪 {displayName}
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>대기 등록</h3>
                <div className='text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block'>
                  📝 웨이팅 등록
                </div>
              </div>

              <div className='flex justify-center mb-4'>
                <Qr url={`${base}/guest/waitlist?restaurant_id=${rid}${restaurant?.waitlist_token ? `&wt=${restaurant.waitlist_token}` : ''}`} />
              </div>

              <div className='text-center mb-4'>
                <div className='text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded-lg inline-block'>
                  📝 대기자 등록 후 순번 확인
                </div>
              </div>

              <div className='space-y-3'>
                <div className='bg-white border border-gray-200 rounded-lg p-3'>
                  <div className='text-xs text-gray-500 mb-1'>웨이팅 URL</div>
                  <div className='text-xs text-orange-600 break-all font-mono bg-orange-50 p-2 rounded'>
                    {`${base}/guest/waitlist?restaurant_id=${rid}${restaurant?.waitlist_token ? `&wt=${restaurant.waitlist_token}` : ''}`}
                  </div>
                </div>

                <div className='flex gap-2 print:hidden'>
                  <a
                    href={`${base}/guest/waitlist?restaurant_id=${rid}${restaurant?.waitlist_token ? `&wt=${restaurant.waitlist_token}` : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-full bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-center'
                  >
                    🧑‍🤝‍🧑 테스트
                  </a>
                </div>
              </div>
            </div>

            <div className='mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4'>
              <h4 className='font-medium text-orange-900 mb-2 flex items-center'>
                <span className='mr-2'>💡</span>
                사용 팁
              </h4>
              <ul className='text-sm text-orange-800 space-y-1'>
                <li>• 레스토랑 입구에 이 QR 코드를 부착하세요</li>
                <li>• 고객이 스캔하면 대기자 등록 페이지로 이동합니다</li>
                <li>• 대기 순번과 예상 대기 시간을 안내합니다</li>
                <li>• 테이블이 준비되면 SMS로 알림을 보낼 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
