import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'
import RestaurantsEditor from './RestaurantsEditor'

export default async function AdminRestaurantsPage() {
  await requireRole('admin')
  const sb = supabaseAdmin()
  const { data: restaurants } = await sb.from('restaurants').select('id, name, slug').order('created_at')
  return (
    <div className="w-full">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">🏪 레스토랑 관리</h1>
        <p className="text-blue-100 text-lg">다중 식당을 손쉽게 관리하고 설정하세요</p>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8">
          {/* server->client: pass initial list */}
          {/* @ts-ignore */}
          <RestaurantsEditor initialRestaurants={restaurants ?? []} />
        </div>
      </div>
    </div>
  )
}
