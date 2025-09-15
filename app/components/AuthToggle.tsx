"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'


export default function AuthToggle() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState<string>('')
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <div className="flex gap-2 mb-4">
          <button type="button" onClick={() => setMode('login')} className={`flex-1 py-2 rounded ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            로그인
          </button>
          <button type="button" onClick={() => setMode('signup')} className={`flex-1 py-2 rounded ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            회원가입
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={async (e) => {
            e.preventDefault()
            setMessage('')
            const form = new FormData(e.currentTarget as HTMLFormElement)
            const email = String(form.get('email') || '')
            const password = String(form.get('password') || '')
            if (!email || !password) { setMessage('이메일과 비밀번호를 입력하세요'); return }

            const supabase = createSupabaseBrowser()
            // sign in with password
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error || !data?.user) { setMessage(error?.message || '로그인 실패'); return }

            // fetch profile role via anon REST endpoint or server helper
            try {
              // call server route which can verify token and return profile
              const token = data.session?.access_token || (await supabase.auth.getSession()).data.session?.access_token
              if (!token) { setMessage('로그인 성공했지만 세션 토큰을 찾을 수 없습니다'); return }
              const res = await fetch('/api/auth/me', { method: 'GET', headers: { Authorization: `Bearer ${token}` } })
              const j = await res.json().catch(() => ({}))
              if (!res.ok) { setMessage(j?.error || '프로필 확인 실패'); return }
              const role = j?.profile?.role || 'guest'
              if (role === 'admin') {
                // redirect to admin dashboard
                router.push('/admin')
                return
              }
              // default redirect to guest
              router.push('/guest')
            } catch (err) {
              setMessage('로그인 후 프로필 확인 실패')
            }
          }} className="space-y-3">
            <label className="block text-sm">
              <span className="text-gray-700">이메일</span>
              <input name="email" type="email" placeholder="이메일" className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <label className="block text-sm">
              <span className="text-gray-700">비밀번호</span>
              <input name="password" type="password" placeholder="비밀번호" className="mt-1 block w-full border rounded px-3 py-2" required />
            </label>
            <div className="flex items-center justify-between">
              <button className="px-4 py-2 rounded bg-blue-600 text-white">로그인</button>
              <Link href="/" className="text-sm text-gray-600">메인 보기</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={async (e) => {
            e.preventDefault()
            setMessage('')
            const form = new FormData(e.currentTarget as HTMLFormElement)
            const name = String(form.get('name') || '')
            const email = String(form.get('email') || '')
            const password = String(form.get('password') || '')
            if (!email || !password) { setMessage('이메일과 비밀번호를 입력하세요'); return }

            const supabase = createSupabaseBrowser()
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error || !data?.user) { setMessage(error?.message || 'signup failed'); return }

            // call server to create profile
            const res = await fetch('/api/auth/create-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: data.user.id, name }) })
            const j = await res.json().catch(() => ({}))
            if (!res.ok) { setMessage(j.error || 'profile creation failed'); return }

            setMessage('회원가입 완료, 이메일 확인 후 로그인 해주세요')
          }} className="space-y-2 text-sm">
            <div className="mb-1 text-xs text-gray-500">간단 회원가입</div>
            <label className="block">
              <span className="text-xs text-gray-700">이름</span>
              <input name="name" type="text" placeholder="이름" className="mt-1 block w-full border rounded px-2 py-1 text-sm" required />
            </label>
            <label className="block">
              <span className="text-xs text-gray-700">이메일</span>
              <input name="email" type="email" placeholder="이메일" className="mt-1 block w-full border rounded px-2 py-1 text-sm" required />
            </label>
            <label className="block">
              <span className="text-xs text-gray-700">비밀번호</span>
              <input name="password" type="password" placeholder="비밀번호" className="mt-1 block w-full border rounded px-2 py-1 text-sm" required />
            </label>
            <div className="flex items-center justify-between">
              <button className="px-3 py-1 rounded bg-green-600 text-white text-sm">회원가입</button>
              <Link href="/" className="text-sm text-gray-600">메인 보기</Link>
            </div>
            {message && <div className="text-xs text-center text-gray-600 mt-1">{message}</div>}
          </form>
        )}
      </div>
    </div>
  )
}
