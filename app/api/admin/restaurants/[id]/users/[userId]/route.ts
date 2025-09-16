import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../../lib/supabase-admin'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  const resolved = await params
  const { id: restaurantId, userId } = resolved

  try {
    const body = await req.json()
    const { name, password, role } = body

    const supabase = supabaseAdmin()

    // 먼저 해당 사용자가 이 레스토랑의 사용자인지 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profile')
      .select('id, restaurant_id')
      .eq('id', userId)
      .eq('restaurant_id', restaurantId)
      .single()

    if (checkError || !existingUser) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    // 사용자 프로필 업데이트
    const updateData: any = {}
    if (name !== undefined) updateData.full_name = name || null
    if (role !== undefined) updateData.role = role

    if (Object.keys(updateData).length > 0) {
      const { error: profileError } = await supabase
        .from('user_profile')
        .update(updateData)
        .eq('id', userId)

      if (profileError) {
        console.error('Failed to update user profile:', profileError)
        return NextResponse.json({ error: profileError.message }, { status: 500 })
      }
    }

    // 비밀번호 변경 (제공된 경우에만)
    if (password && password.trim()) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(userId, {
        password: password
      })

      if (passwordError) {
        console.error('Failed to update password:', passwordError)
        return NextResponse.json({ error: '비밀번호 변경 실패: ' + passwordError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true, message: '사용자 정보가 업데이트되었습니다' })
  } catch (err: any) {
    console.error('Error updating user:', err)
    return NextResponse.json({ error: err.message || '알 수 없는 오류' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  const resolved = await params
  const { id: restaurantId, userId } = resolved

  try {
    const supabase = supabaseAdmin()

    // 먼저 해당 사용자가 이 레스토랑의 사용자인지 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profile')
      .select('id, restaurant_id')
      .eq('id', userId)
      .eq('restaurant_id', restaurantId)
      .single()

    if (checkError || !existingUser) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    // 사용자 프로필 삭제
    const { error: profileError } = await supabase
      .from('user_profile')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Failed to delete user profile:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Auth 사용자 삭제 (프로필 삭제 후)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Failed to delete auth user:', authError)
      // 프로필은 이미 삭제되었으므로 경고만 로그에 남김
      console.warn('Auth user deletion failed, but profile was deleted successfully')
    }

    return NextResponse.json({ ok: true, message: '사용자가 삭제되었습니다' })
  } catch (err: any) {
    console.error('Error deleting user:', err)
    return NextResponse.json({ error: err.message || '알 수 없는 오류' }, { status: 500 })
  }
}