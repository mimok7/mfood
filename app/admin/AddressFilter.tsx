import { supabaseAdmin } from '@/lib/supabase-admin'

interface AddressFilterProps {
  currentFilter?: string
}

export default async function AddressFilter({ currentFilter = '' }: AddressFilterProps) {
  // 모든 주소 목록 가져오기 (필터 드롭다운용)
  const { data: allRestaurants } = await supabaseAdmin()
    .from('restaurants')
    .select('address')
    .not('address', 'is', null)

  // 주소 목록 추출 (중복 제거)
  const addresses = Array.from(
    new Set(
      allRestaurants
        ?.map(r => r.address)
        .filter((addr): addr is string => addr !== null && addr.trim() !== '') || []
    )
  ).sort()

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
        <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
          <span className='mr-2'>🔍</span>
          식당 필터
        </h3>
      </div>
      <form method='GET' action='' className='p-6'>
        <div className='max-w-md'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주소로 검색
          </label>
          <div className='flex gap-2'>
            <select
              name='address'
              defaultValue={currentFilter}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white"
            >
              <option value="">전체 주소</option>
              {addresses.map(address => (
                <option key={address} value={address}>
                  {address}
                </option>
              ))}
            </select>
            <button
              type='submit'
              className='px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              검색
            </button>
            {currentFilter && (
              <a
                href='/admin'
                className='px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors'
              >
                해제
              </a>
            )}
          </div>
          {currentFilter && (
            <div className='mt-2'>
              <span className='text-sm text-gray-600'>
                현재 필터: {currentFilter}
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}