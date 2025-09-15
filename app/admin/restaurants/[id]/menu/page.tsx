import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function AdminMenuPage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const rid = resolvedParams?.id
  const [{ data: categories }, { data: items }] = await Promise.all([
    sb.from('menu_categories').select('id, name, position').eq('restaurant_id', rid).order('position'),
    sb.from('menu_items').select('id, name, price, category_id, is_active').eq('restaurant_id', rid).order('created_at'),
  ])
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">카테고리</h2>
        <form action={`/api/admin/restaurants/${rid}/menu/category`} method="post" className="flex gap-2 mb-3">
          <input type="text" name="name" placeholder="이름" className="border rounded px-3 py-2" required />
          <input type="number" name="position" placeholder="순서" className="border rounded px-3 py-2 w-28" defaultValue={0} />
          <button className="px-3 py-2 rounded bg-blue-600 text-white">추가</button>
        </form>
        <ul className="grid gap-2">
          {(categories ?? []).map(c => (
            <li key={c.id} className="bg-white border rounded px-3 py-2">{c.name} <span className="text-xs text-gray-500">({c.position})</span></li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">메뉴</h2>
        <form action={`/api/admin/restaurants/${rid}/menu/item`} method="post" className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
          <input type="text" name="name" placeholder="이름" className="border rounded px-3 py-2" required />
          <input type="number" name="price" placeholder="가격" className="border rounded px-3 py-2" required />
          <select name="category_id" className="border rounded px-3 py-2">
            <option value="">카테고리 없음</option>
            {(categories ?? []).map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <select name="is_active" className="border rounded px-3 py-2">
            <option value="true">활성</option>
            <option value="false">비활성</option>
          </select>
          <button className="px-3 py-2 rounded bg-green-600 text-white">추가</button>
        </form>
        <ul className="grid gap-2">
          {(items ?? []).map(i => (
            <li key={i.id} className="bg-white border rounded px-3 py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-xs text-gray-500">{i.price.toLocaleString()}원</div>
              </div>
              <div className="text-xs text-gray-500">{i.is_active ? '활성' : '비활성'}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
