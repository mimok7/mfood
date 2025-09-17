"use client"

import { useEffect, useState } from 'react'

type Item = {
  id: string
  created_at: string
  party_size: number
  display_name: string
}

export default function WaitlistBoard({ restaurantId }: { restaurantId: string }) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchList(signal?: AbortSignal) {
    if (!restaurantId) return
    try {
      const params = new URLSearchParams({ restaurant_id: restaurantId })
      const res = await fetch(`/api/guest/waitlist?${params.toString()}`, { signal, cache: 'no-store' })
      if (!res.ok) throw new Error('failed to fetch')
      const json = await res.json()
      setItems(json.items || [])
      setError(null)
    } catch (e) {
      if ((e as any)?.name === 'AbortError') return
      setError('대기자 명단을 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const ctrl = new AbortController()
    fetchList(ctrl.signal)
    const t = setInterval(() => fetchList(), 5000)
    return () => {
      ctrl.abort()
      clearInterval(t)
    }
  }, [restaurantId])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">실시간 대기자 명단</h3>
      {loading ? (
        <p className="text-sm text-gray-500">불러오는 중…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-600">현재 대기팀이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((it, idx) => (
            <li key={it.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-medium">{idx + 1}</span>
                <div>
                  <div className="text-gray-900 font-medium">{it.display_name}</div>
                  <div className="text-xs text-gray-500">팀 인원: {it.party_size}명</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{new Date(it.created_at).toLocaleTimeString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
