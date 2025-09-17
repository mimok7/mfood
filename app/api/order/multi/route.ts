import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tableId, items } = body

    console.log('Order API received:', { tableId, items })

    if (!tableId || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = supabaseAdmin()

    // Get the table to find restaurant_id
    const { data: table } = await supabase
      .from('tables')
      .select('restaurant_id')
      .eq('id', tableId)
      .maybeSingle()

    if (!table) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    // Find or create an open order for this table
    let { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('table_id', tableId)
      .eq('status', 'open')
      .maybeSingle()

    if (!order) {
      // Create new order
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          restaurant_id: table.restaurant_id,
          table_id: tableId,
          status: 'open'
        })
        .select('id')
        .single()

      if (orderError || !newOrder) {
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
      }
      order = newOrder
    }

    // Add items to the order
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      item_id: item.menuItemId || item.id, // Support both menuItemId and id
      qty: item.qty || item.quantity || 1,
      price: item.price || 0, // Will need to fetch actual price from menu_items if not provided
      note: item.note || null
    }))

    // If price is not provided, fetch from menu_items
    for (let i = 0; i < orderItems.length; i++) {
      if (orderItems[i].price === 0) {
        const { data: menuItem } = await supabase
          .from('menu_items')
          .select('price')
          .eq('id', orderItems[i].item_id)
          .single()
        
        if (menuItem) {
          orderItems[i].price = menuItem.price
        }
      }
    }

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Failed to insert order items:', itemsError)
      console.error('Order items data:', orderItems)
      return NextResponse.json({ 
        error: 'Failed to add items to order',
        details: itemsError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      itemsAdded: orderItems.length 
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}