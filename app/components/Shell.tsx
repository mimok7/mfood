"use client"

import React from 'react'
import { usePathname } from 'next/navigation'

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''
  const isAuthPage = pathname.startsWith('/auth')
  const isAreaLayout = pathname.startsWith('/admin') || pathname.startsWith('/manager')

  if (isAuthPage) {
    return <>{children}</>
  }

  // 기본: 전역 사이드바와 헤더를 제거하고 컨텐츠만 렌더링합니다.
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto p-0">{children}</div>
    </div>
  )
}
