import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions, type CookieMethodsServer } from '@supabase/ssr'
import { Database } from './types'

export function createSupabaseServer() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // 서버 기본 클라이언트는 anon key 사용 (admin 작업은 별도 클라이언트에서 수행)
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const store = await cookies()
          const all = store.getAll()
          return all.map((c: { name: string; value: string }) => ({ name: c.name, value: c.value }))
        },
        async setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          const store = await cookies()
          cookiesToSet.forEach(({ name, value, options }) => {
            // Next.js cookies().set accepts { name, value, ...options }
            store.set({ name, value, ...options })
          })
        },
      },
    }
  )
}
