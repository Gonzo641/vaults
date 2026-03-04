'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { getBaseUrl } from '@/lib/utils'

export async function createCheckoutSession(priceId: string) {
    if (!priceId) {
        throw new Error("Erreur: Price ID manquant.")
    }

    const supabase = await createClient()

    // 1. Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Depending on your auth flow, you might redirect them to login first
        redirect('/login')
    }

    const appUrl = getBaseUrl()

    try {
        // 2. Create the checkout session via Stripe SDK
        // IMPORTANT: We inject the Supabase user ID into `client_reference_id` 
        // to securely link the purchase back to the user in our Webhook later.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer_email: user.email,
            client_reference_id: user.id,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription', // or 'payment' for one-time payments if you change tier logic
            success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/pricing`,
            // Optional: You can also put internal logic inside metadata if you prefer
            metadata: {
                userId: user.id,
            }
        })

        // 3. Ensure a URL was returned
        if (!session.url) {
            throw new Error('Erreur lors de la création de la session Stripe.')
        }

        // Return the URL. The client component will trigger window.location.assign()
        return { url: session.url }

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error)
        throw new Error(error.message || 'Une erreur est survenue avec le paiement.')
    }
}

export async function createCustomerPortalSession() {
    const supabase = await createClient()

    // 1. Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Fetch the user's profile to get their stripe_customer_id
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

    if (error || !profile?.stripe_customer_id) {
        throw new Error("Aucun client Stripe n'est associé à ce compte.")
    }

    const appUrl = getBaseUrl()

    try {
        // 3. Create the billing portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${appUrl}/settings/profile`,
        })

        if (!session.url) {
            throw new Error('Erreur lors de la création du portail client Stripe.')
        }

        // Return the URL for the client to redirect
        return { url: session.url }

    } catch (error: any) {
        console.error('Stripe Portal Error:', error)
        throw new Error(error.message || 'Une erreur est survenue avec le portail.')
    }
}
