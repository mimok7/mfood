'use client'

import React from 'react'
import Button from './ui/Button'

interface Category {
  id: string
  name: string
  position: number
}

interface CategoryManagerProps {
  categories: Category[]
  restaurantId: string
}

export default function CategoryManager({ categories, restaurantId }: CategoryManagerProps) {
  const handleDelete = (categoryName: string) => {
    return confirm(`'${categoryName}' 카테고리를 정말 삭제하시겠습니까? 이 카테고리에 메뉴 아이템이 있으면 삭제할 수 없습니다.`)
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-3">기존 카테고리 관리</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <form action={`/api/admin/restaurants/${restaurantId}/menu/category/${category.id}`} method="post" className="space-y-3">
              <input name="_method" type="hidden" value="PATCH" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 이름</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={category.name}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
                <input
                  type="number"
                  name="position"
                  defaultValue={category.position}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="success"
                  size="sm"
                  className="flex-1"
                  completedText="수정 완료"
                  completedIcon="✓"
                  type="submit"
                >
                  ✓ 수정
                </Button>
              </div>
            </form>
            
            <form 
              action={`/api/admin/restaurants/${restaurantId}/menu/category/${category.id}`} 
              method="post"
              className="mt-2"
              onSubmit={(e) => {
                if (!handleDelete(category.name)) {
                  e.preventDefault()
                }
              }}
            >
              <input name="_method" type="hidden" value="DELETE" />
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                completedText="삭제 완료"
                completedIcon="🗑️"
                type="submit"
              >
                🗑️ 삭제
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}