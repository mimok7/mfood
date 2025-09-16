export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { useState } from 'react'

export default async function TablesPage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const { data: r } = await sb.from('restaurants').select('*').eq('id', resolvedParams?.id).maybeSingle()
  const { data: tables } = await sb.from('tables').select('id, name, capacity, token').eq('restaurant_id', resolvedParams?.id).order('created_at')

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2'>🪑 테이블 관리</h1>
        <p className='text-blue-100'>{r?.name} 레스토랑의 테이블을 설정하고 관리하세요</p>
      </div>

      {/* 현재 테이블 현황 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>현재 테이블 현황</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
            <div className='text-2xl font-bold text-blue-600'>{tables?.length ?? 0}</div>
            <div className='text-sm text-blue-800'>총 테이블 수</div>
          </div>
          <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
            <div className='text-2xl font-bold text-green-600'>{tables?.reduce((sum, t) => sum + (t.capacity || 4), 0) ?? 0}</div>
            <div className='text-sm text-green-800'>총 수용인원</div>
          </div>
          <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
            <div className='text-2xl font-bold text-purple-600'>{Math.round((tables?.reduce((sum, t) => sum + (t.capacity || 4), 0) ?? 0) / Math.max(tables?.length ?? 1, 1))}</div>
            <div className='text-sm text-purple-800'>평균 테이블 크기</div>
          </div>
        </div>
      </div>

      {/* 테이블 목록 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>테이블 목록</h2>
          <p className='text-sm text-gray-600 mt-1'>각 테이블의 이름과 수용인원을 설정합니다.</p>
        </div>
        <div className='p-6'>
          {(tables ?? []).length > 0 ? (
            <div className='space-y-4'>
              {(tables ?? []).map((table: any, idx: number) => (
                <div key={table.id} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                      <span className='text-blue-600 font-semibold'>{idx + 1}</span>
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>{table.name || 테이블 }</div>
                      <div className='text-sm text-gray-500'>{table.capacity || 4}명 수용</div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-xs bg-gray-200 px-2 py-1 rounded'>Token: {table.token?.substring(0, 8)}...</span>
                    <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                      수정
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🪑</div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>테이블이 없습니다</h3>
              <p className='text-gray-500 mb-6'>아래에서 테이블을 추가하세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* 테이블 설정 폼 */}
      <TableSettingsForm restaurantId={resolvedParams?.id} initialTables={tables ?? []} />
    </div>
  )
}

// 클라이언트 컴포넌트
function TableSettingsForm({ restaurantId, initialTables }: { restaurantId?: string, initialTables: any[] }) {
  const [totalTables, setTotalTables] = useState(initialTables?.length ?? 0)
  const [tableCapacities, setTableCapacities] = useState<number[]>(() =>
    initialTables?.map(t => t.capacity || 4) ?? []
  )

  const handleTotalTablesChange = (newTotal: number) => {
    setTotalTables(newTotal)
    // 테이블 수 변경 시 용량 배열도 업데이트
    const newCapacities = Array.from({ length: newTotal }, (_, i) => tableCapacities[i] || 4)
    setTableCapacities(newCapacities)
  }

  const updateCapacity = (index: number, capacity: number) => {
    const newCapacities = [...tableCapacities]
    newCapacities[index] = capacity
    setTableCapacities(newCapacities)
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-xl font-semibold text-gray-900'>테이블 설정</h2>
        <p className='text-sm text-gray-600 mt-1'>전체 테이블 수를 설정하고 각 테이블의 수용인원을 지정합니다.</p>
      </div>
      <form action={/api/admin/restaurants//tables} method='post' className='p-6 space-y-6'>
        {/* 전체 테이블 수 설정 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            전체 테이블 수 <span className='text-red-500'>*</span>
          </label>
          <input
            name='total_tables'
            type='number'
            value={totalTables}
            onChange={(e) => handleTotalTablesChange(parseInt(e.target.value) || 0)}
            min='0'
            max='50'
            className='w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
            required
          />
          <p className='text-sm text-gray-500 mt-1'>0-50개 사이의 테이블 수를 설정하세요.</p>
        </div>

        {/* 각 테이블별 설정 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            각 테이블별 수용인원 설정
          </label>
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'>
            <div className='flex items-start'>
              <div className='text-yellow-600 mr-2'>⚠️</div>
              <div className='text-sm text-yellow-800'>
                <strong>주의:</strong> 테이블 수를 변경하면 기존 설정이 초기화될 수 있습니다.
                각 테이블의 수용인원을 개별적으로 설정할 수 있습니다.
              </div>
            </div>
          </div>

          <div className='space-y-3'>
            {totalTables === 0 ? (
              <p className='text-gray-500 text-center py-4'>테이블이 없습니다.</p>
            ) : (
              Array.from({ length: totalTables }, (_, i) => (
                <div key={i} className='flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
                      {i + 1}
                    </div>
                    <span className='font-medium text-gray-900'>테이블 {i + 1}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <label className='text-sm text-gray-700'>수용인원:</label>
                    <input
                      name='table_capacity[]'
                      type='number'
                      value={tableCapacities[i] || 4}
                      onChange={(e) => updateCapacity(i, parseInt(e.target.value) || 4)}
                      min='1'
                      max='20'
                      className='w-20 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                    <span className='text-sm text-gray-600'>명</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className='flex justify-end pt-4 border-t border-gray-200'>
          <button
            type='submit'
            className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm'
          >
            <span className='mr-2'>💾</span>
            테이블 설정 저장
          </button>
        </div>
      </form>
    </div>
  )
}
