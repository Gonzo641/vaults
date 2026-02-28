import { getComponents } from '@/actions/components'
import { getTags } from '@/actions/tags'
import { LayoutShell } from './layout-shell'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        profile = data
    }

    const components = await getComponents()
    const tags = await getTags()

    return (
        <LayoutShell omnibarProps={{ components, tags }} user={user} profile={profile}>
            {children}
        </LayoutShell>
    )
}
