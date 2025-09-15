"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-client'

type UiState = 'idle' | 'loading' | 'error'

function mapError(msg?: string) {
  if (!msg) return '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials') || m.includes('invalid credentials')) return '이메일 또는 비밀번호가 올바르지 않습니다.'
  if (m.includes('email not confirmed')) return '이메일 인증이 완료되지 않았습니다.'
  return msg
}

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [ui, setUi] = useState<UiState>('idle')
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowser(), [])

  const envOk = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!envOk) {
      setErr('환경 변수가 누락되었습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.')
      return
    }
    if (ui === 'loading') return
    setUi('loading')
    setErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setUi('error')
      setErr(mapError(error.message))
      return
    }
    // 성공: 서버측 /auth/layout에서 세션을 읽어 역할별로 리다이렉트함
    router.refresh()
  }

  return (
    <div className="w-full max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            >
              {showPassword ? '숨김' : '표시'}
            </button>
          </div>
        </div>

        {err && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
        {!envOk && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
            개발 환경 변수 누락: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
          </div>
        )}

        <button
          disabled={ui === 'loading'}
          className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
        >
          {ui === 'loading' ? '로그인 중…' : '로그인'}
        </button>
      </form>
      <p className="mt-3 text-sm">계정이 없으신가요? <Link href="/auth/sign-up" className="underline">회원가입</Link></p>
    </div>
  )
}
