"use client"
import React, { useEffect, useState, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-client'

type WaitItem = any

export default function WaitlistClient({ initialItems, tables }: { initialItems: WaitItem[], tables: any[] }) {
  const [items, setItems] = useState<WaitItem[]>(initialItems || [])
  const [highlightIds, setHighlightIds] = useState<Record<string, boolean>>({})
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [occupiedTableIds, setOccupiedTableIds] = useState<Set<string>>(new Set())
  const supabase = useRef(createSupabaseBrowser()).current
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('waitlist-auto-refresh')
    setAutoRefresh(saved === 'true')
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('public:waitlist')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waitlist' }, (payload: any) => {
        const newRow = payload.new as any
        // add to items
        setItems((cur) => [newRow, ...cur])
        // highlight the new id briefly
        setHighlightIds((h) => ({ ...h, [newRow.id]: true }))
        setTimeout(() => setHighlightIds((h) => { const next = { ...h }; delete next[newRow.id]; return next }), 5000)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'waitlist' }, (payload: any) => {
        const updatedRow = payload.new as any
        // update the item in the list
        setItems((cur) => cur.map(item => item.id === updatedRow.id ? updatedRow : item))
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  // 활성 주문(점유 테이블) 불러오기 및 실시간 반영
  useEffect(() => {
    let mounted = true

    const fetchActiveOrders = async () => {
      try {
        const res = await fetch('/api/manager/orders/active', { method: 'GET' })
        if (!res.ok) return
        const data = await res.json()
        const ids = new Set<string>((data.orders || []).map((o: any) => o.table_id).filter(Boolean))
        if (mounted) setOccupiedTableIds(ids)
      } catch (e) {
        // noop
      }
    }

    fetchActiveOrders()

    const ordersChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchActiveOrders()
      })
      .subscribe()

    return () => {
      mounted = false
      ordersChannel.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        window.location.reload()
      }, 10000) // 10초마다 갱신
    } else {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [autoRefresh])

  // autoRefresh 상태가 변경될 때 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('waitlist-auto-refresh', autoRefresh.toString())
    }
  }, [autoRefresh])

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting': return { text: '대기중', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' }
      case 'called': return { text: '호출됨', color: 'bg-blue-100 text-blue-800', icon: '📢' }
      case 'seated': return { text: '배정', color: 'bg-green-100 text-green-800', icon: '✅' }
      default: return { text: status, color: 'bg-gray-100 text-gray-800', icon: '❓' }
    }
  }

  const callWaitlist = async (id: string) => {
    try {
      const res = await fetch(`/api/manager/waitlist/${id}/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        // 성공 시 해당 item의 status를 'called'로 업데이트
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'called' } : item
        ))
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(errorData.error || '호출 처리에 실패했습니다')
      }
    } catch (err) {
      console.error('call error', err)
      alert('네트워크 오류로 호출 처리에 실패했습니다')
    }
  }

  const seatWaitlist = async (id: string, tableId: string) => {
    try {
      const res = await fetch(`/api/manager/waitlist/${id}/seat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_id: tableId })
      })
      if (res.ok) {
        // 성공 시 해당 item의 status를 'seated'로 업데이트
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'seated' } : item
        ))
        // 즉시 선택 불가하도록 점유 테이블에 추가
        setOccupiedTableIds(prev => new Set([...Array.from(prev), tableId]))
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(errorData.error || '배정 처리에 실패했습니다')
      }
    } catch (err) {
      console.error('seat error', err)
      alert('네트워크 오류로 배정 처리에 실패했습니다')
    }
  }

  const completeAllSeated = async (seatedItems: WaitItem[]) => {
    if (!confirm(`${seatedItems.length}명의 배정된 손님을 모두 완료 처리하시겠습니까?`)) {
      return
    }

    try {
      const promises = seatedItems.map(item =>
        fetch(`/api/manager/waitlist/${item.id}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      )

      const results = await Promise.all(promises)
      const failedCount = results.filter(res => !res.ok).length

      if (failedCount === 0) {
        // 성공 시 모든 배정된 항목들을 목록에서 제거
        setItems(prev => prev.filter(item => item.status !== 'seated'))
        alert('모든 배정이 완료되었습니다')
      } else {
        alert(`${failedCount}건의 완료 처리에 실패했습니다`)
        // 부분 실패 시 데이터를 다시 가져옴
        window.location.reload()
      }
    } catch (err) {
      console.error('complete all error', err)
      alert('네트워크 오류로 완료 처리에 실패했습니다')
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

  // 상태별로 그룹화
  const itemsByStatus = items.reduce((acc: Record<string, WaitItem[]>, item: any) => {
    const status = item.status
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(item)
    return acc
  }, {} as Record<string, WaitItem[]>)

  const statusOrder = ['waiting', 'called', 'seated'] // 표시 순서

  return (
    <div className='space-y-6'>
      {/* 갱신 버튼 */}
      <div className='flex justify-end'>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            autoRefresh
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          suppressHydrationWarning
        >
          {autoRefresh ? '🔄 자동 갱신 중 (10초)' : '🔄 자동 갱신'}
        </button>
      </div>

      <div className='grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6'>
      {statusOrder.map(status => {
        const statusItems = itemsByStatus[status] || []
        return (
          <div key={status} className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-900 flex items-center space-x-2'>
                  <span>{getStatusDisplay(status).icon}</span>
                  <span>{getStatusDisplay(status).text}</span>
                  <span className='text-sm text-gray-500'>({statusItems.length}명)</span>
                </h2>
                {status === 'seated' && statusItems.length > 0 && (
                  <button
                    onClick={() => completeAllSeated(statusItems)}
                    className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm'
                  >
                    ✅ 모두 완료
                  </button>
                )}
              </div>
            </div>

            <div className='p-4 space-y-3 max-h-96 overflow-y-auto'>
              {statusItems.length > 0 ? (
                statusItems.map((item, idx) => (
                  <div key={item.id} className={`border rounded-lg p-4 transition-shadow ${highlightIds[item.id] ? 'ring-4 ring-indigo-300' : ''}`}>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center space-x-3'>
                        <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold'>
                          {idx + 1}
                        </span>
                        <div>
                          <div className='font-medium'>{item.name}</div>
                          <div className={`text-xs px-2 py-1 rounded ${getStatusDisplay(item.status).color}`}>{getStatusDisplay(item.status).text}</div>
                        </div>
                      </div>
                      {item.status === 'waiting' && (
                        <button
                          onClick={() => callWaitlist(item.id)}
                          className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                        >
                          📢 호출
                        </button>
                      )}
                      {item.status === 'called' && tables.length > 0 && (
                        <div className='flex items-center space-x-2'>
                          <select
                            id={`table-select-${item.id}`}
                            className='border border-gray-300 rounded px-2 py-1 text-sm'
                            defaultValue=""
                          >
                            <option value="" disabled>테이블 선택</option>
                            {tables
                              .filter((table: any) => !occupiedTableIds.has(table.id))
                              .map((table: any) => (
                                <option key={table.id} value={table.id}>
                                  {table.name} ({table.capacity}명)
                                </option>
                              ))}
                          </select>
                          <button
                            onClick={() => {
                              const select = document.getElementById(`table-select-${item.id}`) as HTMLSelectElement
                              const tableId = select.value
                              if (tableId) {
                                seatWaitlist(item.id, tableId)
                              } else {
                                alert('테이블을 선택해주세요')
                              }
                            }}
                            className='bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors'
                          >
                            배정
                          </button>
                        </div>
                      )}
                    </div>
                    <div className='text-sm text-gray-600 flex justify-between'>
                      {item.status === 'seated' ? (
                        <div>👥 {item.party_size}명 🪑 {item.tables?.name}</div>
                      ) : (
                        <div>👥 {item.party_size}명</div>
                      )}
                      <div>⏱️ {getWaitTime(item.created_at)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <div className='text-4xl mb-2'>{getStatusDisplay(status).icon}</div>
                  <p>{status === 'waiting' ? '대기 중인 손님이 없습니다' : status === 'called' ? '호출된 손님이 없습니다' : '배정된 손님이 없습니다'}</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}
