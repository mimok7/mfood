import { requireRole } from '@/lib/auth'
import CreateRestaurantForm from './CreateRestaurantForm'

export default async function NewRestaurantPage() {
  await requireRole('admin')

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2 flex items-center'>
          <span className='mr-3'>🏪</span>
          새 식당 생성
        </h1>
        <p className='text-green-100'>새로운 식당을 추가하여 관리 시스템에 포함시키세요</p>
      </div>

      {/* 식당 생성 폼 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>➕</span>
            식당 정보 입력
          </h2>
          <p className='text-sm text-gray-600 mt-1'>식당의 기본 정보를 입력하세요</p>
        </div>
        <div className='p-6'>
          <CreateRestaurantForm />
        </div>
      </div>
    </div>
  )
}