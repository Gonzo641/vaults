import { createClient } from '@/lib/supabase/server'
import { PreferencesForm } from '@/components/forms/PreferencesForm'
import { redirect } from 'next/navigation'

export default async function SettingsPreferencesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    let profile = null
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
        profile = data
    }

    return <PreferencesForm profile={profile} />
}
