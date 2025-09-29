import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import AddressFilter from './AddressFilter'
import RestaurantList from './RestaurantList'

export const dynamic = 'force-dynamic'

interface AdminPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireRole('admin')

  const resolvedSearchParams = await searchParams

  // 주소 필터 파라미터 가져오기
  const addressFilter = typeof resolvedSearchParams.address === 'string' ? resolvedSearchParams.address : ''

  // 식당 목록 가져오기
  let query = supabaseAdmin()
    .from('restaurants')
    .select('id, name, slug, address, created_at')
    .order('created_at', { ascending: false })

  // 주소 필터 적용
  if (addressFilter) {
    query = query.ilike('address', `%${addressFilter}%`)
  }

  const { data: restaurants } = await query

  return (
    <>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2'>👑 관리자 패널</h1>
        <p className='text-blue-100'>식당 관리 및 시스템 설정</p>
      </div>

      {/* 식당 목록 섹션 */}
      <AddressFilter currentFilter={addressFilter} />

      <RestaurantList restaurants={restaurants || []} addressFilter={addressFilter} />

      {/* 추가 액션 섹션 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
              <span className='mr-2'>➕</span>
              새 식당 생성
            </h3>
          </div>
          <div className='p-4'>
            <p className='text-gray-600 mb-3'>새로운 식당을 추가하여 관리 시스템에 포함시키세요.</p>
            <Link
              href='/admin/restaurants/new'
              className='inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
            >
              <span className='mr-2'>🏪</span>
              식당 생성하기
            </Link>
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
              <span className='mr-2'>👥</span>
              시스템 사용자 관리
            </h3>
          </div>
          <div className='p-4'>
            <p className='text-gray-600 mb-3'>전체 시스템의 사용자 계정을 관리하세요.</p>
            <Link
              href={'/admin/users' as any}
              className='inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
            >
              <span className='mr-2'>👥</span>
              사용자 관리
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
