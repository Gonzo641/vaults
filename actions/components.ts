'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createComponent(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to create a component' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const codeFilesStr = formData.get('code_files') as string
    const code_files = codeFilesStr ? JSON.parse(codeFilesStr) : []
    const tagsStr = formData.get('tags') as string
    const tags = tagsStr ? (JSON.parse(tagsStr) as string[]) : []

    let preview_image_1_url = null
    let preview_image_2_url = null

    // Freemium Paywall Logic Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, plan_id')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'user'
    const plan = profile?.plan_id || 'hitchhiker'

    if (role !== 'admin' && plan === 'hitchhiker') {
        const { count, error: countError } = await supabase
            .from('components')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        if (!countError && count !== null && count >= 15) {
            return { error: 'PAYWALL_LIMIT_REACHED' }
        }
    }

    const image1 = formData.get('image1') as File | null
    const image2 = formData.get('image2') as File | null

    console.log('[createComponent] Starting upload for user:', user.id)
    console.log('[createComponent] Form Title:', title)
    console.log('[createComponent] Image 1 present:', !!image1, 'Size:', image1?.size)

    if (image1 && image1.size > 0) {
        console.log('[createComponent] Uploading Image 1...')
        const { data, error } = await supabase.storage
            .from('component-previews')
            .upload(`${user.id}/${Date.now()}-1.webp`, image1, { contentType: 'image/webp' })

        if (error) {
            console.error('[createComponent] Image 1 Upload Error:', error)
            return { error: `Fallback upload error 1: ${error.message}` }
        }

        if (data) {
            const { data: publicUrlData } = supabase.storage.from('component-previews').getPublicUrl(data.path)
            preview_image_1_url = publicUrlData.publicUrl
            console.log('[createComponent] Image 1 uploaded, URL:', preview_image_1_url)
        }
    }

    if (image2 && image2.size > 0) {
        console.log('[createComponent] Uploading Image 2...')
        const { data, error } = await supabase.storage
            .from('component-previews')
            .upload(`${user.id}/${Date.now()}-2.webp`, image2, { contentType: 'image/webp' })

        if (error) {
            console.error('[createComponent] Image 2 Upload Error:', error)
            return { error: `Fallback upload error 2: ${error.message}` }
        }

        if (data) {
            const { data: publicUrlData } = supabase.storage.from('component-previews').getPublicUrl(data.path)
            preview_image_2_url = publicUrlData.publicUrl
            console.log('[createComponent] Image 2 uploaded, URL:', preview_image_2_url)
        }
    }

    console.log('[createComponent] Inserting to DB...')

    const { data: component, error } = await supabase
        .from('components')
        .insert({
            user_id: user.id,
            title,
            description,
            code_files,
            preview_image_1_url,
            preview_image_2_url
        })
        .select()
        .single()

    if (error) {
        console.error('[createComponent] Insert error:', error)
        return { error: `Database insert error: ${error.message}` }
    }

    console.log('[createComponent] Success:', component)

    if (tags.length > 0) {
        for (const tagName of tags) {
            let { data: tag } = await supabase
                .from('tags')
                .select('id')
                .eq('user_id', user.id)
                .eq('name', tagName)
                .single()

            if (!tag) {
                const { data: newTag } = await supabase
                    .from('tags')
                    .insert({ user_id: user.id, name: tagName })
                    .select('id')
                    .single()
                tag = newTag
            }

            if (tag) {
                await supabase
                    .from('component_tags')
                    .insert({ component_id: component.id, tag_id: tag.id })
            }
        }
    }

    revalidatePath('/dashboard')
    return component
}

export async function getComponents(searchQuery?: string) {
    const supabase = await createClient()
    let query = supabase.from('components').select(`
    *,
    component_tags (
      tags (
        id,
        name
      )
    )
  `).order('created_at', { ascending: false })

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function updateComponent(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to update a component' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const codeFilesStr = formData.get('code_files') as string
    const code_files = codeFilesStr ? JSON.parse(codeFilesStr) : []
    const tagsStr = formData.get('tags') as string
    const tags = tagsStr ? (JSON.parse(tagsStr) as string[]) : []

    const image1 = formData.get('image1') as File | null
    const image2 = formData.get('image2') as File | null

    const deleteImage1 = formData.get('deleteImage1') === 'true'
    const deleteImage2 = formData.get('deleteImage2') === 'true'

    const updateData: any = {
        title,
        description,
        code_files
    }

    // Fetch existing component to clean up old images
    const { data: existingComponent } = await supabase
        .from('components')
        .select('preview_image_1_url, preview_image_2_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    const extractPath = (url: string | null) => {
        if (!url) return null
        const parts = url.split('/component-previews/')
        return parts.length === 2 ? parts[1] : null
    }

    const oldPath1 = extractPath(existingComponent?.preview_image_1_url)
    const oldPath2 = extractPath(existingComponent?.preview_image_2_url)

    const filesToDelete: string[] = []

    if (deleteImage1 || (image1 && image1.size > 0)) {
        if (oldPath1) filesToDelete.push(oldPath1)
        if (deleteImage1 && !image1) updateData.preview_image_1_url = null
    }

    if (deleteImage2 || (image2 && image2.size > 0)) {
        if (oldPath2) filesToDelete.push(oldPath2)
        if (deleteImage2 && !image2) updateData.preview_image_2_url = null
    }

    if (filesToDelete.length > 0) {
        await supabase.storage.from('component-previews').remove(filesToDelete)
    }

    if (image1 && image1.size > 0) {
        const { data, error } = await supabase.storage
            .from('component-previews')
            .upload(`${user.id}/${Date.now()}-1.webp`, image1, { contentType: 'image/webp' })

        if (error) return { error: `Image 1 Upload Error: ${error.message}` }

        if (data) {
            const { data: publicUrlData } = supabase.storage.from('component-previews').getPublicUrl(data.path)
            updateData.preview_image_1_url = publicUrlData.publicUrl
        }
    }

    if (image2 && image2.size > 0) {
        const { data, error } = await supabase.storage
            .from('component-previews')
            .upload(`${user.id}/${Date.now()}-2.webp`, image2, { contentType: 'image/webp' })

        if (error) return { error: `Image 2 Upload Error: ${error.message}` }

        if (data) {
            const { data: publicUrlData } = supabase.storage.from('component-previews').getPublicUrl(data.path)
            updateData.preview_image_2_url = publicUrlData.publicUrl
        }
    }

    // Shift Image 2 to Image 1 if Image 1 is empty but Image 2 exists
    // This can happen if the user deletes Image 1 but keeps Image 2,
    // or if they only upload Image 2.
    const finalImage1 = updateData.preview_image_1_url !== undefined ? updateData.preview_image_1_url : existingComponent?.preview_image_1_url
    const finalImage2 = updateData.preview_image_2_url !== undefined ? updateData.preview_image_2_url : existingComponent?.preview_image_2_url

    if (!finalImage1 && finalImage2) {
        updateData.preview_image_1_url = finalImage2
        updateData.preview_image_2_url = null
    }

    // Update component basic data
    const { error: updateError } = await supabase
        .from('components')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)

    if (updateError) {
        return { error: `Database update error: ${updateError.message}` }
    }

    // Handle Tags update (simplest: delete all existing relations, then insert new ones)
    await supabase.from('component_tags').delete().eq('component_id', id)

    if (tags.length > 0) {
        for (const tagName of tags) {
            let { data: tag } = await supabase
                .from('tags')
                .select('id')
                .eq('user_id', user.id)
                .eq('name', tagName)
                .single()

            if (!tag) {
                const { data: newTag } = await supabase
                    .from('tags')
                    .insert({ user_id: user.id, name: tagName })
                    .select('id')
                    .single()
                tag = newTag
            }

            if (tag) {
                await supabase
                    .from('component_tags')
                    .insert({ component_id: id, tag_id: tag.id })
            }
        }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/component/${id}`)
    return { success: true }
}

export async function deleteComponent(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to delete a component' }
    }

    const { data: component, error: fetchError } = await supabase
        .from('components')
        .select('preview_image_1_url, preview_image_2_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !component) {
        return { error: "Component not found or unauthorized to delete." }
    }

    const filesToDelete: string[] = []

    if (component.preview_image_1_url) {
        const parts = component.preview_image_1_url.split('/component-previews/')
        if (parts.length === 2) filesToDelete.push(parts[1])
    }

    if (component.preview_image_2_url) {
        const parts = component.preview_image_2_url.split('/component-previews/')
        if (parts.length === 2) filesToDelete.push(parts[1])
    }

    if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
            .from('component-previews')
            .remove(filesToDelete)

        if (storageError) {
            console.error("Warning: Failed to delete component images:", storageError)
        }
    }

    const { error: deleteError } = await supabase
        .from('components')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (deleteError) {
        return { error: `Failed to delete component: ${deleteError.message}` }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
