import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get('stripe-signature')

        if (!signature) {
            return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
        }

        // Lire le secret dynamiquement et le nettoyer des espaces inutiles
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
        if (!webhookSecret) {
            console.error('Webhook secret is missing.')
            return NextResponse.json({ error: 'Missing webhook secret' }, { status: 400 })
        }

        let event: Stripe.Event

        try {
            // Passer le texte brut à Stripe
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err: any) {
            console.error(`Webhook signature verification failed.`, err.message)
            return NextResponse.json({ error: err.message }, { status: 400 })
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session

            // client_reference_id contains the Supabase User ID passed during createCheckoutSession
            const userId = session.client_reference_id

            if (!userId) {
                console.error('No client_reference_id found in session')
                return NextResponse.json({ error: 'No user ID present in session metadata' }, { status: 400 })
            }

            // We need to fetch the line items to know exactly which price they bought
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
            const priceId = lineItems.data[0]?.price?.id

            if (!priceId) {
                console.error('No price ID found in session line items')
                return NextResponse.json({ error: 'No price ID found' }, { status: 400 })
            }

            // Map Stripe Price IDs to our internal DB plan_ids
            let newPlanId = 'hitchhiker'
            if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPLORER) {
                newPlanId = 'explorer'
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_COMMANDER) {
                newPlanId = 'commander'
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME) {
                newPlanId = 'lifetime_friend'
            }

            // Initialize Supabase Admin Client using the Service Role Key to bypass RLS
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            )

            // Update the user's profile with the new plan_id and the stripe_customer_id
            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({
                    plan_id: newPlanId,
                    stripe_customer_id: session.customer as string
                })
                .eq('id', userId)

            if (updateError) {
                console.error('Error updating user plan in Supabase:', updateError)
                return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
            }

            console.log(`Successfully updated user ${userId} to plan ${newPlanId}`)
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        console.error('Unhandled webhook error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}

