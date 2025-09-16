"use client"

import React from 'react'

type Item = { id: string; name: string; slug?: string | null }

export default function RestaurantSwitcher({ currentId, items }: { currentId: string; items: Item[] }) {
  return (
    <select
      className="border rounded px-3 py-2"
      value={currentId}
      onChange={async (e) => {
        const id = e.target.value
        if (!id) return
        try {
          await fetch('/api/admin/restaurants/select', { method: 'POST', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } })
        } catch (e) {
          // ignore
        }
        window.location.href = `/admin/restaurants/${id}`
      }}
    >
      {items.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}{r.slug ? ` (/${r.slug})` : ''}
        </option>
      ))}
    </select>
  )
}
