// @ts-nocheck
'use client'

import { useState } from 'react'
import CategoryTabs from '@/components/CategoryTabs'
import MenuList from '@/components/MenuList'

type Category = { id: string; name: string; position: number }
type MenuItem = {
  id: string
  name: string
  price: number
  is_active: boolean
  category_id: string | null
  created_at: string
}

export default function MenuManager({
  categories,
  items,
  restaurantId
}: {
  categories: Category[]
  items: MenuItem[]
  restaurantId: string
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 카테고리 탭 */}
      <div className="border-b border-gray-200 p-4">
        <CategoryTabs
          categories={categories}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* 메뉴 추가 폼들 */}
      <div className="p-6 border-b border-gray-200">
        {/* 카테고리 추가 폼 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">새 카테고리 추가</h3>
          <form action={`/api/admin/restaurants/${restaurantId}/menu/category`} method="post" className="flex gap-4">
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
              추가
            </button>
          </form>
        </div>

        {/* 메뉴 항목 추가 폼 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">새 메뉴 항목 추가</h3>
          <form action={`/api/admin/restaurants/${restaurantId}/menu/item`} method="post" className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium">
              메뉴 추가
            </button>
          </form>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="p-6">
        <MenuList
          categories={categories}
          items={items}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  )
}