import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/forms/ProfileForm'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'

export default async function SettingsProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    let profile = null
    let subscriptionEnd: number | null = null

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
        profile = data

        // Fetch active subscription if customer ID exists
        if (profile.stripe_customer_id && (profile.plan_id === 'explorer' || profile.plan_id === 'commander')) {
            try {
                const subscriptions = await stripe.subscriptions.list({
                    customer: profile.stripe_customer_id,
                    status: 'active',
                    limit: 1,
                })

                if (subscriptions.data.length > 0) {
                    const sub: any = subscriptions.data[0]
                    subscriptionEnd = sub.current_period_end || null
                }
            } catch (err) {
                console.error("Failed to fetch Stripe subscription data", err)
            }
        }
    }

    return <ProfileForm user={user} profile={profile} subscriptionEnd={subscriptionEnd} />
}
