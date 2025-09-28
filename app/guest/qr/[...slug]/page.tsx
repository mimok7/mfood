// @ts-nocheck
import { getOrCreateOpenOrder } from '@/app/order/actions'
import CartClientScript from '@/components/CartClientScript'
import ClientCart from '@/components/ClientCart'
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
  
  // 레스토랑 조회 (관리자 권한 사용)
  const { supabaseAdmin } = await import('@/lib/supabase-admin')
  const adminClient = supabaseAdmin()
  const { data: restaurant } = await adminClient
    .from('restaurants')
    .select('id, name')
    .eq('id', restaurantId)
    .maybeSingle()

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-xl font-bold text-gray-900 mb-4">레스토랑을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">QR 코드를 다시 확인해 주세요.</p>
          <a 
            href="/guest"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  // 테이블 토큰으로 테이블 찾기
  const { data: table } = await adminClient
    .from('tables')
    .select('id, name')
    .eq('token', token)
    .eq('restaurant_id', restaurantId)
    .maybeSingle()
  const isValidTable = !!table
  const tableId = isValidTable ? table.id : token
  const tableLabel = isValidTable ? (table.name ?? `테이블 ${token}`) : `테이블 ${token}`

  // 메뉴 데이터 가져오기 (병렬 처리)
  const [menuItemsResult, categoriesResult] = await Promise.all([
    adminClient
      .from('menu_items')
      .select('id, name, price, category_id')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
    adminClient
      .from('menu_categories')
      .select('id, name, position')
      .eq('restaurant_id', restaurantId)
      .order('position', { ascending: true })
  ])
  
  const items = menuItemsResult.data || []
  const categories = categoriesResult.data || []

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
              {restaurant.name} ({tableLabel})
            </h1>
            <p className="text-base text-gray-600">메뉴를 선택하고 주문해보세요</p>
            

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
                    토큰: {token} | 레스토랑: {restaurant.name}
                  </div>
                </div>
              </div>
            </div>

            {/* 관리자 안내 */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">� 테이블 토큰 Debug</h4>
              <p className="text-sm text-blue-700">
                올바른 QR 코드를 스캔했는지 확인해주세요. 문제가 계속되면 매장 직원에게 문의해 주세요.
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