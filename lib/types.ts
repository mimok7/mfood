export type Role = 'guest' | 'manager' | 'admin'

// Minimal Waitlist row type used across the app
export type WaitlistRow = {
	id: string
	restaurant_id: string
	name: string
	phone?: string | null
	party_size: number
	status: 'waiting' | 'seated' | 'cancelled' | 'called' | string
	is_reservation?: boolean | null
	reservation_time?: string | null
	duration_minutes?: number | null
	notes?: string | null
	special_request?: string | null
	created_at: string
	updated_at?: string | null
}

// Menu option types
export type MenuOptionGroup = {
	id: string
	restaurant_id: string
	menu_item_id: string
	name: string
	min_select: number
	max_select: number
	required: boolean
	position: number
	created_at: string
	updated_at: string
}

export type MenuOption = {
	id: string
	restaurant_id: string
	group_id: string
	name: string
	price_delta: number
	is_active: boolean
	position: number
	created_at: string
	updated_at: string
}

// Minimal Supabase-like Database type. Expand as needed.
export type Database = {
	public: {
		Tables: {
			waitlist: {
				Row: WaitlistRow
				Insert: Omit<Partial<WaitlistRow>, 'id' | 'created_at'> & { restaurant_id: string }
				Update: Partial<WaitlistRow>
			}
			menu_option_groups: {
				Row: MenuOptionGroup
				Insert: Omit<Partial<MenuOptionGroup>, 'id' | 'created_at' | 'updated_at'> & { restaurant_id: string; menu_item_id: string; name: string }
				Update: Partial<MenuOptionGroup>
			}
			menu_options: {
				Row: MenuOption
				Insert: Omit<Partial<MenuOption>, 'id' | 'created_at' | 'updated_at'> & { restaurant_id: string; group_id: string; name: string }
				Update: Partial<MenuOption>
			}
			// add other tables here as needed
		}
		Views: {}
		Functions: {}
	}
}
