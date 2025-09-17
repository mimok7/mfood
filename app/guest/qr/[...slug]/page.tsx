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
  const resolvedParams = params ? await params : undefined
  const slug = resolvedParams?.slug || []
  const restaurantId = slug[0] || ''
  const token = slug[1] || ''
  
  return {
    title: `Welcome Food - 테이블 ${token}`,
    description: '맛있는 음식을 주문하세요',
  }
}

export default async function OrderQrPage({ params }: any) {
  const resolvedParams = params ? await params : undefined
  const slug = resolvedParams?.slug || []
  const restaurantId = slug[0] || ''
  const token = slug[1] || ''
  
  const supabase = createSupabaseServer()

  // Find table by token and restaurant_id
  const { data: table } = await supabase
    .from('tables')
    .select('id,name,restaurant_id')
    .eq('token', token)
    .eq('restaurant_id', restaurantId)
    .maybeSingle()

  const isValidTable = !!table
  const tableId = isValidTable ? table.id : token
  const tableLabel = isValidTable ? (table.name ?? `테이블 ${token}`) : `테이블 ${token}`

  let restaurantName = 'Restaurant'
  try {
    const { data: rs } = await supabase
      .from('restaurants')
      .select('name')
      .eq('id', restaurantId)
      .maybeSingle()
    restaurantName = rs?.name ?? restaurantName
  } catch (e) {}

  const { data: items = [] } = await supabase
    .from('menu_items')
    .select('id,name,price,category_id,is_active')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const { data: categories = [] } = await supabase
    .from('menu_categories')
    .select('id,name')
    .eq('restaurant_id', restaurantId)
    .order('position', { ascending: true })

  // QR 전용 강제: 유효한 테이블(token+restaurant 일치)일 때만 주문 초기화 허용
  if (isValidTable) {
    await getOrCreateOpenOrder(tableId, 'qr')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{restaurantName} ({tableLabel})</h1>
            <p className="text-base text-gray-600">메뉴를 선택하고 주문해보세요</p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto px-4 pb-32">
        {!isValidTable ? (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-xl p-4 text-center">
            🔒 QR 인증이 필요합니다. 매장 QR을 스캔해 접속해 주세요.
          </div>
        ) : (
          <ClientOrderPanel tableId={tableId} items={items} categories={categories} />
        )}
      </div>

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
              >
                📋 주문내역
              </button>
            </div>
          </form>
          <CartClientScript />
        </div>
      </div>

      {isValidTable && (
        <QrOrderGuard restaurantId={restaurantId} token={token} tableId={tableId} />
      )}
    </div>
  )
}