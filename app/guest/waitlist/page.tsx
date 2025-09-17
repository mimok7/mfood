import { Suspense } from 'react'
import WaitingForm from '../WaitingForm'

export default function WaitlistPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">대기 등록</h1>
        <Suspense fallback={<div className="text-center">로딩 중...</div>}>
          <WaitingForm />
        </Suspense>
      </div>
    </div>
  )
}