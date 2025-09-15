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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">이메일</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">이름</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">역할</label>
        <select value={role} onChange={(e) => setRole(e.target.value as any)} className="mt-1 block w-full rounded border-gray-300 shadow-sm">
          <option value="guest">게스트 (guest)</option>
          <option value="manager">매니저 (manager)</option>
          <option value="admin">관리자 (admin)</option>
        </select>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div>
        <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? '생성 중...' : '사용자 생성'}
        </button>
      </div>
    </form>
  )
}
