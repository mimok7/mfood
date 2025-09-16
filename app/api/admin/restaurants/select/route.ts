import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const res = NextResponse.json({ ok: true })
    // set server-side cookie for admin selected restaurant
    res.cookies.set({ name: 'admin_restaurant_id', value: String(id), path: '/' })
    return res
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 })
  }
}
