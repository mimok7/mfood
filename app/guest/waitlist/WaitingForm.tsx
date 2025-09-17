"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const WaitlistBoard = dynamic(() => import('./WaitlistBoard'), { ssr: false })

type Props = { restaurantId?: string; wt?: string }

export default function WaitingForm({ restaurantId, wt }: Props): JSX.Element {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)
  const [blockedReason, setBlockedReason] = useState<string | null>(null)

  // success UI state
  const [modalOpen, setModalOpen] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [position, setPosition] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [showBoard, setShowBoard] = useState(false)
  const [successName, setSuccessName] = useState('')

  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 3500)
    return () => clearTimeout(t)
  }, [showToast])

  // Block on reload/back-forward navigation or after a submission in this tab
  useEffect(() => {
    try {
      const key = restaurantId ? `wl_done_${restaurantId}` : null
      if (key && sessionStorage.getItem(key) === '1') {
        setBlocked(true)
        setBlockedReason('이미 등록을 완료했습니다. 다시 등록하려면 QR을 재스캔해 주세요.')
        return
      }

      const navs = ((performance as any)?.getEntriesByType?.('navigation') || []) as any[]
      const navType = navs[0]?.type
      if (navType === 'reload') {
        setBlocked(true)
        setBlockedReason('새로 고침으로 재접속했습니다. 다시 등록하려면 QR을 재스캔해 주세요.')
        return
      }
      if (navType === 'back_forward') {
        setBlocked(true)
        setBlockedReason('뒤로가기로 재접속했습니다. 다시 등록하려면 QR을 재스캔해 주세요.')
        return
      }

      const onPageShow = (e: any) => {
        if (e?.persisted) {
          setBlocked(true)
          setBlockedReason('이전 페이지에서 복귀했습니다. 다시 등록하려면 QR을 재스캔해 주세요.')
        }
      }
      window.addEventListener('pageshow', onPageShow)
      return () => window.removeEventListener('pageshow', onPageShow)
    } catch {
      // ignore
    }
  }, [restaurantId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (blocked) {
      setMessage(blockedReason || '이 페이지에서는 입력할 수 없습니다. QR을 재스캔해 주세요.')
      return
    }
    setLoading(true)
    setMessage(null)

    if (!restaurantId) {
      setMessage('레스토랑 정보가 없습니다. 올바른 URL로 접속해 주세요.')
      setLoading(false)
      return
    }

    try {
      const payload: any = { name, phone, party_size: partySize, restaurant_id: restaurantId }
      if (wt) payload.wt = wt

      const res = await fetch('/api/guest/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const json = await res.json()
        if (res.ok) {
          const pos = json.position ?? null
          const id = json.id ?? null
          setPosition(pos)
          setTicketId(id)
          setSuccessName(name)
          setModalOpen(true)
          setShowToast(true)
          setName('')
          setPhone('')
          setPartySize(2)
          setShowBoard(true)
          try {
            const key = restaurantId ? `wl_done_${restaurantId}` : null
            if (key) sessionStorage.setItem(key, '1')
          } catch {}
        } else {
          setMessage(json.error || '대기 등록 중 오류가 발생했습니다')
        }
      } else {
        if (res.ok) {
          setMessage('대기 등록이 완료되었습니다. (응답 형식이 예상과 다릅니다)')
          setName('')
          setPhone('')
          setPartySize(2)
          setShowBoard(true)
          try {
            const key = restaurantId ? `wl_done_${restaurantId}` : null
            if (key) sessionStorage.setItem(key, '1')
          } catch {}
        } else {
          const text = await res.text()
          setMessage(text || '대기 등록 중 오류가 발생했습니다')
        }
      }
    } catch {
      setMessage('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  if (showBoard && restaurantId) {
    return (
      <div className="space-y-4">
        <div className="bg-green-600 text-white rounded-2xl p-4">
          <div className="font-semibold">대기 신청이 완료되었습니다.</div>
          {position ? (
            <div className="text-sm text-green-100 mt-1">현재 대기번호: {position}</div>
          ) : null}
          {successName ? (
            <div className="text-sm text-green-100 mt-1">대기자: {successName}</div>
          ) : null}
          {ticketId ? (
            <div className="text-[11px] text-white/80 mt-1">직원확인 코드: {ticketId}</div>
          ) : null}
        </div>
        <WaitlistBoard restaurantId={restaurantId} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      {blocked && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
          🔒 {blockedReason || '보안 정책으로 인해 이 페이지에서는 다시 입력할 수 없습니다. QR을 재스캔해 주세요.'}
        </div>
      )}
      {!restaurantId && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
          ⚠️ 레스토랑 정보가 확인되지 않습니다. 올바른 URL로 접속해 주세요.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm text-gray-700">이름
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded px-3 py-2 mt-1" disabled={blocked} />
        </label>
        <label className="text-sm text-gray-700">연락처
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" disabled={blocked} />
          <p className="text-xs text-gray-500 mt-1">입력하신 연락처는 대기 호출을 위해서만 사용됩니다.</p>
        </label>
        <label className="text-sm text-gray-700">인원수
          <input type="number" value={partySize} onChange={e => setPartySize(Number(e.target.value))} min={1} className="w-full border rounded px-3 py-2 mt-1" disabled={blocked} />
        </label>

        <button type="submit" disabled={blocked || loading || !restaurantId} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? '등록 중…' : '대기 등록'}
        </button>
        {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
      </div>

      {showToast && (
        <div className="fixed right-4 bottom-6 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded shadow-lg">대기 등록 완료{position ? ` — 대기번호 ${position}` : ''}</div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 max-w-lg mx-4" aria-live="polite">
            <h2 className="text-lg font-semibold">대기 등록이 완료되었습니다</h2>
            <p className="mt-2 text-sm text-gray-700">{position ? `대기번호: ${position}` : '대기번호 정보가 없습니다'}</p>
            {successName ? (
              <p className="mt-1 text-sm text-gray-700">대기자: {successName}</p>
            ) : null}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-60"
                onClick={async () => {
                  if (!position) return
                  try {
                    const text = `대기번호 ${position}`
                    await navigator.clipboard.writeText(text)
                    setMessage('대기번호가 클립보드에 복사되었습니다')
                  } catch (e) {
                    setMessage('복사에 실패했습니다')
                  }
                }}
                disabled={position == null}
              >
                대기번호 복사
              </button>

              <button
                type="button"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                onClick={async () => {
                  if (!position) return
                  try {
                    const origin = window.location?.origin ?? ''
                    const ridParam = restaurantId ? `restaurant_id=${encodeURIComponent(restaurantId)}` : ''
                    const url = `${origin}/guest/waitlist?${ridParam}&position=${encodeURIComponent(String(position))}`
                    await navigator.clipboard.writeText(url)
                    setMessage('대기 URL이 클립보드에 복사되었습니다')
                  } catch (e) {
                    setMessage('복사에 실패했습니다')
                  }
                }}
                disabled={position == null}
              >
                URL 복사
              </button>

              <button type="button" className="ml-auto text-sm text-gray-600 px-2 py-1" onClick={() => setModalOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
