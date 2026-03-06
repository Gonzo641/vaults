'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPads() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('pads')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error("Error fetching pads:", error)
        return []
    }

    return data
}

export async function createPad(title: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    if (content.length > 5000) {
        throw new Error("Content exceeds 5000 characters limit.")
    }

    const { data, error } = await supabase
        .from('pads')
        .insert({
            user_id: user.id,
            title,
            content
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating pad:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function updatePad(id: string, title: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    if (content.length > 5000) {
        throw new Error("Content exceeds 5000 characters limit.")
    }

    const { data, error } = await supabase
        .from('pads')
        .update({
            title,
            content
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        console.error("Error updating pad:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function deletePad(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from('pads')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error("Error deleting pad:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return { success: true }
}
