'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPrompts() {
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Vous devez être connecté pour voir vos prompts.")
    }

    // 2. Fetch prompts for the user
    // They are protected by RLS anyway, but explicit filtering is good practice
    const { data: prompts, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return prompts || []
}

export async function createPrompt(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Vous devez être connecté pour créer un prompt." }
    }

    // 2. Freemium Paywall Logic Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, plan_id')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'user'
    const plan = profile?.plan_id || 'hitchhiker'

    if (role !== 'admin' && plan === 'hitchhiker') {
        const { count, error: countError } = await supabase
            .from('prompts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        if (!countError && count !== null && count >= 10) {
            return { error: 'PAYWALL_LIMIT_REACHED' }
        }
    }

    // 3. Extract Data
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const image = formData.get('image') as File | null

    // Parse tags (comma separated string -> array of strings)
    const tagsString = formData.get('tags') as string
    const tags = tagsString
        ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []

    // 4. Basic Validation
    if (!title || title.trim().length === 0) {
        return { error: "Title is required." }
    }
    if (!content || content.trim().length === 0) {
        return { error: "Prompt content is required." }
    }

    // 5. Image Upload (WebP)
    let finalImageUrl = null
    if (image && image.size > 0) {
        const { data, error } = await supabase.storage
            .from('component-previews')
            .upload(`${user.id}/prompt-${Date.now()}.webp`, image, { contentType: 'image/webp' })

        if (error) {
            console.error('[createPrompt] Image Upload Error:', error)
            return { error: `Image upload failed: ${error.message}` }
        }

        if (data) {
            const { data: publicUrlData } = supabase.storage.from('component-previews').getPublicUrl(data.path)
            finalImageUrl = publicUrlData.publicUrl
        }
    }

    // 6. Insert into Supabase
    const { error: insertError } = await supabase
        .from('prompts')
        .insert({
            user_id: user.id,
            title,
            content,
            image_url: finalImageUrl,
            tags: tags.length > 0 ? tags : null
        })

    if (insertError) {
        console.error("Error creating prompt:", insertError)
        return { error: "Failed to create prompt." }
    }

    // 7. Revalidate path to update the UI
    revalidatePath('/dashboard')

    return { success: true }
}
