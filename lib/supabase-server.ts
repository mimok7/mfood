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
        // Intentionally no-op: calling cookies().set during server component rendering
        // is forbidden and will throw. For route handlers or server actions that need
        // to set cookies, construct a server client inside that handler with an
        // appropriate cookies implementation. Keeping setAll as a no-op prevents
        // crashes during normal SSR.
        async setAll(_: { name: string; value: string; options: CookieOptions }[]) {
          return
        },
      },
    }
  )
}
