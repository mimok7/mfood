export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function RestaurantOverview({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const rid = resolvedParams?.id
  const [{ data: r }, { data: cats }, { data: items }, { data: tables }] = await Promise.all([
    sb.from('restaurants').select('*').eq('id', rid).maybeSingle(),
    sb.from('menu_categories').select('id').eq('restaurant_id', rid),
    sb.from('menu_items').select('id').eq('restaurant_id', rid),
    sb.from('tables').select('id').eq('restaurant_id', rid),
  ])
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{r?.name ?? '레스토랑'}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border rounded p-4"><div className="text-sm text-gray-500">카테고리</div><div className="text-xl font-semibold">{cats?.length ?? 0}</div></div>
        <div className="bg-white border rounded p-4"><div className="text-sm text-gray-500">메뉴</div><div className="text-xl font-semibold">{items?.length ?? 0}</div></div>
        <div className="bg-white border rounded p-4"><div className="text-sm text-gray-500">테이블</div><div className="text-xl font-semibold">{tables?.length ?? 0}</div></div>
      </div>
    </div>
  )
}
