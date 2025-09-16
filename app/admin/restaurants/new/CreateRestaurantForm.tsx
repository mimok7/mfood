"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateRestaurantForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 슬러그 자동 생성
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    // 한글을 영문으로 변환하고 특수문자 제거
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // 특수문자 제거
      .replace(/\s+/g, '-') // 공백을 하이픈으로
      .replace(/-+/g, '-') // 연속 하이픈 제거
      .trim()
    setSlug(generatedSlug)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!name.trim()) {
      setError('식당 이름을 입력하세요')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/admin/restaurants/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() || null, address: address.trim() || null }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '식당 생성 실패')

      // 생성 성공 시 해당 식당의 설정 페이지로 이동
      router.push(`/admin/restaurants/${data.restaurant.id}/settings`)
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          식당 이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={handleNameChange}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-base"
          placeholder="예: 미목식당"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          식당 주소 <span className="text-gray-500">(선택사항)</span>
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-base"
          placeholder="예: 서울시 강남구 역삼동 123-45"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-2">⚠️</div>
            <div className="text-sm text-red-800">{error}</div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-base font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              식당 생성 중...
            </>
          ) : (
            <>
              <span className="mr-2">🏪</span>
              식당 생성
            </>
          )}
        </button>
      </div>
    </form>
  )
}