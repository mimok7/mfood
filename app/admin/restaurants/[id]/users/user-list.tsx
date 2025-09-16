"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  full_name: string | null
  role: 'guest' | 'manager' | 'admin'
  created_at: string
  updated_at: string
}

interface UserListProps {
  restaurantId: string
}

export default function UserList({ restaurantId }: UserListProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    full_name: '',
    password: ''
  })

  // 사용자 목록 불러오기
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/users`)
      const data = await res.json()

      if (!res.ok) throw new Error(data?.error || '사용자 목록을 불러오는데 실패했습니다')

      setUsers(data.users || [])
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [restaurantId])

  // 편집 시작
  const startEditing = (user: User) => {
    setEditingUser(user.id)
    setEditForm({
      full_name: user.full_name || '',
      password: ''
    })
  }

  // 편집 취소
  const cancelEditing = () => {
    setEditingUser(null)
    setEditForm({ full_name: '', password: '' })
  }

  // 사용자 정보 업데이트
  const updateUser = async (userId: string) => {
    try {
      const requestBody: any = {
        name: editForm.full_name,
        role: users.find(u => u.id === userId)?.role || 'guest'
      }

      // 비밀번호가 입력된 경우에만 포함
      if (editForm.password.trim()) {
        requestBody.password = editForm.password
      }

      const res = await fetch(`/api/admin/restaurants/${restaurantId}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '사용자 정보 업데이트 실패')

      // 목록 새로고침
      await fetchUsers()
      setEditingUser(null)
      setEditForm({ full_name: '', password: '' })

      alert('사용자 정보가 업데이트되었습니다.')
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류')
    }
  }

  // 사용자 삭제
  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`정말로 사용자 "${email}"을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/users/${userId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || '사용자 삭제 실패')
      }

      // 목록 새로고침
      await fetchUsers()
      alert('사용자가 삭제되었습니다.')
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류')
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'guest': return '👤 게스트'
      case 'manager': return '👨‍💼 매니저'
      case 'admin': return '⚙️ 관리자'
      default: return role
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">사용자 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-2">⚠️</div>
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">👥</span>
          등록된 사용자 목록 ({users.length}명)
        </h2>
        <p className="text-sm text-gray-600 mt-1">사용자 정보를 확인하고 수정하세요</p>
      </div>

      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            등록된 사용자가 없습니다.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="이름을 입력하세요"
                      />
                    ) : (
                      user.full_name || <span className="text-gray-400 italic">이름 없음</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getRoleDisplay(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editingUser === user.id ? (
                      <>
                        <input
                          type="password"
                          value={editForm.password}
                          onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                          className="inline-block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mr-2"
                          placeholder="새 비밀번호"
                          minLength={6}
                        />
                        <button
                          onClick={() => updateUser(user.id)}
                          className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          💾 저장
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          ❌ 취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(user)}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          ✏️ 편집
                        </button>
                        <button
                          onClick={() => deleteUser(user.id, user.email)}
                          className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          🗑️ 삭제
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}