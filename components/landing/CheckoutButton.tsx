'use client'

import { useTransition } from 'react'
import { createCheckoutSession } from '@/actions/stripe'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface CheckoutButtonProps {
    text: string
    priceId?: string
    href?: string
    disabled?: boolean
    className?: string
}

export function CheckoutButton({ text, priceId, href, disabled, className }: CheckoutButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleCheckout = () => {
        if (!priceId) return

        startTransition(async () => {
            try {
                const { url } = await createCheckoutSession(priceId)
                window.location.assign(url) // Redirect to Stripe Checkout
            } catch (error: any) {
                toast.error(error.message || "Failed to initialize checkout session")
            }
        })
    }

    if (disabled) {
        return (
            <button disabled className={`${className} opacity-50 cursor-not-allowed flex items-center justify-center`}>
                {text}
            </button>
        )
    }

    // If it's just a navigation link (e.g., Downgrade, or Start for free -> Login)
    if (href && !priceId) {
        return (
            <Link href={href} className={`${className} flex items-center justify-center text-center`}>
                {text}
            </Link>
        )
    }

    // Stripe Checkout Button
    return (
        <button
            onClick={handleCheckout}
            disabled={isPending}
            className={`${className} flex items-center justify-center text-center`}
        >
            {isPending ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting to Stripe...
                </>
            ) : (
                text
            )}
        </button>
    )
}
