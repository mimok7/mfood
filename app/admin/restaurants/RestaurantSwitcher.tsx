"use client"

import React from 'react'

type Item = { id: string; name: string; slug?: string | null }

export default function RestaurantSwitcher({ currentId, items }: { currentId: string; items: Item[] }) {
  return (
    <select
      className="border rounded px-3 py-2"
      value={currentId}
      onChange={(e) => {
        const id = e.target.value
        if (!id) return
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
