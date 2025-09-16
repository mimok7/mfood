"use client"

import React, { useEffect, useState } from 'react'

export default function RestaurantsEditor({ initialRestaurants }: { initialRestaurants: Array<{ id: string; name: string; slug?: string }> }) {
  const [restaurants] = useState(initialRestaurants)
  const [selected, setSelected] = useState<string | null>(restaurants[0]?.id ?? null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selected) fetchDetails(selected)
  }, [selected])

  useEffect(() => {
    // persist selected restaurant for admin layout via a server-set cookie
    if (!selected) return
    ;(async () => {
      try {
        await fetch('/api/admin/restaurants/select', { method: 'POST', body: JSON.stringify({ id: selected }), headers: { 'Content-Type': 'application/json' } })
      } catch (e) {
        // ignore
      }
    })()
  }, [selected])

  async function fetchDetails(id: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/restaurants/${id}/details`)
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    setError(null)
    const form = new FormData(e.target as HTMLFormElement)
    try {
      const res = await fetch(`/api/admin/restaurants/${selected}/settings`, { method: 'POST', body: form })
      if (!res.ok) throw new Error(await res.text())
      alert('저장되었습니다')
      await fetchDetails(selected)
    } catch (err: any) {
      setError(err.message || '저장 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* 레스토랑 선택 섹션 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">레스토랑 선택</h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">관리할 레스토랑</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={selected ?? ''}
            onChange={(e) => setSelected(e.target.value)}
          >
            {restaurants.map(r => <option key={r.id} value={r.id}>{r.name} {r.slug ? `(/${r.slug})` : ''}</option>)}
          </select>
        </div>
      </div>

      {/* 로딩 및 에러 상태 */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">데이터를 불러오는 중...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* 레스토랑 상세 정보 폼 */}
      {data && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">레스토랑 정보 설정</h2>
            <p className="text-sm text-gray-600 mt-1">기본 정보와 테이블을 관리하세요</p>
          </div>

          <div className="p-6 space-y-8">
            {/* 기본 정보 섹션 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상호명</label>
                  <input
                    name="name"
                    defaultValue={data.restaurant?.name ?? ''}
                    placeholder="레스토랑 이름"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">슬러그</label>
                  <input
                    name="slug"
                    defaultValue={data.restaurant?.slug ?? ''}
                    placeholder="restaurant-slug"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                  <input
                    name="phone"
                    defaultValue={data.restaurant?.phone ?? ''}
                    placeholder="02-123-4567"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={data.restaurant?.email ?? ''}
                    placeholder="contact@restaurant.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                  <input
                    name="address"
                    defaultValue={data.restaurant?.address ?? ''}
                    placeholder="서울시 강남구..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 테이블 관리 섹션 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">테이블 관리</h3>
              <div className="space-y-4">
                {/* 기존 테이블 목록 */}
                {(data.tables ?? []).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">기존 테이블</h4>
                    <div className="space-y-3">
                      {(data.tables ?? []).map((t: any, idx: number) => (
                        <div key={t.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <input type="hidden" name="table_id[]" value={t.id} />
                          <div className="flex-1">
                            <input
                              name="table_name[]"
                              defaultValue={t.name}
                              placeholder={`테이블 ${idx + 1}`}
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="w-32">
                            <input
                              name="table_capacity[]"
                              type="number"
                              defaultValue={t.capacity}
                              min="1"
                              max="20"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <span className="text-sm text-gray-600">명</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 새 테이블 추가 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">새 테이블 추가</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-blue-800 mb-2">추가할 테이블 수</label>
                      <input
                        name="add_table_count"
                        type="number"
                        defaultValue={0}
                        min="0"
                        max="20"
                        className="w-full border border-blue-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-blue-800 mb-2">기본 수용인원</label>
                      <input
                        name="new_table_capacity"
                        type="number"
                        defaultValue={4}
                        min="1"
                        max="20"
                        className="w-full border border-blue-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    설정 저장
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
