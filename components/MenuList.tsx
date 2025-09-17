// @ts-nocheck
'use client'

import { useState } from 'react'

type Category = { id: string; name: string; position: number }
type MenuItem = {
  id: string
  name: string
  price: number
  image_url: string | null
  is_active: boolean
  category_id: string | null
  created_at: string
}

export default function MenuList({
  categories,
  initialItems,
  selectedCategory = 'all',
  restaurantId
}: {
  categories: Category[]
  initialItems: MenuItem[]
  selectedCategory?: string
  restaurantId: string
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    category_id: '',
    image_url: '',
    is_active: true
  })

  const filteredItems = selectedCategory === 'all'
    ? items
    : selectedCategory === 'uncategorized'
    ? items.filter(item => !item.category_id)
    : items.filter(item => item.category_id === selectedCategory)

  const categorizedItems = categories.map(category => ({
    category,
    items: items.filter(item => item.category_id === category.id)
  })).filter(({ items }) => items.length > 0)

  const uncategorizedItems = items.filter(item => !item.category_id)

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setEditForm({
      name: item.name,
      price: item.price.toString(),
      category_id: item.category_id || '',
      image_url: item.image_url || '',
      is_active: item.is_active
    })
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/restaurants/${restaurantId}/menu/item/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== itemId))
        alert('메뉴가 삭제되었습니다.')
      } else {
        alert('메뉴 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('메뉴 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleUpdate = async () => {
    if (!editingItem) return

    try {
      const formData = new FormData()
      formData.append('name', editForm.name)
      formData.append('price', editForm.price)
      formData.append('category_id', editForm.category_id)
      formData.append('image_url', editForm.image_url)
      formData.append('is_active', editForm.is_active.toString())

      const response = await fetch(`/api/admin/restaurants/${restaurantId}/menu/item/${editingItem.id}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setItems(prev => prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                name: editForm.name,
                price: Number(editForm.price),
                category_id: editForm.category_id || null,
                image_url: editForm.image_url || null,
                is_active: editForm.is_active
              }
            : item
        ))
        setEditingItem(null)
        alert('메뉴가 수정되었습니다.')
      } else {
        alert('메뉴 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('메뉴 수정 중 오류가 발생했습니다.')
    }
  }

  const MenuCard = ({ item }: { item: MenuItem }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                item.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.is_active ? '판매중' : '품절'}
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600 mb-2">
            {item.price.toLocaleString()}원
          </p>
          <p className="text-xs text-gray-400">
            추가일: {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => handleEdit(item)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            수정
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="space-y-6">
        {/* 필터링된 메뉴 표시 */}
        {selectedCategory === 'all' ? (
          // 전체 표시 모드: 카테고리별로 그룹화
          <>
            {categorizedItems.map(({ category, items }) => (
              <div key={category.id} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {category.name}
                  <span className="ml-2 text-sm text-gray-500">({items.length}개)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}

            {/* 카테고리 없는 메뉴 */}
            {uncategorizedItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  분류되지 않은 메뉴
                  <span className="ml-2 text-sm text-gray-500">({uncategorizedItems.length}개)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uncategorizedItems.map(item => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          // 필터링 모드: 선택된 카테고리의 메뉴만 표시
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              {selectedCategory === 'uncategorized' ? '분류되지 않은 메뉴' : categories.find(c => c.id === selectedCategory)?.name || '선택된 카테고리'}
              <span className="ml-2 text-sm text-gray-500">({filteredItems.length}개)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* 메뉴가 없을 때 */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">메뉴 항목이 없습니다</h3>
            <p className="text-gray-500">위의 폼을 사용하여 첫 번째 메뉴 항목을 추가하세요.</p>
          </div>
        )}
      </div>

      {/* 수정 모달 */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">메뉴 수정</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">메뉴 이름</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">카테고리 없음</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사진 URL</label>
                <input
                  type="url"
                  value={editForm.image_url}
                  onChange={(e) => setEditForm(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">판매중</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                수정
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}