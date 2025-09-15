import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'

export default async function AdminRestaurantsPage() {
  await requireRole('admin')
  const sb = supabaseAdmin()
  const { data: restaurants } = await sb.from('restaurants').select('id, name, slug').order('created_at')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">레스토랑 선택</h1>
      <ul className="grid gap-3">
        {(restaurants ?? []).map(r => (
          <li key={r.id} className="bg-white rounded border p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-gray-500">/{r.slug}</div>
            </div>
            <a className="px-3 py-1.5 rounded bg-blue-600 text-white" href={`/admin/restaurants/${r.id}`}>관리 이동</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
