import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import AddressFilter from './AddressFilter'

export const dynamic = 'force-dynamic'

interface AdminPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
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

      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>🏪</span>
            식당 목록
          </h2>
          <p className='text-sm text-gray-600 mt-1'>총 식당 중 {restaurants?.length ?? 0}개 표시{addressFilter && ` (필터: ${addressFilter})`}</p>
        </div>

        {restaurants && restaurants.length > 0 ? (
          <div className='p-4'>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3'>
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/admin/restaurants/${restaurant.id}`}
                  className='block bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group'
                >
                  <div className='text-center'>
                    <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors'>
                      <span className='text-lg'>🏪</span>
                    </div>
                    <h3 className='text-xs font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors line-clamp-2'>
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
