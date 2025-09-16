export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function RestaurantSettingsPage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const { data: r } = await sb.from('restaurants').select('*').eq('id', resolvedParams?.id).maybeSingle()

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">⚙️ 레스토랑 설정</h1>
        <p className="text-green-100">레스토랑의 기본 정보를 설정하세요</p>
      </div>

      <form action={`/api/admin/restaurants/${resolvedParams?.id}/settings`} method="post" className="space-y-6">
        {/* 기본 정보 섹션 */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🏢</span>
              기본 정보
            </h2>
            <p className="text-sm text-gray-600 mt-1">레스토랑의 기본적인 정보를 설정합니다.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상호명 <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  defaultValue={r?.name ?? ''}
                  placeholder="레스토랑 이름"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  웹 주소
                </label>
                <input
                  name="slug"
                  defaultValue={r?.slug ?? ''}
                  placeholder="restaurant-name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">영문, 숫자, 하이픈(-)만 사용 가능</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <input
                  name="phone"
                  defaultValue={(r as any)?.phone ?? ''}
                  placeholder="02-123-4567"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={(r as any)?.email ?? ''}
                  placeholder="contact@restaurant.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소
                </label>
                <input
                  name="address"
                  defaultValue={(r as any)?.address ?? ''}
                  placeholder="서울시 강남구 역삼동 123-45"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
          >
            <span className="mr-2">💾</span>
            설정 저장
          </button>
        </div>
      </form>
    </div>
  )
}
