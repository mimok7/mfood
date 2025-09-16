'use client'

export function PrintButton() {
  return (
    <div
      className='bg-white text-green-600 px-6 py-3 rounded-lg font-medium shadow-sm flex items-center cursor-pointer border-2 border-dashed border-green-300 hover:bg-green-50 transition-colors'
      onClick={() => window.print()}
    >
      <span className='mr-2'>🖨️</span>
      PDF 인쇄하기 (Ctrl+P 또는 우클릭 → 인쇄)
    </div>
  )
}