"use client"
import React, { useEffect, useState, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-client'
import Link from 'next/link'

type Table = {
  id: string
  name: string
  capacity: number
  restaurant_id: string
}

type Order = {
  id: string
  table_id: string
  status: string
  created_at: string
  tables?: {
    id: string
    name: string
  }
}

export default function TablesClient({ initialTables, initialOrders }: { initialTables: Table[], initialOrders: Order[] }) {
  const [tables, setTables] = useState<Table[]>(initialTables || [])
  const [orders, setOrders] = useState<Order[]>(initialOrders || [])
  const supabase = useRef(createSupabaseBrowser()).current

  useEffect(() => {
    // 실시간 구독 설정
    const ordersChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload: any) => {
        // 주문 데이터가 변경되면 전체 데이터를 다시 가져옴
        fetchOrders()
      })
      .subscribe()

    const tablesChannel = supabase
      .channel('public:tables')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, (payload: any) => {
        // 테이블 데이터가 변경되면 전체 데이터를 다시 가져옴
        fetchTables()
      })
      .subscribe()

    return () => {
      ordersChannel.unsubscribe()
      tablesChannel.unsubscribe()
    }
  }, [supabase])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/manager/orders/active', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/manager/tables', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        setTables(data.tables || [])
      }
    } catch (err) {
      console.error('Failed to fetch tables:', err)
    }
  }

  // 테이블별 주문 상태 매핑
  const tableOrderMap = orders.reduce((acc, order) => {
    if (order.table_id) {
      acc[order.table_id] = order
    }
    return acc
  }, {} as Record<string, Order>)

  const getTableStatus = (tableId: string) => {
    const order = tableOrderMap[tableId]
    if (!order) return { text: '비어있음', color: 'bg-gray-100 text-gray-800', icon: '🆓' }

    switch (order.status) {
      case 'open':
      case 'sent':
        return { text: '사용 중', color: 'bg-gray-100 text-gray-800', icon: '🪑' }
      default:
        return { text: '사용 중', color: 'bg-gray-100 text-gray-800', icon: '🪑' }
    }
  }

  // 테이블 통계
  const totalTables = tables.length
  const occupiedTables = Object.keys(tableOrderMap).length
  const availableTables = totalTables - occupiedTables

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>🪑 테이블</h1>
            <p className='text-purple-100'>테이블 배치도 및 상태 관리</p>
          </div>
          <div className='ml-4'>
            <Link
              href="/manager"
              className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              <span className="mr-2">🏠</span>
              홈
            </Link>
          </div>
        </div>
      </div>

      {/* 테이블 통계 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-blue-600'>전체테이블: {totalTables}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-green-600'>사용가능: {availableTables}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-orange-600'>사용중: {occupiedTables}</div>
          </div>
        </div>
      </div>

      {/* 테이블 그리드 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>🏗️</span>
            테이블 배치도 ({tables.length}개)
          </h2>
          <p className='text-sm text-gray-600 mt-1'>실시간 테이블 상태</p>
        </div>

        {tables.length > 0 ? (
          <div className='p-4'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {tables.map((table) => {
                const statusInfo = getTableStatus(table.id)

                return (
                  <div
                    key={table.id}
                    className='border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer'
                  >
                    {/* 테이블 헤더 */}
                    <div className='text-center mb-3'>
                      <div className='text-2xl mb-1'>🪑</div>
                      <div className='text-lg font-semibold text-gray-900'>{table.name}</div>
                      <div className='text-sm text-gray-600'>최대 {table.capacity || 4}명</div>
                    </div>

                    {/* 테이블 상태 */}
                    <div className='text-center'>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} mb-2`}>
                        <span className='mr-1'>{statusInfo.icon}</span>
                        {statusInfo.text}
                      </span>

                      {tableOrderMap[table.id] && (
                        <div className='text-xs text-gray-500'>
                          {new Date(tableOrderMap[table.id].created_at).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} 주문
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className='mt-3 flex gap-1'>
                      {statusInfo.text === '비어있음' ? (
                        <button className='flex-1 bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700 transition-colors'>
                          착석
                        </button>
                      ) : (
                        <>
                          <button className='flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors'>
                            상세
                          </button>
                          <button className='flex-1 bg-red-600 text-white text-xs py-1 px-2 rounded hover:bg-red-700 transition-colors'>
                            정리
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>🏗️</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>테이블이 없습니다</h3>
            <p className='text-gray-500 mb-4'>등록된 테이블이 없습니다. 관리자에게 문의하세요.</p>
            <Link
              href={`/manager`}
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <span className='mr-2'>🏠</span>
              대시보드
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}