export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'
import MenuList from '@/components/MenuList'
import CategoryTabs from '@/components/CategoryTabs'
import CategoryManager from '@/components/CategoryManager'
import Button from '@/components/ui/Button'

export default async function AdminMenuPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const rid = resolvedParams.id
  const selectedCategory = String(resolvedSearchParams.category || 'all')

  if (!rid) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">식당 ID가 없습니다</h2>
        <p className="text-gray-600">올바른 URL로 접근해주세요.</p>
      </div>
    )
  }

  const sb = supabaseAdmin()

  const [{ data: categories }, { data: items }] = await Promise.all([
    sb.from('menu_categories').select('id, name, position, created_at').eq('restaurant_id', rid).order('position'),
    sb.from('menu_items').select(`
      id,
      name,
      price,
      image_url,
      is_active,
      category_id,
      created_at,
      menu_categories(name)
    `).eq('restaurant_id', rid).order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">메뉴 관리 (총 {items?.length || 0}개 메뉴)</h1>
          <p className="text-gray-600 mt-1">메뉴 카테고리와 메뉴 항목을 관리하세요</p>
        </div>
      </div>

      {/* 메시지 표시 */}
      {resolvedSearchParams.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-2">✅</div>
            <p className="text-green-800 font-medium">{String(resolvedSearchParams.success)}</p>
          </div>
        </div>
      )}

      {resolvedSearchParams.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-2">❌</div>
            <p className="text-red-800 font-medium">{String(resolvedSearchParams.error)}</p>
          </div>
        </div>
      )}

      {/* 카테고리 필터 탭 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏷️</span>
            <h2 className="text-lg font-semibold text-gray-900">카테고리 필터</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/admin/restaurants/${rid}/menu`}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              전체 ({items?.length || 0})
            </a>
            {categories?.map(category => {
              const categoryItems = items?.filter(item => item.category_id === category.id) || []
              return (
                <a
                  key={category.id}
                  href={`/admin/restaurants/${rid}/menu?category=${category.id}`}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {category.name} ({categoryItems.length})
                </a>
              )
            })}
            {items?.some(item => !item.category_id) && (
              <a
                href={`/admin/restaurants/${rid}/menu?category=uncategorized`}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'uncategorized'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                분류되지 않음 ({items?.filter(item => !item.category_id).length || 0})
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          {/* 메뉴 항목 추가 폼 */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">새 메뉴 항목 추가</h3>
              {/* 기본 메뉴 자동생성 버튼 */}
              <form action={`/api/admin/restaurants/${rid}/menu/auto-menu`} method="post" className="inline">
                <Button
                  variant="warning"
                  size="sm"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  completedText="메뉴 추가 완료"
                  completedIcon="🎉"
                  type="submit"
                >
                  <span>🍻</span>
                  기본 주류/음료 자동추가
                </Button>
              </form>
            </div>
            
            <form action={`/api/admin/restaurants/${rid}/menu/item`} method="post" className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                name="name"
                placeholder="메뉴 이름"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="가격"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                name="category_id"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">카테고리 없음</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input
                type="url"
                name="image_url"
                placeholder="사진 URL (선택사항)"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                variant="success"
                completedText="메뉴 생성 완료"
                completedIcon="✓"
                type="submit"
              >
                메뉴 추가
              </Button>
            </form>

            {/* 자동생성 안내 */}
            <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-700">
                <span className="font-medium">자동생성 메뉴:</span> 참이슬 프레쉬(5,000원), 처음처럼 프레쉬(5,000원), 사이다(2,000원), 콜라(2,000원)
              </p>
            </div>
          </div>

          <MenuList categories={categories as any} initialItems={items as any} restaurantId={rid} selectedCategory={selectedCategory} />

          {/* 카테고리 추가 폼 */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">새 카테고리 추가</h3>
              {/* 카테고리 자동생성 버튼 */}
              <form action={`/api/admin/restaurants/${rid}/menu/auto-categories`} method="post" className="inline">
                <Button
                  variant="info"
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  completedText="카테고리 생성 완료"
                  completedIcon="✨"
                  type="submit"
                >
                  <span>✨</span>
                  기본 카테고리 자동생성
                </Button>
              </form>
            </div>
            
            <form action={`/api/admin/restaurants/${rid}/menu/category`} method="post" className="flex gap-4">
              <input
                type="text"
                name="name"
                placeholder="카테고리 이름"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="position"
                placeholder="순서"
                defaultValue={0}
                className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="primary"
                completedText="카테고리 생성 완료"
                completedIcon="✓"
                type="submit"
              >
                추가
              </Button>
            </form>
            
            {/* 자동생성 안내 */}
            <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded-md">
              <p className="text-sm text-purple-700">
                <span className="font-medium">자동생성 카테고리:</span> 식사, 안주, 주류, 음료 (이미 있는 카테고리는 건너뜀)
              </p>
            </div>
          </div>

          {/* 기존 카테고리 관리 */}
          <CategoryManager categories={categories || []} restaurantId={rid} />
        </div>
      </div>
    </div>
  )
}
