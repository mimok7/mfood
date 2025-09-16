"use client"

import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-client'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/sign-in')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      // 에러가 발생해도 로그인 페이지로 이동
      router.push('/auth/sign-in')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
    >
      🚪 로그아웃
    </button>
  )
}