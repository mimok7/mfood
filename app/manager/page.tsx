import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ManagerPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()
  const { data: restaurant } = await supabase.from('restaurants').select('name').eq('id', restaurant_id).single()

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>👨‍💼 매니저 패널</h1>
            <p className='text-green-100'>식당 운영 및 관리</p>
            <div className='mt-4 text-sm text-green-200'>
              식당: <span className='font-semibold'>{restaurant?.name ?? '알 수 없음'}</span>
            </div>
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

      {/* 빠른 액션 섹션 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6'>
        {/* 주문 */}
        <Link
          href={`/manager/order`}
          className='block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden'
        >
          <div className='bg-gradient-to-r from-blue-500 to-indigo-500 p-4'>
            <div className='text-white text-2xl'>📋</div>
          </div>
          <div className='p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors'>
              주문
            </h3>
            <p className='text-sm text-gray-600'>
              실시간 주문 확인 및 처리 상태 관리
            </p>
          </div>
        </Link>

        {/* 테이블 */}
        <Link
          href={`/manager/tables`}
          className='block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden'
        >
          <div className='bg-gradient-to-r from-purple-500 to-pink-500 p-4'>
            <div className='text-white text-2xl'>🪑</div>
          </div>
          <div className='p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors'>
              테이블
            </h3>
            <p className='text-sm text-gray-600'>
              테이블 배치도 및 상태 관리
            </p>
          </div>
        </Link>

        {/* 키친 */}
        <Link
          href={`/manager/kitchen`}
          className='block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden'
        >
          <div className='bg-gradient-to-r from-yellow-500 to-orange-500 p-4'>
            <div className='text-white text-2xl'>👨‍🍳</div>
          </div>
          <div className='p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors'>
              키친
            </h3>
            <p className='text-sm text-gray-600'>
              주문 준비 및 서빙 상태 관리
            </p>
          </div>
        </Link>

        {/* 서빙 */}
        <Link
          href={`/manager/serving`}
          className='block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden'
        >
          <div className='bg-gradient-to-r from-teal-500 to-cyan-500 p-4'>
            <div className='text-white text-2xl'>🍽️</div>
          </div>
          <div className='p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors'>
              서빙
            </h3>
            <p className='text-sm text-gray-600'>
              준비 완료된 주문 서빙 관리
            </p>
          </div>
        </Link>

        {/* 대기 */}
        <Link
          href={`/manager/waitlist`}
          className='block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden'
        >
          <div className='bg-gradient-to-r from-cyan-500 to-blue-500 p-4'>
            <div className='text-white text-2xl'>⏳</div>
          </div>
          <div className='p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors'>
              대기
            </h3>
            <p className='text-sm text-gray-600'>
              대기 고객 관리 및 호출 시스템
            </p>
          </div>
        </Link>

        {/* 매출 */}
        <Link
          href={`/manager/reports/sales`}
          className='block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden'
        >
          <div className='bg-gradient-to-r from-green-500 to-emerald-500 p-4'>
            <div className='text-white text-2xl'>💰</div>
          </div>
          <div className='p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors'>
              매출
            </h3>
            <p className='text-sm text-gray-600'>
              실시간 매출 현황 및 분석
            </p>
          </div>
        </Link>
      </div>

      {/* 실시간 현황 섹션 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>📈</span>
            실시간 현황
          </h2>
          <p className='text-sm text-gray-600 mt-1'>현재 식당 운영 상태</p>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>--</div>
              <div className='text-sm text-gray-600'>대기 중인 주문</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-green-600 mb-2'>--</div>
              <div className='text-sm text-gray-600'>준비 중인 주문</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-orange-600 mb-2'>--</div>
              <div className='text-sm text-gray-600'>웨이팅 고객</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
