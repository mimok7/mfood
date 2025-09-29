"use client"

import React, { useState } from 'react'

type MenuItem = {
  id: string
  name: string
  price: number
  category_id: string
  menu_categories: { name: string } | null
}

type MenuOption = {
  id: string
  name: string
  price_delta: number
  is_active: boolean
  position: number
}

type OptionGroup = {
  id: string
  menu_item_id: string
  name: string
  min_select: number
  max_select: number
  required: boolean
  position: number
  menu_options: MenuOption[]
}

interface Props {
  restaurantId: string
  menuItems: MenuItem[]
  optionGroups: OptionGroup[]
}

export default function MenuOptionsClient({ restaurantId, menuItems, optionGroups }: Props) {
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [showAddGroupForm, setShowAddGroupForm] = useState(false)
  const [showAddOptionForm, setShowAddOptionForm] = useState<string | null>(null)

  // 선택된 메뉴 아이템의 옵션 그룹들
  const selectedItemGroups = optionGroups.filter(g => g.menu_item_id === selectedItemId)

  const handleAddGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/menu/option-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_item_id: selectedItemId,
          name: form.get('name'),
          min_select: parseInt(form.get('min_select') as string) || 0,
          max_select: parseInt(form.get('max_select') as string) || 1,
          required: form.get('required') === 'on'
        })
      })

      if (res.ok) {
        window.location.reload()
      } else {
        const error = await res.json()
        alert(error.error || '그룹 추가에 실패했습니다')
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다')
    }
  }

  const handleAddOption = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/menu/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_id: showAddOptionForm,
          name: form.get('name'),
          price_delta: parseInt(form.get('price_delta') as string) || 0
        })
      })

      if (res.ok) {
        window.location.reload()
      } else {
        const error = await res.json()
        alert(error.error || '옵션 추가에 실패했습니다')
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다')
    }
  }

  const deleteOption = async (optionId: string) => {
    if (!confirm('이 옵션을 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/menu/options/${optionId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        window.location.reload()
      } else {
        const error = await res.json()
        alert(error.error || '삭제에 실패했습니다')
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다')
    }
  }

  const deleteGroup = async (groupId: string) => {
    if (!confirm('이 옵션 그룹과 모든 옵션을 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/menu/option-groups/${groupId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        window.location.reload()
      } else {
        const error = await res.json()
        alert(error.error || '삭제에 실패했습니다')
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다')
    }
  }

  return (
    <div className="space-y-6">
      {/* 메뉴 아이템 선택 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">1. 메뉴 아이템 선택</h2>
        <select 
          value={selectedItemId} 
          onChange={(e) => setSelectedItemId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">옵션을 관리할 메뉴를 선택하세요</option>
          {menuItems.map(item => (
            <option key={item.id} value={item.id}>
              {item.menu_categories?.name || '기타'} - {item.name} ({item.price.toLocaleString()}원)
            </option>
          ))}
        </select>
      </div>

      {selectedItemId && (
        <>
          {/* 옵션 그룹 목록 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">2. 옵션 그룹 관리</h2>
              <button
                onClick={() => setShowAddGroupForm(!showAddGroupForm)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                + 그룹 추가
              </button>
            </div>

            {showAddGroupForm && (
              <form onSubmit={handleAddGroup} className="bg-gray-50 p-4 rounded mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    name="name"
                    placeholder="그룹 이름 (예: 사이즈)"
                    required
                    className="border rounded px-3 py-2"
                  />
                  <input
                    name="min_select"
                    type="number"
                    placeholder="최소 선택 (0)"
                    min="0"
                    className="border rounded px-3 py-2"
                  />
                  <input
                    name="max_select"
                    type="number"
                    placeholder="최대 선택 (1)"
                    min="1"
                    className="border rounded px-3 py-2"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      name="required"
                      type="checkbox"
                      id="required"
                      className="rounded"
                    />
                    <label htmlFor="required" className="text-sm">필수 선택</label>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    추가
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddGroupForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {selectedItemGroups.map(group => (
                <div key={group.id} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">{group.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {group.min_select}-{group.max_select}개 선택
                        {group.required && ' (필수)'}
                      </span>
                      <button
                        onClick={() => setShowAddOptionForm(group.id)}
                        className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                      >
                        + 옵션 추가
                      </button>
                      <button
                        onClick={() => deleteGroup(group.id)}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                      >
                        그룹 삭제
                      </button>
                    </div>
                  </div>

                  {showAddOptionForm === group.id && (
                    <form onSubmit={handleAddOption} className="bg-blue-50 p-3 rounded mb-3">
                      <div className="flex space-x-2">
                        <input
                          name="name"
                          placeholder="옵션 이름 (예: 라지)"
                          required
                          className="flex-1 border rounded px-3 py-2"
                        />
                        <input
                          name="price_delta"
                          type="number"
                          placeholder="가격 차이 (0)"
                          className="w-32 border rounded px-3 py-2"
                        />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                          추가
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowAddOptionForm(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {group.menu_options.map(option => (
                      <div key={option.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div>
                          <span className="font-medium">{option.name}</span>
                          {option.price_delta !== 0 && (
                            <span className="ml-2 text-sm text-gray-600">
                              ({option.price_delta > 0 ? '+' : ''}{option.price_delta.toLocaleString()}원)
                            </span>
                          )}
                          {!option.is_active && (
                            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">비활성</span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteOption(option.id)}
                          className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                    {group.menu_options.length === 0 && (
                      <p className="text-gray-500 text-center py-4">옵션이 없습니다</p>
                    )}
                  </div>
                </div>
              ))}
              {selectedItemGroups.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  이 메뉴에는 옵션 그룹이 없습니다.<br />
                  "그룹 추가" 버튼을 눌러 옵션 그룹을 만들어보세요.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}