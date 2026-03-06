'use server'

import { createClient } from '@/lib/supabase/server'

export type SearchResult = {
    id: string;
    title: string;
    type: 'component' | 'prompt' | 'pad' | 'todo' | 'snippet' | 'bookmark';
    url: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) return [];

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const searchTerm = `%${query}%`

    // Run all 6 queries in parallel
    const [componentsRes, promptsRes, padsRes, todosRes, snippetsRes, bookmarksRes] = await Promise.all([
        supabase.from('components').select('id, title').eq('user_id', user.id).ilike('title', searchTerm).limit(5),
        supabase.from('prompts').select('id, title').eq('user_id', user.id).ilike('title', searchTerm).limit(5),
        supabase.from('pads').select('id, title').eq('user_id', user.id).ilike('title', searchTerm).limit(5),
        supabase.from('todos').select('id, title').eq('user_id', user.id).ilike('title', searchTerm).limit(5),
        supabase.from('snippets').select('id, title').eq('user_id', user.id).ilike('title', searchTerm).limit(5),
        supabase.from('bookmarks').select('id, title, url').eq('user_id', user.id).ilike('title', searchTerm).limit(5),
    ])

    const results: SearchResult[] = []

    if (componentsRes.data) {
        componentsRes.data.forEach(c => results.push({
            id: c.id,
            title: c.title,
            type: 'component',
            url: `/component/${c.id}`
        }))
    }

    if (promptsRes.data) {
        promptsRes.data.forEach(p => results.push({
            id: p.id,
            title: p.title,
            type: 'prompt',
            url: `/dashboard?tab=prompts`
        }))
    }

    if (padsRes.data) {
        padsRes.data.forEach(p => results.push({
            id: p.id,
            title: p.title,
            type: 'pad',
            url: `/dashboard?tab=pads&padId=${p.id}`
        }))
    }

    if (todosRes.data) {
        todosRes.data.forEach(t => results.push({
            id: t.id,
            title: t.title,
            type: 'todo',
            url: `/dashboard?tab=todos&todoId=${t.id}`
        }))
    }

    if (snippetsRes.data) {
        snippetsRes.data.forEach(s => results.push({
            id: s.id,
            title: s.title,
            type: 'snippet',
            url: `/dashboard?tab=snippets&snippetId=${s.id}`
        }))
    }

    if (bookmarksRes.data) {
        bookmarksRes.data.forEach(b => results.push({
            id: b.id,
            title: b.title,
            type: 'bookmark',
            url: b.url
        }))
    }

    // Sort alphabetically just for cleanliness, though they are grouped by table
    return results.sort((a, b) => a.title.localeCompare(b.title))
}
