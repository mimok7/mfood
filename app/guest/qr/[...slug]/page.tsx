type MenuItem = { id: string; name: string; price: number }

async function fetchMenu(restaurantId: string, token: string): Promise<MenuItem[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/guest/menu?restaurant_id=${encodeURIComponent(restaurantId)}&token=${encodeURIComponent(token)}`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function GuestQrPage({ params }: { params?: Promise<{ slug: string[] }> }) {
  const resolvedParams = params ? await params : undefined
  const slug = resolvedParams?.slug || []
  const restaurantId = slug[0] || ''
  const token = slug[1] || ''

  const items = await fetchMenu(restaurantId, token)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">메뉴</h1>
      <ul className="divide-y divide-gray-200 bg-white rounded shadow">
        {items.map((it) => (
          <li key={it.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-gray-500">{it.price.toLocaleString()}원</div>
            </div>
            <form action={`/api/guest/order`} method="post" className="flex items-center gap-2">
              <input type="hidden" name="restaurant_id" value={restaurantId} />
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="item_id" value={it.id} />
              <input type="number" name="qty" min={1} defaultValue={1} className="w-16 border rounded px-2 py-1" />
              <button className="px-3 py-1 rounded bg-blue-600 text-white">주문</button>
            </form>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">웨이팅 등록</h2>
      <form action="/api/guest/waitlist" method="post" className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded shadow">
        <input type="hidden" name="restaurant_id" value={restaurantId} />
        <input type="hidden" name="token" value={token} />
        <input name="name" placeholder="이름" className="border rounded px-3 py-2" required />
        <input name="phone" placeholder="연락처" className="border rounded px-3 py-2" />
        <input name="party_size" type="number" min={1} defaultValue={2} className="border rounded px-3 py-2" />
        <button className="px-3 py-2 rounded bg-green-600 text-white">대기 등록</button>
      </form>
    </div>
  )
}