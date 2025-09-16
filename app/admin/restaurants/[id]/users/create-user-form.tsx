"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUserForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'guest'|'manager'|'admin'>('guest')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role, restaurant_id: restaurantId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '서버 오류')

      setEmail('')
      setName('')
      setRole('guest')
      router.refresh()
      alert('사용자를 생성했습니다. (초기 비밀번호/이메일 확인 필요)')
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">이메일 주소</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
          placeholder="user@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">사용자 이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
          placeholder="홍길동"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">사용자 역할</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white"
        >
          <option value="guest">👤 게스트 (Guest)</option>
          <option value="manager">👨‍💼 매니저 (Manager)</option>
          <option value="admin">⚙️ 관리자 (Admin)</option>
        </select>
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
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              사용자 생성 중...
            </>
          ) : (
            <>
              <span className="mr-2">👤</span>
              사용자 생성
            </>
          )}
        </button>
      </div>
    </form>
  )
}
