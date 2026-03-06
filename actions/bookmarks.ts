'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getBookmarks() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error("Error fetching bookmarks:", error)
        return []
    }

    return data
}

export async function createBookmark(title: string, url: string, description: string = '') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Automatic Favicon Generation
    let faviconUrl = null
    try {
        const parsedUrl = new URL(url)
        faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`
    } catch (e) {
        // If the URL is totally invalid, skip favicon instead of crashing the whole action
        console.warn("Invalid URL for favicon generation: ", url)
    }

    const { data, error } = await supabase
        .from('bookmarks')
        .insert({
            user_id: user.id,
            title,
            url,
            description,
            favicon_url: faviconUrl
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating bookmark:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function updateBookmark(id: string, title: string, url: string, description: string = '') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Automatic Favicon Generation
    let faviconUrl = null
    try {
        const parsedUrl = new URL(url)
        faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`
    } catch (e) {
        console.warn("Invalid URL for favicon generation: ", url)
    }

    const { data, error } = await supabase
        .from('bookmarks')
        .update({
            title,
            url,
            description,
            favicon_url: faviconUrl
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        console.error("Error updating bookmark:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error("Error deleting bookmark:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return { success: true }
}
