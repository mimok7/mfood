export const dynamic = 'force-dynamic'
import { createSupabaseServer } from '@/lib/supabase-server'
import { requireRole } from '@/lib/auth'
import Link from 'next/link'

export default async function MenuPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer() as any

  // 메뉴 카테고리와 아이템들을 함께 가져오기
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('id, name, display_order')
    .eq('restaurant_id', restaurant_id)
    .order('display_order')

  const { data: items } = await supabase
    .from('menu_items')
    .select('id, name, price, description, image_url, is_available, category_id, menu_categories(name)')
    .eq('restaurant_id', restaurant_id)
    .order('name')

  // 카테고리별로 메뉴 아이템 그룹화
  const itemsByCategory = (items ?? []).reduce((acc: any, item: any) => {
    const categoryId = item.category_id || 'uncategorized'
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2'>🍽️ 메뉴 관리</h1>
        <p className='text-orange-100'>메뉴 항목을 추가, 수정, 삭제하고 카테고리를 관리하세요</p>
      </div>

      {/* 액션 버튼 */}
      <div className='flex flex-wrap gap-4'>
        <Link
          href={'/admin/restaurants/' + restaurant_id + '/menu' as any}
          className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          <span className='mr-2'>⚙️</span>
          관리자 메뉴 관리
        </Link>
        <Link
          href={'/manager/menu/categories' as any}
          className='inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
        >
          <span className='mr-2'>📁</span>
          카테고리 관리
        </Link>
        <Link
          href={'/manager/menu/new' as any}
          className='inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
        >
          <span className='mr-2'>➕</span>
          새 메뉴 추가
        </Link>
      </div>

      {/* 메뉴 목록 */}
      <div className='space-y-6'>
        {categories && categories.length > 0 ? (
          categories.map((category: any) => {
            const categoryItems = itemsByCategory[category.id] || []
            return (
              <div key={category.id} className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
                <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
                    <span className='mr-2'>📋</span>
                    {category.name}
                    <span className='ml-2 text-sm text-gray-500'>({categoryItems.length}개)</span>
                  </h2>
                </div>

                {categoryItems.length > 0 ? (
                  <div className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {categoryItems.map((item: any) => (
                        <div
                          key={item.id}
                          className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                            item.is_available ? 'border-gray-200' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          {item.image_url && (
                            <div className='w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100'>
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className='w-full h-full object-cover'
                              />
                            </div>
                          )}

                          <div className='space-y-2'>
                            <div className='flex items-start justify-between'>
                              <h3 className='text-lg font-semibold text-gray-900'>{item.name}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.is_available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.is_available ? '판매중' : '품절'}
                              </span>
                            </div>

                            <p className='text-2xl font-bold text-orange-600'>
                              {item.price.toLocaleString()}원
                            </p>

                            {item.description && (
                              <p className='text-sm text-gray-600 line-clamp-2'>
                                {item.description}
                              </p>
                            )}

                            <div className='flex gap-2 pt-2'>
                              <Link
                                href={'/manager/menu/' + item.id + '/edit' as any}
                                className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors'
                              >
                                ✏️ 수정
                              </Link>
                              <button
                                className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors ${
                                  item.is_available
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {item.is_available ? '품절처리' : '판매재개'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='p-12 text-center'>
                    <div className='text-4xl mb-4'>🍽️</div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>메뉴가 없습니다</h3>
                    <p className='text-gray-500 mb-4'>이 카테고리에 메뉴를 추가해보세요.</p>
                    <Link
                      href={('/manager/menu/new?category=' + category.id) as any}
                      className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      ➕ 메뉴 추가
                    </Link>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
            <div className='p-12 text-center'>
              <div className='text-6xl mb-4'>📋</div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>메뉴 카테고리가 없습니다</h3>
              <p className='text-gray-500 mb-6'>먼저 메뉴 카테고리를 생성한 후 메뉴를 추가하세요.</p>
              <Link
                href={'/manager/menu/categories' as any}
                className='inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
              >
                <span className='mr-2'>📁</span>
                카테고리 생성
              </Link>
            </div>
          </div>
        )}

        {/* 분류되지 않은 메뉴 */}
        {itemsByCategory['uncategorized'] && itemsByCategory['uncategorized'].length > 0 && (
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
                <span className='mr-2'>❓</span>
                분류되지 않은 메뉴
                <span className='ml-2 text-sm text-gray-500'>({itemsByCategory['uncategorized'].length}개)</span>
              </h2>
            </div>

            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {itemsByCategory['uncategorized'].map((item: any) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      item.is_available ? 'border-gray-200' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className='space-y-2'>
                      <div className='flex items-start justify-between'>
                        <h3 className='text-lg font-semibold text-gray-900'>{item.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_available ? '판매중' : '품절'}
                        </span>
                      </div>

                      <p className='text-2xl font-bold text-orange-600'>
                        {item.price.toLocaleString()}원
                      </p>

                      {item.description && (
                        <p className='text-sm text-gray-600 line-clamp-2'>
                          {item.description}
                        </p>
                      )}

                      <div className='flex gap-2 pt-2'>
                        <Link
                          href={('/manager/menu/' + item.id + '/edit') as any}
                          className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors'
                        >
                          ✏️ 수정
                        </Link>
                        <button
                          className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors ${
                            item.is_available
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {item.is_available ? '품절처리' : '판매재개'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
