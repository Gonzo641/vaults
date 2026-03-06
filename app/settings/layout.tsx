import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutShell } from '@/app/(dashboard)/layout-shell'
import { SettingsNav } from '@/components/SettingsNav'
import { SettingsHeader } from '@/components/SettingsHeader'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
    return (
        <LayoutShell user={user}>
            <div className="max-w-4xl mx-auto py-6">
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <SettingsHeader />
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 shrink-0">
                        <SettingsNav />
                    </aside>
                    <div className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutShell>
    )
}
