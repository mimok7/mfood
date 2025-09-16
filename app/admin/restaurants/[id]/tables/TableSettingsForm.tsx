'use client'
import { useState } from 'react'

interface TableSettingsFormProps {
  restaurantId?: string
  initialTables: any[]
}

export default function TableSettingsForm({ restaurantId, initialTables }: TableSettingsFormProps) {
  const [totalTables, setTotalTables] = useState(initialTables?.length ?? 0)
  const [tableCapacities, setTableCapacities] = useState<number[]>(() =>
    initialTables?.map(t => t.capacity || 4) ?? []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const tables = initialTables || []

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch(`/api/admin/restaurants/${restaurantId}/tables`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setSubmitStatus('success')
        // 성공 메시지를 2초 후에 초기화
        setTimeout(() => {
          setSubmitStatus('idle')
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-xl font-semibold text-gray-900'>테이블 설정</h2>
        <p className='text-sm text-gray-600 mt-1'>전체 테이블 수를 설정하고 각 테이블의 수용인원을 지정합니다.</p>
      </div>
      <form onSubmit={handleSubmit} className='p-6 space-y-6'>
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {tables.length === 0 ? (
              <div className='col-span-full'>
                <p className='text-gray-500 text-center py-4'>테이블이 없습니다.</p>
              </div>
            ) : (
              tables.map((table: any, i: number) => (
                <div key={table.id} className='p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
                        {i + 1}
                      </div>
                      <span className='font-medium text-gray-900'>테이블 {i + 1}</span>
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <div>
                      <label className='block text-sm text-gray-700 font-medium mb-2'>수용인원:</label>
                      <div className='flex flex-wrap gap-1'>
                        {Array.from({ length: 12 }, (_, num) => num + 1).map(capacity => (
                          <button
                            key={capacity}
                            type='button'
                            onClick={() => updateCapacity(i, capacity)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                              (tableCapacities[i] || table.capacity || 4) === capacity
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {capacity}
                          </button>
                        ))}
                      </div>
                      <input type='hidden' name={`table_capacity_${table.id}`} value={tableCapacities[i] || table.capacity || 4} />
                      <div className='text-xs text-gray-600 mt-2'>현재: {(tableCapacities[i] || table.capacity || 4)}명</div>
                    </div>
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
            disabled={isSubmitting}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-colors shadow-sm ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : submitStatus === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                저장중...
              </>
            ) : submitStatus === 'success' ? (
              <>
                <span className='mr-2'>✅</span>
                저장 완료
              </>
            ) : (
              <>
                <span className='mr-2'>💾</span>
                테이블 설정 저장
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}