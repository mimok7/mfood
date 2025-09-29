"use client"

import { useState } from 'react'
import Link from 'next/link'

interface Restaurant {
  id: string
  name: string
  slug?: string
  address?: string
  created_at: string
}

interface RestaurantListProps {
  restaurants: Restaurant[]
  addressFilter: string
}

export default function RestaurantList({ restaurants, addressFilter }: RestaurantListProps) {
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectAll = () => {
    if (selectedRestaurants.size === restaurants.length) {
      setSelectedRestaurants(new Set())
    } else {
      setSelectedRestaurants(new Set(restaurants.map(r => r.id)))
    }
  }

  const handleSelectRestaurant = (restaurantId: string) => {
    const newSelected = new Set(selectedRestaurants)
    if (newSelected.has(restaurantId)) {
      newSelected.delete(restaurantId)
    } else {
      newSelected.add(restaurantId)
    }
    setSelectedRestaurants(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedRestaurants.size === 0) return
    
    setDeleteLoading(true)
    setError(null)
    
    try {
      const deletePromises = Array.from(selectedRestaurants).map(async (restaurantId) => {
        const res = await fetch(`/api/admin/restaurants/${restaurantId}/delete`, { method: 'POST' })
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`${restaurantId}: ${errorText}`)
        }
        return await res.json()
      })
      
      const results = await Promise.all(deletePromises)
      
      alert(`${selectedRestaurants.size}개 식당이 성공적으로 삭제되었습니다.`)
      setSelectedRestaurants(new Set())
      setShowDeleteModal(false)
      
      // 페이지 새로고침
      window.location.reload()
    } catch (err: any) {
      setError(err.message || '삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const selectedRestaurantNames = restaurants
    .filter(r => selectedRestaurants.has(r.id))
    .map(r => r.name)

  return (
    <>
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
                <span className='mr-2'>🏪</span>
                식당 목록
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                총 {restaurants?.length ?? 0}개 표시{addressFilter && ` (필터: ${addressFilter})`}
                {selectedRestaurants.size > 0 && ` • ${selectedRestaurants.size}개 선택됨`}
              </p>
            </div>
            
            {restaurants && restaurants.length > 0 && (
              <div className='flex items-center space-x-3'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={selectedRestaurants.size === restaurants.length}
                    onChange={handleSelectAll}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='ml-2 text-sm text-gray-700'>전체 선택</span>
                </label>
                
                {selectedRestaurants.size > 0 && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className='inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
                  >
                    <span className='mr-1'>🗑️</span>
                    선택된 식당 삭제
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {restaurants && restaurants.length > 0 ? (
          <div className='p-4'>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3'>
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className='relative'>
                  <input
                    type='checkbox'
                    checked={selectedRestaurants.has(restaurant.id)}
                    onChange={() => handleSelectRestaurant(restaurant.id)}
                    className='absolute top-2 right-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 z-10'
                  />
                  <Link
                    href={`/admin/restaurants/${restaurant.id}`}
                    className={`block bg-gradient-to-br from-white to-gray-50 border rounded-lg p-3 hover:shadow-lg transition-all duration-200 group ${
                      selectedRestaurants.has(restaurant.id) 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className='text-center pr-6'>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${
                        selectedRestaurants.has(restaurant.id)
                          ? 'bg-blue-200'
                          : 'bg-blue-100 group-hover:bg-blue-200'
                      }`}>
                        <span className='text-lg'>🏪</span>
                      </div>
                      <h3 className={`text-xs font-semibold mb-1 transition-colors line-clamp-2 ${
                        selectedRestaurants.has(restaurant.id)
                          ? 'text-blue-700'
                          : 'text-gray-900 group-hover:text-blue-700'
                      }`}>
                        {restaurant.name}
                      </h3>
                      {restaurant.address && (
                        <div className='text-xs text-gray-600 mb-1 line-clamp-2'>
                          📍 {restaurant.address}
                        </div>
                      )}
                      <div className='text-xs text-gray-500'>
                        ID: {restaurant.id.slice(0, 6)}...
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='p-8 text-center'>
            <div className='text-5xl mb-4'>🏪</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>등록된 식당이 없습니다</h3>
            <p className='text-gray-500 mb-4'>새 식당을 생성하여 관리 시스템에 포함시키세요.</p>
            <Link
              href='/admin/restaurants/new'
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              ➕ 새 식당 생성
            </Link>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-lg w-full mx-4'>
            <div className='p-6'>
              <div className='flex items-center mb-4'>
                <div className='flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center'>
                  <span className='text-2xl'>⚠️</span>
                </div>
                <div className='ml-4'>
                  <h3 className='text-lg font-medium text-gray-900'>식당 일괄 삭제 확인</h3>
                  <p className='text-sm text-gray-500'>이 작업은 되돌릴 수 없습니다</p>
                </div>
              </div>
              
              <div className='mb-6'>
                <p className='text-sm text-gray-700 mb-3'>
                  선택된 <strong>{selectedRestaurants.size}개</strong> 식당을 삭제하시겠습니까?
                </p>
                
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto'>
                  <div className='text-sm text-gray-700 space-y-1'>
                    {selectedRestaurantNames.map((name, index) => (
                      <div key={index} className='flex items-center'>
                        <span className='mr-2'>🏪</span>
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                  <p className='text-sm text-red-800 font-medium mb-2'>각 식당의 다음 데이터가 모두 삭제됩니다:</p>
                  <ul className='text-sm text-red-700 space-y-1 list-disc list-inside'>
                    <li>메뉴 카테고리 및 메뉴 아이템</li>
                    <li>메뉴 옵션 그룹 및 옵션</li>
                    <li>테이블 정보</li>
                    <li>대기 명단</li>
                    <li>주문 내역</li>
                    <li>주방 대기열</li>
                    <li>사용자 연결 정보</li>
                  </ul>
                </div>
              </div>
              
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4'>
                  <p className='text-sm text-red-800'>{error}</p>
                </div>
              )}
              
              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setError(null)
                  }}
                  disabled={deleteLoading}
                  className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50'
                >
                  취소
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={deleteLoading}
                  className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50'
                >
                  {deleteLoading ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                      삭제 중...
                    </>
                  ) : (
                    <>
                      <span className='mr-2'>🗑️</span>
                      {selectedRestaurants.size}개 식당 삭제
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}