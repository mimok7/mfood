"use client"
import React, { useState } from 'react'

export default function WaitingForm() {
  const [errors, setErrors] = useState<{ name?: string; partySize?: string }>( {})
  const [submitting, setSubmitting] = useState(false)
  const [modal, setModal] = useState<{ open: boolean; position: number | null; id?: string | null }>({ open: false, position: null, id: null })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = (formData.get('name') as string) || ''
    const phone = (formData.get('phone') as string) || ''
    const partySize = (formData.get('partySize') as string) || ''

    const newErrors: { name?: string; partySize?: string } = {}
    if (!name.trim()) newErrors.name = '이름을 입력해주세요.'
    if (!partySize) newErrors.partySize = '인원 수를 선택해주세요.'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    try {
      // try to read restaurant from URL (e.g., ?restaurant=uuid)
      let restaurant: string | null = null
      try {
        const sp = new URLSearchParams(window.location.search)
        restaurant = sp.get('restaurant')
      } catch {}

      const payload: any = {
        name,
        phone,
        party_size: partySize,
      }
      if (restaurant) payload.restaurant = restaurant

      const res = await fetch('/api/guest/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('api error', err)
        alert(err?.error || '대기 신청 중 오류가 발생했습니다.')
        return
      }

      const data = await res.json()
      setModal({ open: true, position: data.position ?? null, id: data.id ?? null })
      e.currentTarget.reset()
      setErrors({})
    } catch (err) {
      console.error(err)
      alert('대기 신청 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">대기 신청</h2>
        <p className="text-sm text-gray-500">정확한 정보를 입력하시면 호출 시 더 정확히 안내해 드립니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이름을 입력하세요"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
          <input
            name="phone"
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="010-0000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">인원 수</label>
          <select
            name="partySize"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">인원 수를 선택하세요</option>
            <option value="1">1명</option>
            <option value="2">2명</option>
            <option value="3">3명</option>
            <option value="4">4명</option>
            <option value="5+">5명 이상</option>
          </select>
          {errors.partySize && <p className="text-sm text-red-600 mt-1">{errors.partySize}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
            submitting ? 'bg-green-400 text-white' : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {submitting ? '처리중...' : '대기 신청하기'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs bg-yellow-100 text-black p-2 rounded">
        입력하신 연락처는 대기 호출을 위해서만 사용됩니다.
      </div>

      {/* modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal({ open: false, position: null, id: null })} />
          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-2">대기 신청 완료</h3>
            <p className="text-sm text-gray-700 mb-4">대기번호: <span className="font-mono text-xl">{modal.position ?? '—'}</span></p>
            <div className="text-right">
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setModal({ open: false, position: null, id: null })}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
