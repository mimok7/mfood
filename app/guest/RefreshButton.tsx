"use client"
import React from 'react'

export default function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 min-w-[140px] bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
    >
      <span>🔄</span>
      <span>새로고침</span>
    </button>
  )
}
