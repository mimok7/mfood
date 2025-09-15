import React from 'react'
import CreateUserForm from './create-user-form'

interface Props {
  params?: Promise<{ id: string }>
}

export default async function UsersPage({ params }: Props) {
  const resolved = params ? await params : { id: '' }
  const { id } = resolved

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">사용자 관리</h2>
        <p className="text-sm text-gray-500">식당 ID: {id}</p>
      </div>

      <section className="bg-white p-6 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-4">새 사용자 생성</h3>
        {/* @ts-ignore Server -> renders client component */}
        <CreateUserForm restaurantId={id} />
      </section>
    </div>
  )
}
