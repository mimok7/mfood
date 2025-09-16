"use client"
import React, { useEffect, useState, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-client'

type WaitItem = any

export default function WaitlistClient({ initialItems }: { initialItems: WaitItem[] }) {
  const [items, setItems] = useState<WaitItem[]>(initialItems || [])
  const [highlightIds, setHighlightIds] = useState<Record<string, boolean>>({})
  const supabase = useRef(createSupabaseBrowser()).current

  useEffect(() => {
    // listen for new inserts
    const channel = supabase
      .channel('public:waitlist')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waitlist' }, (payload: any) => {
        const newRow = payload.new as any
        // prepend to items (depending on ordering)
        setItems((cur) => [newRow, ...cur])
        // highlight the new id briefly
        setHighlightIds((h) => ({ ...h, [newRow.id]: true }))
        setTimeout(() => setHighlightIds((h) => { const next = { ...h }; delete next[newRow.id]; return next }), 5000)
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting': return { text: '대기중', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' }
      case 'seated': return { text: '착석완료', color: 'bg-green-100 text-green-800', icon: '✅' }
      default: return { text: status, color: 'bg-gray-100 text-gray-800', icon: '❓' }
    }
  }

  const getWaitTime = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
    if (diffMinutes < 60) return `${diffMinutes}분`
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return `${hours}시간 ${minutes}분`
  }

  return (
    <div className='space-y-3'>
      {items.map((item) => (
        <div key={item.id} className={`border rounded-lg p-4 transition-shadow ${highlightIds[item.id] ? 'ring-4 ring-indigo-300' : ''}`}>
          <div className='flex items-center justify-between mb-2'>
            <div className='font-medium'>{item.name}</div>
            <div className={`text-xs px-2 py-1 rounded ${getStatusDisplay(item.status).color}`}>{getStatusDisplay(item.status).text}</div>
          </div>
          <div className='text-sm text-gray-600 flex justify-between'>
            <div>👥 {item.party_size}명</div>
            <div>⏱️ {getWaitTime(item.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
