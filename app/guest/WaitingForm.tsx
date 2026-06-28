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
      // try to read restaurant_id from URL (e.g., ?restaurant_id=uuid)
      let restaurantId: string | null = null
      let wt: string | null = null
      try {
        const sp = new URLSearchParams(window.location.search)
        restaurantId = sp.get('restaurant_id')
        wt = sp.get('wt')
      } catch {}

      const payload: any = {
        name,
        phone,
        party_size: partySize,
      }
  if (restaurantId) payload.restaurant_id = restaurantId
  if (wt) payload.wt = wt

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
    <div className="text-left">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1 ml-1 uppercase tracking-wider">이름</label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-starbucks-green focus:outline-none text-slate-800 font-semibold placeholder:text-slate-400 bg-slate-50/50 transition-all text-xs"
            placeholder="이름을 입력하세요"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1 ml-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1 ml-1 uppercase tracking-wider">연락처</label>
          <input
            name="phone"
            type="tel"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-starbucks-green focus:outline-none text-slate-800 font-semibold placeholder:text-slate-400 bg-slate-50/50 transition-all text-xs"
            placeholder="010-0000-0000"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1 ml-1 uppercase tracking-wider">인원 수</label>
          <select
            name="partySize"
            required
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-starbucks-green focus:outline-none text-slate-800 font-semibold bg-slate-50/50 transition-all text-xs cursor-pointer"
          >
            <option value="">인원 수를 선택하세요</option>
            <option value="1">1명</option>
            <option value="2">2명</option>
            <option value="3">3명</option>
            <option value="4">4명</option>
            <option value="5+">5명 이상</option>
          </select>
          {errors.partySize && <p className="text-xs text-red-600 mt-1 ml-1">{errors.partySize}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3.5 rounded-full text-base font-bold text-center transition-all shadow-md btn-starbucks active:scale-95 ${
            submitting ? 'bg-starbucks-green/50 text-white cursor-not-allowed' : 'bg-starbucks-accent text-white hover:bg-starbucks-green'
          }`}
        >
          {submitting ? '처리중...' : '대기 신청하기'}
        </button>
      </form>

      <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-900 leading-normal flex items-start gap-1.5 shadow-sm">
        <span className="text-sm leading-none">⚠️</span>
        <div>
          <p>입력하신 연락처는 대기 호출 목적 외에 다른 용도로 절대 사용되지 않으며 호출 즉시 안전하게 파기됩니다.</p>
        </div>
      </div>

      {/* modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal({ open: false, position: null, id: null })} />
          <div className="relative bg-white rounded-3xl p-6 w-[90%] max-w-sm border border-slate-100 shadow-2xl text-center animate-fade-in">
            <div className="w-12 h-12 bg-starbucks-light/60 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🎉</span>
            </div>
            <h3 className="text-lg font-black text-starbucks-house mb-2">대기 신청 완료</h3>
            <p className="text-sm text-starbucks-textBlackSoft mb-4">
              대기 등록이 정상적으로 완료되었습니다.
            </p>
            <div className="bg-starbucks-canvas/50 p-4 rounded-2xl mb-6">
              <p className="text-[10px] font-bold text-starbucks-textBlackSoft uppercase tracking-wider mb-1">대기 순서</p>
              <p className="text-3xl font-mono font-black text-starbucks-green">{modal.position ?? '—'}번</p>
            </div>
            <button 
              className="w-full py-3 bg-starbucks-accent hover:bg-starbucks-green text-white text-sm font-bold rounded-full btn-starbucks shadow-sm active:scale-95 transition-all" 
              onClick={() => setModal({ open: false, position: null, id: null })}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
