import { redirect } from 'next/navigation'
import { createSupabaseServer } from './supabase-server'
import { Role } from './types'

export async function getSession() {
  const supabase = createSupabaseServer()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return { user: null, role: 'guest' as Role }

  if (!user) return { user: null, role: 'guest' as Role }

  const { data: profile } = await supabase
    .from('user_profile')
    .select('id, role, restaurant_id')
    .eq('id', user.id)
    .maybeSingle()

  const role: Role = (profile?.role as Role) || 'guest'
  return { user, role, restaurant_id: profile?.restaurant_id as string | undefined }
}

export async function requireRole(minRole: Role) {
  const { user, role } = await getSession()
  const order: Record<Role, number> = { guest: 0, manager: 1, admin: 2 }
  if (!user || order[role] < order[minRole]) {
    redirect('/guest')
  }
}

export function isAtLeast(role: Role, minRole: Role) {
  const order: Record<Role, number> = { guest: 0, manager: 1, admin: 2 }
  return order[role] >= order[minRole]
}
