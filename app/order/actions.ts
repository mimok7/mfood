import { createSupabaseServer } from '@/lib/supabase-server'

export async function getOrCreateOpenOrder(tableId: string, source: string) {
  const supabase = createSupabaseServer()
  
  try {
    // First get the table to find restaurant_id
    const { data: table } = await supabase
      .from('tables')
      .select('restaurant_id')
      .eq('id', tableId)
      .maybeSingle()
    
    if (!table) {
      console.error('Table not found:', tableId)
      return null
    }
    
    // Check if there's an existing open order for this table
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('table_id', tableId)
      .eq('status', 'open')
      .maybeSingle()
    
    if (existingOrder) {
      return existingOrder
    }
    
    // Create a new order if none exists
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert({
        restaurant_id: table.restaurant_id,
        table_id: tableId,
        status: 'open'
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Failed to create order:', error)
      return null
    }
    
    return newOrder
  } catch (error) {
    console.error('Error in getOrCreateOpenOrder:', error)
    return null
  }
}