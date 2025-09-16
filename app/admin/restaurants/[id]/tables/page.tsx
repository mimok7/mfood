export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'
import TableSettingsForm from './TableSettingsForm'

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
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {(tables ?? []).map((table: any, idx: number) => (
                <div key={table.id} className='bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                      <span className='text-blue-600 font-semibold text-sm'>{idx + 1}</span>
                    </div>
                    <span className='text-xs bg-gray-200 px-2 py-1 rounded'>Token: {table.token?.substring(0, 8)}...</span>
                  </div>
                  <div className='mb-3'>
                    <div className='font-medium text-gray-900 text-lg'>{table.name || `테이블 ${idx + 1}`}</div>
                    <div className='text-sm text-gray-500 mt-1'>🪑 {table.capacity || 4}명 수용</div>
                  </div>
                  <div className='flex justify-end'>
                    <button className='text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors'>
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
