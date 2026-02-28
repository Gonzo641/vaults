'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePassword(prevState: any, formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: 'Please fill in all fields.' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match.' }
    }

    const supabase = await createClient()

    // 1. Verify old password by attempting a quick sign-in using the current session email
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
        return { error: 'User not authenticated.' }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    })

    if (signInError) {
        return { error: 'The current password is incorrect.' }
    }

    // 2. Update user password
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (updateError) {
        return { error: updateError.message }
    }

    revalidatePath('/settings/profile')
    return { success: 'Your password has been successfully updated.' }
}

export async function updateEditorTheme(prevState: any, formData: FormData) {
    const theme = formData.get('theme') as string

    if (!theme) {
        return { error: 'No theme selected.' }
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'User not authenticated.' }
    }

    // Verify Premium Status
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, plan_id')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'user'
    const plan = profile?.plan_id || 'hitchhiker'

    if (role !== 'admin' && plan !== 'commander' && plan !== 'lifetime_friend') {
        return { error: 'This feature is reserved for Commander plans and above.' }
    }

    const { error } = await supabase.rpc('update_editor_theme', {
        new_theme: theme
    })

    if (error) {
        return { error: "Error updating theme." }
    }

    revalidatePath('/', 'layout')
    return { success: 'Editor theme updated successfully.', themeUpdated: true }
}
