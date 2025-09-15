import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function supabaseAdmin() {
  if (!url || !serviceRole) throw new Error('Missing Supabase env variables')
  return createClient(url, serviceRole, { auth: { persistSession: false } })
}
