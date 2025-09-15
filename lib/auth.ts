import { redirect } from 'next/navigation'
import { createSupabaseServer } from './supabase-server'
import { Role } from './types'
import type { Route } from 'next'

/**
 * Retrieves the current user's session information, including their role and associated restaurant ID.
 * This is the primary server-side utility for fetching authentication and authorization context.
 */
export async function getSession() {
  const supabase = createSupabaseServer()
  const { data: { user }, error } = await supabase.auth.getUser()

  // If there's an error fetching the user or no user is found, return a guest session.
  if (error || !user) {
    return { user: null, role: 'guest' as Role, restaurant_id: null }
  }

  // Fetch the user's profile to get their role and restaurant_id
  const { data: profile } = await supabase
    .from('user_profile')
    .select('id, role, restaurant_id')
    .eq('id', user.id)
    .maybeSingle()

  const role: Role = (profile?.role as Role) || 'guest'
  const restaurant_id = profile?.restaurant_id || null

  return { user, role, restaurant_id }
}

/**
 * Enforces a minimum role requirement for accessing a page or API route.
 * If the user does not meet the required role, they are redirected.
 *
 * @param minRole The minimum role required ('guest', 'manager', or 'admin').
 * @param options Optional settings for redirection and restaurant validation.
 */
export async function requireRole<T extends string>(minRole: Role, options?: { redirectTo?: Route<T>, targetRestaurantId?: string }) {
  const { user, role, restaurant_id } = await getSession()
  const order: Record<Role, number> = { guest: 0, manager: 1, admin: 2 }

  let authorized = false
  if (user && order[role] >= order[minRole]) {
    // If the required role is 'manager', we must also check if they belong to the target restaurant.
    if (minRole === 'manager' && options?.targetRestaurantId) {
      if (role === 'admin' || (role === 'manager' && restaurant_id === options.targetRestaurantId)) {
        authorized = true
      }
    } else {
      authorized = true
    }
  }

  if (!authorized) {
    redirect((options?.redirectTo || '/guest') as Route<T>)
  }

  // Return session data for convenience
  return { user, role, restaurant_id }
}

/**
 * A utility function to check if a user's role meets a minimum requirement.
 *
 * @param role The user's current role.
 * @param minRole The minimum role to check against.
 * @returns boolean
 */
export function isAtLeast(role: Role, minRole: Role) {
  const order: Record<Role, number> = { guest: 0, manager: 1, admin: 2 }
  return order[role] >= order[minRole]
}
