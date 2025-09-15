"use client"

import React, { useEffect, useState } from 'react'

export default function RestaurantsEditor({ initialRestaurants }: { initialRestaurants: Array<{ id: string; name: string; slug?: string }> }) {
  const [restaurants] = useState(initialRestaurants)
  const [selected, setSelected] = useState<string | null>(restaurants[0]?.id ?? null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selected) fetchDetails(selected)
  }, [selected])

  async function fetchDetails(id: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/restaurants/${id}/details`)
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    setError(null)
    const form = new FormData(e.target as HTMLFormElement)
    try {
      const res = await fetch(`/api/admin/restaurants/${selected}/settings`, { method: 'POST', body: form })
      if (!res.ok) throw new Error(await res.text())
      alert('저장되었습니다')
      await fetchDetails(selected)
    } catch (err: any) {
      setError(err.message || '저장 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded border">
        <label className="block text-sm font-medium mb-1">레스토랑 선택</label>
        <select className="border rounded px-3 py-2 w-full" value={selected ?? ''} onChange={(e) => setSelected(e.target.value)}>
          {restaurants.map(r => <option key={r.id} value={r.id}>{r.name} {r.slug ? `(/${r.slug})` : ''}</option>)}
        </select>
      </div>

      {loading && <div>로딩...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {data && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded border space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input name="name" defaultValue={data.restaurant?.name ?? ''} placeholder="상호명" className="border rounded px-3 py-2" />
            <input name="slug" defaultValue={data.restaurant?.slug ?? ''} placeholder="슬러그" className="border rounded px-3 py-2" />
            <input name="phone" defaultValue={data.restaurant?.phone ?? ''} placeholder="전화" className="border rounded px-3 py-2" />
            <input name="email" defaultValue={data.restaurant?.email ?? ''} placeholder="이메일" className="border rounded px-3 py-2" />
            <input name="address" defaultValue={data.restaurant?.address ?? ''} placeholder="주소" className="border rounded px-3 py-2 md:col-span-2" />
          </div>

          <div>
            <h3 className="font-medium mb-2">테이블</h3>
            <div className="space-y-2">
              {(data.tables ?? []).map((t: any, idx: number) => (
                <div key={t.id} className="flex gap-2">
                  <input type="hidden" name="table_id[]" value={t.id} />
                  <input name="table_name[]" defaultValue={t.name} className="border rounded px-3 py-2 flex-1" />
                  <input name="table_capacity[]" type="number" defaultValue={t.capacity} className="w-40 border rounded px-3 py-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input name="add_table_count" type="number" defaultValue={0} className="border rounded px-3 py-2" />
            <input name="new_table_capacity" type="number" defaultValue={4} className="border rounded px-3 py-2" />
          </div>

          <div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded" disabled={loading}>저장</button>
          </div>
        </form>
      )}
    </div>
  )
}
