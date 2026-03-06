'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSnippets() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error("Error fetching snippets:", error)
        return []
    }

    return data
}

export async function createSnippet(title: string, code: string, language: string = 'typescript') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    if (code.length > 50000) {
        throw new Error("Code content exceeds 50000 characters limit.")
    }

    const { data, error } = await supabase
        .from('snippets')
        .insert({
            user_id: user.id,
            title,
            code,
            language
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating snippet:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function updateSnippet(id: string, title: string, code: string, language: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    if (code.length > 50000) {
        throw new Error("Code content exceeds 50000 characters limit.")
    }

    const { data, error } = await supabase
        .from('snippets')
        .update({
            title,
            code,
            language
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        console.error("Error updating snippet:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function deleteSnippet(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error("Error deleting snippet:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return { success: true }
}
