'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePassword(prevState: any, formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: 'Veuillez remplir tous les champs.' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Les nouveaux mots de passe ne correspondent pas.' }
    }

    const supabase = await createClient()

    // 1. Verify old password by attempting a quick sign-in using the current session email
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
        return { error: 'Utilisateur non authentifié.' }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    })

    if (signInError) {
        return { error: 'L\'ancien mot de passe est incorrect.' }
    }

    // 2. Update user password
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (updateError) {
        return { error: updateError.message }
    }

    revalidatePath('/settings/profile')
    return { success: 'Votre mot de passe a bien été mis à jour.' }
}
