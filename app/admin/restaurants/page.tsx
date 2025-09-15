import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'
import RestaurantsEditor from './RestaurantsEditor'

export default async function AdminRestaurantsPage() {
  await requireRole('admin')
  const sb = supabaseAdmin()
  const { data: restaurants } = await sb.from('restaurants').select('id, name, slug').order('created_at')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">레스토랑 관리</h1>
      {/* server->client: pass initial list */}
      {/* @ts-ignore */}
      <RestaurantsEditor initialRestaurants={restaurants ?? []} />
    </div>
  )
}
