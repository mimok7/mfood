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

  // admin/manager 영역은 화면 너비 전체 사용
  if (isAreaLayout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full">{children}</div>
      </div>
    )
  }

  // 기본: 중앙 정렬 컨테이너 유지
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto p-0">{children}</div>
    </div>
  )
}
