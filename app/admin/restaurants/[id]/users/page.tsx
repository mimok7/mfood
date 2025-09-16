import React from 'react'
import CreateUserForm from './create-user-form'

interface Props {
  params?: Promise<{ id: string }>
}

export default async function UsersPage({ params }: Props) {
  const resolved = params ? await params : { id: '' }
  const { id } = resolved

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2'>👥 사용자 관리</h1>
        <p className='text-blue-100'>레스토랑의 사용자 계정을 생성하고 관리하세요</p>
        <div className='mt-4 text-sm text-blue-200'>
          식당 ID: <code className='bg-blue-700 px-2 py-1 rounded text-xs'>{id}</code>
        </div>
      </div>

      {/* 사용자 생성 섹션 */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <span className='mr-2'>➕</span>
            새 사용자 생성
          </h2>
          <p className='text-sm text-gray-600 mt-1'>이메일, 이름, 역할을 입력하여 새 사용자를 추가하세요</p>
        </div>
        <div className='p-6'>
          {/* @ts-ignore Server -> renders client component */}
          <CreateUserForm restaurantId={id} />
        </div>
      </div>

      {/* 추가 정보 섹션 */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='text-lg font-medium text-blue-900 mb-3 flex items-center'>
          <span className='mr-2'>ℹ️</span>
          사용자 역할 안내
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
          <div className='bg-white p-4 rounded-lg border border-blue-200'>
            <div className='font-medium text-blue-900 mb-2'>👤 게스트 (Guest)</div>
            <div className='text-blue-700'>QR 토큰을 통한 주문만 가능</div>
          </div>
          <div className='bg-white p-4 rounded-lg border border-blue-200'>
            <div className='font-medium text-blue-900 mb-2'>👨‍💼 매니저 (Manager)</div>
            <div className='text-blue-700'>주문 관리, 메뉴 관리, 보고서 조회</div>
          </div>
          <div className='bg-white p-4 rounded-lg border border-blue-200'>
            <div className='font-medium text-blue-900 mb-2'>⚙️ 관리자 (Admin)</div>
            <div className='text-blue-700'>모든 기능 + 사용자/설정 관리</div>
          </div>
        </div>
      </div>
    </div>
  )
}
