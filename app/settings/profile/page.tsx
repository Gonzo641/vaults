import { createClient } from '@/lib/supabase/server'
import { ProfileSettingsForm } from '@/components/forms/ProfileSettingsForm'
import { redirect } from 'next/navigation'

export default async function SettingsProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return <ProfileSettingsForm user={user} />
}
