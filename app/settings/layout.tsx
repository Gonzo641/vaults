import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getComponents } from '@/actions/components'
import { getTags } from '@/actions/tags'
import { LayoutShell } from '@/app/(dashboard)/layout-shell'

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Reuse the dashboard layout shell for consistency
    const components = await getComponents()
    const tags = await getTags()

    return (
        <LayoutShell omnibarProps={{ components, tags }} user={user}>
            <div className="max-w-4xl mx-auto py-6">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Paramètres</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 shrink-0">
                        <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1">
                            <div className="bg-muted px-3 py-2 text-sm font-medium rounded-md w-full text-foreground text-left">
                                Profil
                            </div>
                        </nav>
                    </aside>
                    <div className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutShell>
    )
}
