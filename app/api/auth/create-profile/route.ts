import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { id, name } = body ?? {}
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 })

    const admin = supabaseAdmin()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Basic env validation to provide clearer errors in dev
    if (!url || !adminKey) {
      const missing = [] as string[]
      if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!adminKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
      const msg = `Missing Supabase env vars: ${missing.join(', ')}`
      // return detailed message in development, generic in production
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: false, error: msg }, { status: 500 })
      }
      return NextResponse.json({ success: false, error: 'server misconfigured' }, { status: 500 })
    }

    // if name provided, save to auth user's user_metadata using admin API
    if (name) {
      try {
        if (admin.auth && (admin.auth as any).admin && (admin.auth as any).admin.updateUser) {
          await (admin.auth as any).admin.updateUser(id, { user_metadata: { name } })
        }
      } catch (err) {
        // log to server console for diagnostics
        try {
          console.error('create-profile: metadata update error', err)
        } catch (e) {}
        // continue even if metadata update fails
        // but surface the error in development for diagnostics
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json({ success: false, error: `metadata update failed: ${String(err)}` }, { status: 500 })
        }
      }
    }

    // insert profile record (user_profile has no 'name' column)
    const res = await fetch(`${url}/rest/v1/user_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: adminKey,
        Authorization: `Bearer ${adminKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ id, role: 'guest' }),
    })

    if (!res.ok) {
      return NextResponse.json({ success: false, error: `profile insert failed: ${await res.text()}` }, { status: 500 })
    }

    const profile = await res.json()
    return NextResponse.json({ success: true, profile })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 })
  }
}
