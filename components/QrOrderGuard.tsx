"use client"

import { useEffect, useState } from 'react'

type Props = {
  restaurantId: string
  token: string
  tableId: string | number
}

export default function QrOrderGuard({ restaurantId, token, tableId }: Props) {
  const [blocked, setBlocked] = useState(false)
  const storageKey = `qr_done_${restaurantId}_${token}`

  useEffect(() => {
    function disableForm(form: HTMLFormElement | null) {
      if (!form) return
      const fields = form.querySelectorAll<HTMLElement>('button, input, select, textarea')
      fields.forEach((el: any) => {
        try {
          if ('disabled' in el) el.disabled = true
          el.setAttribute?.('aria-disabled', 'true')
        } catch {}
      })
      form.setAttribute('data-order-blocked', 'true')
    }

    const form = document.querySelector<HTMLFormElement>(`form[data-cart-form="true"][data-table-id="${tableId}"]`) || document.querySelector<HTMLFormElement>('form[data-cart-form="true"]')

    // If already ordered in this tab, block immediately
    try {
      if (sessionStorage.getItem(storageKey) === '1') {
        setBlocked(true)
        disableForm(form)
      }
    } catch {}

    // Guard on reload/back-forward restoration
    try {
      const navs = ((performance as any)?.getEntriesByType?.('navigation') || []) as any[]
      const navType = navs[0]?.type
      if (navType === 'reload' || navType === 'back_forward') {
        if (sessionStorage.getItem(storageKey) === '1') {
          setBlocked(true)
          disableForm(form)
        }
      }
    } catch {}

    const onPageShow = (e: any) => {
      if (e?.persisted) {
        try {
          if (sessionStorage.getItem(storageKey) === '1') {
            setBlocked(true)
            disableForm(form)
          }
        } catch {}
      }
    }
    window.addEventListener('pageshow', onPageShow)

    // When the form is submitted (order attempt), set the flag
    const onSubmit = (ev: Event) => {
      try {
        sessionStorage.setItem(storageKey, '1')
      } catch {}
      setBlocked(true)
      disableForm(form)
    }
    form?.addEventListener('submit', onSubmit, { capture: true })

    return () => {
      window.removeEventListener('pageshow', onPageShow)
      form?.removeEventListener('submit', onSubmit, { capture: true } as any)
    }
  }, [restaurantId, token, tableId, storageKey])

  if (!blocked) return null

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center px-4">
      <div className="max-w-screen-sm w-full bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-xl shadow p-3 text-sm text-center">
        이미 주문을 완료했습니다. 다음 주문을 하려면 QR을 다시 스캔해 주세요.
      </div>
    </div>
  )
}
