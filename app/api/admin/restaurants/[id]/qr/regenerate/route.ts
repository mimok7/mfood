import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole('admin')
  const resolvedParams = await params
  const form = await req.formData()
  const sb = supabaseAdmin()

  // Bulk rotate when 'all' is present
  const all = form.get('all')
  if (all) {
    // fetch all table ids for this restaurant
    const { data: tables } = await sb
      .from('tables')
      .select('id')
      .eq('restaurant_id', resolvedParams.id)
      .order('created_at')

    if (tables && tables.length > 0) {
      // rotate tokens per table
      for (const t of tables) {
        const newToken = crypto.randomUUID()
        await sb.from('tables').update({ token: newToken }).eq('id', t.id)
      }
    }

    // Also rotate restaurant-level waitlist token when bulk rotating
    await sb
      .from('restaurants')
      .update({ waitlist_token: crypto.randomUUID() })
      .eq('id', resolvedParams.id)

    // Redirect back to QR page
    return redirect(`/admin/restaurants/${resolvedParams.id}/qr`)
  }

  // Rotate only waitlist token when explicitly requested
  const waitlist = form.get('waitlist')
  if (waitlist) {
    await sb
      .from('restaurants')
      .update({ waitlist_token: crypto.randomUUID() })
      .eq('id', resolvedParams.id)
    return redirect(`/admin/restaurants/${resolvedParams.id}/qr`)
  }

  // Single table rotate
  const tableId = String(form.get('table_id') || '')
  if (!tableId) return NextResponse.json({ error: 'missing table_id' }, { status: 400 })

  // Verify table belongs to restaurant
  const { data: table } = await sb.from('tables').select('id, restaurant_id').eq('id', tableId).maybeSingle()
  if (!table || table.restaurant_id !== resolvedParams.id) {
    return NextResponse.json({ error: 'invalid table' }, { status: 400 })
  }

  const newToken = crypto.randomUUID()
  await sb.from('tables').update({ token: newToken }).eq('id', tableId)

  // Redirect back to QR page for better UX
  return redirect(`/admin/restaurants/${resolvedParams.id}/qr`)
}
