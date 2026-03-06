'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTodos() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching todos:", error)
        return []
    }

    return data
}

export async function createTodo(title: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
        .from('todos')
        .insert({
            user_id: user.id,
            title,
            status: 'todo'
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating todo:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function updateTodoStatus(id: string, status: 'todo' | 'in_progress' | 'done') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
        .from('todos')
        .update({
            status
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        console.error("Error updating todo status:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function updateTodoTitle(id: string, title: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
        .from('todos')
        .update({
            title
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        console.error("Error updating todo title:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return data
}

export async function deleteTodo(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error("Error deleting todo:", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    return { success: true }
}
