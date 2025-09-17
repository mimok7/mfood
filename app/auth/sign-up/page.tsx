"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-client'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = useMemo(() => createSupabaseBrowser(), [])
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    
    // 기본 유효성 검사
    if (!name.trim()) {
      setErr('이름을 입력해주세요.')
      return
    }
    if (!email.trim()) {
      setErr('이메일을 입력해주세요.')
      return
    }
    if (password.length < 6) {
      setErr('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }
    if (password !== confirmPassword) {
      setErr('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    try {
      // signUp
      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password,
        options: {
          data: {
            full_name: name.trim()
          }
        }
      })
      
      if (error) {
        throw error
      }

      const user = data?.user ?? null
      if (user && user.id) {
        try {
          // Use server API to create profile using admin credentials
          const res = await fetch('/api/auth/create-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id, name: name.trim() }),
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

          setSuccess('🎉 회원가입이 완료되었습니다! 확인 이메일을 보내드렸으니, 이메일의 확인 링크를 클릭한 후 로그인해주세요.')
          return
        } catch (e: any) {
          console.error('create-profile error', e)
          setSuccess('회원가입은 완료되었으나 프로필 생성에 문제가 발생했습니다. 이메일 확인 후 로그인하세요.')
          return
        }
      }

      setSuccess('📧 확인 이메일이 발송되었습니다. 이메일의 확인 링크를 클릭한 후 로그인하세요.')
    } catch (error: any) {
      let errorMessage = '회원가입 중 오류가 발생했습니다.'
      
      if (error.message?.includes('User already registered')) {
        errorMessage = '이미 등록된 이메일 주소입니다.'
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = '올바르지 않은 이메일 형식입니다.'
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setErr(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 및 헤더 */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="text-orange-600">m</span>food
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h2>
          <p className="text-gray-600">mfood 시스템에 가입하여 스마트한 레스토랑 관리를 시작하세요</p>
        </div>

        {/* 가입 안내 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">가입 혜택</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">QR 코드 주문 시스템 무료 이용</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">실시간 주문 관리 및 키친 운영</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">상세한 매출 분석 및 리포트</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">24시간 기술 지원</span>
            </div>
          </div>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
              <div className="space-y-3">
                <Link 
                  href="/auth/sign-in"
                  className="block w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-center"
                >
                  로그인 페이지로 이동
                </Link>
                <Link 
                  href="/"
                  className="block w-full text-gray-600 hover:text-gray-800 transition-colors text-center"
                >
                  홈페이지로 돌아가기
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">이메일 주소</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your-email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="최소 6자 이상"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>

              {err && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-600">{err}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    가입 중...
                  </div>
                ) : (
                  '회원가입'
                )}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link href="/auth/sign-in" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  로그인하기
                </Link>
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
              ← 홈페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
