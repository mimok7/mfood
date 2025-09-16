export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function RestaurantOverview({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const rid = resolvedParams?.id
  const [{ data: r }, { data: cats }, { data: items }, { data: orders }, { data: waitlist }, { data: kitchen }] = await Promise.all([
    sb.from('restaurants').select('*').eq('id', rid).maybeSingle(),
    sb.from('menu_categories').select('id').eq('restaurant_id', rid),
    sb.from('menu_items').select('id').eq('restaurant_id', rid),
    sb.from('orders').select('id, status').eq('restaurant_id', rid),
    sb.from('waitlist').select('id').eq('restaurant_id', rid),
    sb.from('kitchen_queue').select('id').eq('restaurant_id', rid),
  ])

  const ordersList = (orders ?? []) as { id: string; status?: string }[]
  const waitlistList = (waitlist ?? []) as import('@/lib/types').WaitlistRow[]
  const kitchenList = (kitchen ?? []) as { id: string; status?: string }[]

  const activeOrders = ordersList.filter(o => o.status !== 'completed')?.length ?? 0
  const pendingWaitlist = waitlistList.filter(w => w.status === 'waiting')?.length ?? 0
  const pendingKitchen = kitchenList.filter(k => k.status === 'pending')?.length ?? 0

  return (
    <div className="w-full -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12 space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">{r?.name ?? '레스토랑'}</h1>
        <p className="text-blue-100 text-lg">{r?.address || '주소 미등록'}</p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <span className="bg-white/20 px-4 py-2 rounded-full">📞 {r?.phone || '전화 미등록'}</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">✉️ {r?.email || '이메일 미등록'}</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">🏷️ {r?.slug || '슬러그 미설정'}</span>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">메뉴 카테고리</div>
              <div className="text-3xl font-bold text-gray-900">{cats?.length ?? 0}</div>
            </div>
            <div className="text-5xl">📂</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">메뉴 아이템</div>
              <div className="text-3xl font-bold text-gray-900">{items?.length ?? 0}</div>
            </div>
            <div className="text-5xl">🍽️</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">진행중 주문</div>
              <div className="text-3xl font-bold text-orange-600">{activeOrders}</div>
            </div>
            <div className="text-5xl">📋</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">대기중 손님</div>
              <div className="text-3xl font-bold text-blue-600">{pendingWaitlist}</div>
            </div>
            <div className="text-5xl">⏳</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">주방 대기</div>
              <div className="text-3xl font-bold text-red-600">{pendingKitchen}</div>
            </div>
            <div className="text-5xl">👨‍🍳</div>
          </div>
        </div>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">레스토랑 정보</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">테이블 수:</span>
              <span className="font-bold text-lg text-gray-900">{r?.table_count || 0}개</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">기본 좌석:</span>
              <span className="font-bold text-lg text-gray-900">{r?.default_table_capacity || 4}명</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">등록일:</span>
              <span className="font-bold text-lg text-gray-900">{r?.created_at ? new Date(r.created_at).toLocaleDateString('ko-KR') : '정보 없음'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">운영 현황</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">총 주문:</span>
              <span className="font-bold text-lg text-green-600">{orders?.length ?? 0}건</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">완료된 주문:</span>
              <span className="font-bold text-lg text-blue-600">{orders?.filter(o => o.status === 'completed').length ?? 0}건</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">총 대기:</span>
              <span className="font-bold text-lg text-purple-600">{waitlist?.length ?? 0}명</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">주방 처리:</span>
              <span className="font-bold text-lg text-indigo-600">{kitchen?.length ?? 0}건</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
