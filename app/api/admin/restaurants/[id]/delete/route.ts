import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest, context: any) {
  const params = (context && context.params) || {}
  try {
    await requireRole('admin')
    const sb = supabaseAdmin()
    const restaurantId = params.id

    // 1. 레스토랑이 존재하는지 확인
    const { data: restaurant, error: fetchError } = await sb
      .from('restaurants')
      .select('id, name, slug')
      .eq('id', restaurantId)
      .single()

    if (fetchError || !restaurant) {
      return NextResponse.json({ error: '레스토랑을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 2. 관련 데이터를 순서대로 삭제 (CASCADE 관계 고려)
    console.log(`레스토랑 삭제 시작: ${restaurant.name} (${restaurant.slug})`)
    
    // kitchen_queue 삭제
    await sb.from('kitchen_queue').delete().eq('restaurant_id', restaurantId)
    console.log('kitchen_queue 삭제 완료')
    
    // order_items 삭제 (orders와 연결된 것들)
    const { data: orders } = await sb.from('orders').select('id').eq('restaurant_id', restaurantId)
    if (orders && orders.length > 0) {
      const orderIds = orders.map(o => o.id)
      await sb.from('order_items').delete().in('order_id', orderIds)
      console.log('order_items 삭제 완료')
    }
    
    // orders 삭제
    await sb.from('orders').delete().eq('restaurant_id', restaurantId)
    console.log('orders 삭제 완료')
    
    // waitlist 삭제
    await sb.from('waitlist').delete().eq('restaurant_id', restaurantId)
    console.log('waitlist 삭제 완료')
    
    // tables 삭제
    await sb.from('tables').delete().eq('restaurant_id', restaurantId)
    console.log('tables 삭제 완료')
    
    // menu_options 삭제
    await sb.from('menu_options').delete().eq('restaurant_id', restaurantId)
    console.log('menu_options 삭제 완료')
    
    // menu_option_groups 삭제
    await sb.from('menu_option_groups').delete().eq('restaurant_id', restaurantId)
    console.log('menu_option_groups 삭제 완료')
    
    // menu_items 삭제
    await sb.from('menu_items').delete().eq('restaurant_id', restaurantId)
    console.log('menu_items 삭제 완료')
    
    // menu_categories 삭제
    await sb.from('menu_categories').delete().eq('restaurant_id', restaurantId)
    console.log('menu_categories 삭제 완료')
    
    // user_profile에서 restaurant_id 제거 (NULL로 설정)
    await sb.from('user_profile').update({ restaurant_id: null }).eq('restaurant_id', restaurantId)
    console.log('user_profile 연결 해제 완료')
    
    // 3. 마지막으로 레스토랑 자체 삭제
    const { error: deleteError } = await sb.from('restaurants').delete().eq('id', restaurantId)
    
    if (deleteError) {
      console.error('레스토랑 삭제 실패:', deleteError)
      return NextResponse.json({ error: '레스토랑 삭제에 실패했습니다.' }, { status: 500 })
    }
    
    console.log(`레스토랑 삭제 완료: ${restaurant.name}`)
    
    return NextResponse.json({ 
      success: true, 
      message: `"${restaurant.name}" 레스토랑과 관련된 모든 데이터가 삭제되었습니다.`,
      deletedRestaurant: restaurant
    })
    
  } catch (error: any) {
    console.error('레스토랑 삭제 중 오류:', error)
    return NextResponse.json(
      { error: error.message || '레스토랑 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}