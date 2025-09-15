"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-client'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = useMemo(() => createSupabaseBrowser(), [])
  const router = useRouter()

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)

    // signUp
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setErr(error.message)
      return
    }

    const user = data?.user ?? null
    if (user && user.id) {
      try {
        // Use server API to create profile using admin credentials
        const res = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, name }),
        })
        const j = await res.json().catch(() => ({}))
        if (!res.ok) {
          console.error('create-profile failed', j)
          setSuccess('회원가입은 완료되었으나 프로필 생성에 문제가 발생했습니다. 관리자에게 문의하세요.')
          return
        }

        // Do NOT auto-login. Ensure user must confirm email and login manually.
        try {
          await supabase.auth.signOut()
        } catch (e) {
          // ignore signOut errors
        }

        setSuccess('회원가입 완료. 확인 이메일이 발송되었습니다. 이메일의 확인 링크를 클릭한 후 로그인하세요.')
        return
      } catch (e: any) {
        console.error('create-profile error', e)
        setSuccess('회원가입은 완료되었으나 프로필 생성에 문제가 발생했습니다. 이메일 확인 후 로그인하세요.')
        return
      }
    }

    setSuccess('확인 이메일이 발송되었습니다. 이메일의 확인 링크를 클릭한 후 로그인하세요.')
  }

  return (
    <div className="w-full max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="이름" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" type="email" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        <button disabled={loading} className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60">
          {loading ? '처리중...' : '가입'}
        </button>
      </form>
    </div>
  )
}
