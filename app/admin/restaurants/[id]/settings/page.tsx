export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function RestaurantSettingsPage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const { data: r } = await sb.from('restaurants').select('*').eq('id', resolvedParams?.id).maybeSingle()
  const { data: tables } = await sb.from('tables').select('id, name, capacity').eq('restaurant_id', resolvedParams?.id).order('created_at')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">설정</h1>
  <form action={`/api/admin/restaurants/${resolvedParams?.id}/settings`} method="post" className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded border">
        <input name="name" defaultValue={r?.name ?? ''} placeholder="상호명" className="border rounded px-3 py-2" />
        <input name="slug" defaultValue={r?.slug ?? ''} placeholder="슬러그" className="border rounded px-3 py-2" />
        <input name="phone" defaultValue={(r as any)?.phone ?? ''} placeholder="전화" className="border rounded px-3 py-2" />
        <input name="email" defaultValue={(r as any)?.email ?? ''} placeholder="이메일" className="border rounded px-3 py-2" />
        <input name="address" defaultValue={(r as any)?.address ?? ''} placeholder="주소" className="border rounded px-3 py-2 md:col-span-2" />

        {/* Existing tables: allow editing name and capacity per table */}
        <div className="md:col-span-2">
          <h3 className="font-medium mb-2">테이블 목록</h3>
          <div className="space-y-2">
            {(tables ?? []).map((t: any, idx: number) => (
              <div key={t.id} className="flex gap-2">
                <input type="hidden" name="table_id[]" value={t.id} />
                <input name="table_name[]" defaultValue={t.name ?? `T${idx + 1}`} placeholder="테이블 이름" className="border rounded px-3 py-2 flex-1" />
                <input name="table_capacity[]" type="number" defaultValue={t.capacity ?? 4} placeholder="수용인원" className="w-40 border rounded px-3 py-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Add new tables */}
        <input name="add_table_count" type="number" defaultValue={0} placeholder="새 테이블 수" className="border rounded px-3 py-2" />
        <input name="new_table_capacity" type="number" defaultValue={4} placeholder="새 테이블 기본 인원" className="border rounded px-3 py-2" />

        <button className="px-3 py-2 rounded bg-blue-600 text-white w-max">저장</button>
      </form>
    </div>
  )
}
