// @ts-nocheck
import { getOrCreateOpenOrder } from '@/app/order/actions'
import CartClientScript from '@/components/CartClientScript'
import ClientCart from '@/components/ClientCart'
import { createSupabaseServer } from '@/lib/supabase-server'
import ClientOrderPanel from '@/components/ClientOrderPanel'
import QrOrderGuard from '@/components/QrOrderGuard'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  let resolvedParams;
  try {
    resolvedParams = params ? await params : undefined;
  } catch (error) {
    resolvedParams = { slug: [] };
  }
  const slug = resolvedParams?.slug || []
  const restaurantId = slug[0] || ''
  const token = slug[1] || ''
  
  return {
    title: `mfood - 테이블 ${token}`,
    description: '맛있는 음식을 주문하세요',
  }
}

export default async function OrderQrPage({ params }: any) {
  let resolvedParams;
  try {
    resolvedParams = params ? await params : undefined;
  } catch (error) {
    console.error('Params resolution error:', error);
    resolvedParams = { slug: [] };
  }
  const slug = resolvedParams?.slug || []
  const restaurantId = slug[0] || ''
  const token = slug[1] || ''
  
  // 디버깅 정보
  const debugInfo = {
    restaurantId, 
    token, 
    slug, 
    fullSlug: resolvedParams?.slug,
    rawParams: params,
    resolvedParams,
    slugLength: slug.length,
    expectedRestaurantId: 'efb8dcee-fec0-41a0-9056-bddba237b2f7',
    isRestaurantIdMatch: restaurantId === 'efb8dcee-fec0-41a0-9056-bddba237b2f7'
  }
  
  console.log('QR Access Debug:', debugInfo)
  
  const supabase = createSupabaseServer()

  // 레스토랑 존재 여부 먼저 확인 (RLS 우회를 위해 service role 사용)
  const { createClient } = await import('@supabase/supabase-js')
  const supabasePublic = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // 먼저 일반 쿼리 시도
  const { data: restaurant, error: restaurantError } = await supabasePublic
    .from('restaurants')
    .select('id, name, slug')
    .eq('id', restaurantId)
    .maybeSingle()
  
  // 만약 결과가 없으면 관리자 권한으로 다시 시도
  let adminRestaurant = null
  if (!restaurant) {
    const { supabaseAdmin } = await import('@/lib/supabase-admin')
    const adminClient = supabaseAdmin()
    const { data: adminResult } = await adminClient
      .from('restaurants')
      .select('id, name, slug')
      .eq('id', restaurantId)
      .maybeSingle()
    adminRestaurant = adminResult
  }
  
  // 디버깅: 레스토랑 조회 결과 로그
  console.log('Restaurant Query:', { restaurantId, restaurant, restaurantError, adminRestaurant })
  
  // 모든 레스토랑 조회 (디버깅용)
  const { data: allRestaurants } = await supabasePublic
    .from('restaurants')
    .select('id, name, slug')
    .limit(5)
  
  console.log('All Restaurants:', allRestaurants)

  // 실제 사용할 레스토랑 데이터 결정
  const finalRestaurant = restaurant || adminRestaurant

  if (!finalRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto">
          <div className="text-6xl mb-4 text-center">🏪</div>
          <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">레스토랑을 찾을 수 없습니다</h1>
          
          {/* 스마트폰용 디버깅 정보 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h2 className="font-bold text-red-800 mb-2">🔍 Debug Info (스마트폰용)</h2>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-2 rounded border">
                <strong>Restaurant ID:</strong><br/>
                <code className="text-xs break-all">{restaurantId}</code>
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Token:</strong><br/>
                <code className="text-xs break-all">{token}</code>
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Slug Array:</strong><br/>
                <code className="text-xs">[{slug.map(s => `"${s}"`).join(', ')}]</code>
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Slug Length:</strong> {debugInfo.slugLength}
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Match Expected:</strong> {debugInfo.isRestaurantIdMatch ? '✅ YES' : '❌ NO'}
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Restaurant Error:</strong><br/>
                <code className="text-xs">{restaurantError?.message || 'null'}</code>
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Admin Query Result:</strong><br/>
                <code className="text-xs">{adminRestaurant ? 'Found with admin' : 'Not found'}</code>
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>RLS Issue:</strong><br/>
                <code className="text-xs">{!restaurant && adminRestaurant ? '✅ RLS 차단됨' : '❌ 다른 문제'}</code>
              </div>
            </div>
          </div>

          {/* 사용 가능한 레스토랑 목록 */}
          {allRestaurants && allRestaurants.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-blue-800 mb-2">📋 사용 가능한 레스토랑:</h3>
              {allRestaurants.map((r, i) => (
                <div key={i} className="bg-white p-2 rounded border mb-2 text-sm">
                  <div><strong>Name:</strong> {r.name}</div>
                  <div><strong>ID:</strong> <code className="text-xs break-all">{r.id}</code></div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <a 
              href={`/guest/qr/${slug.join('/')}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 새로고침
            </a>
          </div>
        </div>
      </div>
    )
  }

  // 테이블 토큰으로 테이블 찾기
  const { data: table, error: tableError } = await supabase
    .from('tables')
    .select('id, name, restaurant_id, token')
    .eq('token', token)
    .eq('restaurant_id', restaurantId)
    .maybeSingle()
  
  // 디버깅: 테이블 조회 결과 로그
  console.log('Table Query:', { token, restaurantId, table, tableError })

  const isValidTable = !!table
  const tableId = isValidTable ? table.id : token
  const tableLabel = isValidTable ? (table.name ?? `테이블 ${token}`) : `테이블 ${token}`

  // 메뉴 데이터 가져오기
  const { data: items = [] } = await supabase
    .from('menu_items')
    .select('id, name, price, category_id, is_active')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const { data: categories = [] } = await supabase
    .from('menu_categories')
    .select('id, name, position')
    .eq('restaurant_id', restaurantId)
    .order('position', { ascending: true })

  // QR 전용 강제: 유효한 테이블일 때만 주문 초기화
  if (isValidTable) {
    try {
      await getOrCreateOpenOrder(tableId, 'qr')
    } catch (error) {
      console.error('주문 초기화 실패:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {finalRestaurant.name} ({tableLabel})
            </h1>
            <p className="text-base text-gray-600">메뉴를 선택하고 주문해보세요</p>
            
            {/* 디버깅 정보 (개발 환경에서만 표시) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded mt-2">
                Debug: Restaurant={restaurantId}, Token={token}, Valid={isValidTable ? '✅' : '❌'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-screen-sm mx-auto px-4 pb-32">
        {!isValidTable ? (
          <div className="mt-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
              <div className="flex items-center">
                <div className="text-yellow-400 text-2xl mr-3">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">QR 인증 필요</h3>
                  <p className="text-yellow-700 mt-1">
                    매장에 비치된 테이블 QR 코드를 스캔하여 접속해 주세요.
                  </p>
                  <div className="text-sm text-yellow-600 mt-2">
                    토큰: {token} | 레스토랑: {finalRestaurant.name}
                  </div>
                </div>
              </div>
            </div>

            {/* 테이블 토큰 생성 안내 (관리자용) */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">📋 관리자 안내</h4>
              <p className="text-sm text-blue-700">
                테이블 토큰이 설정되지 않았습니다. 관리자 페이지에서 QR 코드를 생성하세요.
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">메뉴 준비 중</h2>
            <p className="text-gray-600">아직 등록된 메뉴가 없습니다.</p>
          </div>
        ) : (
          <div className="mt-6">
            <ClientOrderPanel 
              tableId={tableId} 
              items={items} 
              categories={categories} 
            />
          </div>
        )}
      </div>

      {/* 하단 주문 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-screen-sm mx-auto p-4">
          <form data-cart-form="true" data-table-id={tableId} className="space-y-4">
            <div className="hidden">
              <ClientCart initialItems={[]} tableId={tableId} />
            </div>
            <input type="hidden" name="cart" value="[]" />

            <div className="flex gap-3">
              <button
                type="button"
                data-action="toggle-order-history"
                className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-lg transition-all duration-200 active:scale-95 text-base border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isValidTable}
              >
                📋 주문내역
              </button>
            </div>
          </form>
          <CartClientScript />
        </div>
      </div>

      {/* QR 가드 컴포넌트 */}
      {isValidTable && (
        <QrOrderGuard 
          restaurantId={restaurantId} 
          token={token} 
          tableId={tableId} 
        />
      )}
    </div>
  )
}