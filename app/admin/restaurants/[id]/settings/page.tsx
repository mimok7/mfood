import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function RestaurantSettingsPage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const { data: r } = await sb.from('restaurants').select('*').eq('id', resolvedParams?.id).maybeSingle()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">설정</h1>
  <form action={`/api/admin/restaurants/${resolvedParams?.id}/settings`} method="post" className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded border">
        <input name="name" defaultValue={r?.name ?? ''} placeholder="상호명" className="border rounded px-3 py-2" />
        <input name="slug" defaultValue={r?.slug ?? ''} placeholder="슬러그" className="border rounded px-3 py-2" />
        <input name="phone" defaultValue={(r as any)?.phone ?? ''} placeholder="전화" className="border rounded px-3 py-2" />
        <input name="email" defaultValue={(r as any)?.email ?? ''} placeholder="이메일" className="border rounded px-3 py-2" />
        <input name="address" defaultValue={(r as any)?.address ?? ''} placeholder="주소" className="border rounded px-3 py-2 md:col-span-2" />
        <button className="px-3 py-2 rounded bg-blue-600 text-white w-max">저장</button>
      </form>
    </div>
  )
}
