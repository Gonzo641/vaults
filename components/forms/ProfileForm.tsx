'use client'

import { CreditCard, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import { createCustomerPortalSession } from '@/actions/stripe'
import { toast } from 'sonner'

export function ProfileForm({ user, profile, subscriptionDate }: { user: any, profile?: any, subscriptionDate?: string | null }) {
    const [isPending, startTransition] = useTransition()

    const handleManageSubscription = () => {
        startTransition(async () => {
            try {
                const { url } = await createCustomerPortalSession()
                window.location.assign(url)
            } catch (error: any) {
                toast.error(error.message || "Impossible de charger le portail de gestion.")
            }
        })
    }
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium">User Profile</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account information.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="flex w-full max-w-md items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground opacity-70">
                        {user?.email}
                    </div>
                    <p className="text-[11px] text-muted-foreground">The email cannot currently be modified from the interface.</p>
                </div>
            </div>

            <div className="bg-border h-px w-full" />

            {/* My Subscription Section */}
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    My Subscription
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Manage your current Component Vault plan.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-md p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-10 -mt-10 rounded-full" />

                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Current Plan:</p>
                        <p className="text-xl font-bold text-white mb-4">
                            {profile?.plan_id === 'explorer' ? 'Explorer Pass' :
                                profile?.plan_id === 'commander' ? 'Commander License' :
                                    profile?.plan_id === 'lifetime_friend' ? 'Lifetime Friend' :
                                        'Hitchhiker (Free)'}
                        </p>

                        <div className="mb-6 p-3 rounded-md bg-black/20 border border-white/5">
                            <p className="text-xs text-muted-foreground font-mono">
                                {profile?.plan_id === 'lifetime_friend' ? 'Lifetime Access (No renewal)' :
                                    profile?.plan_id === 'hitchhiker' || !profile?.plan_id ? 'Free Tier (No renewal)' :
                                        subscriptionDate ? `Renewal on: ${subscriptionDate}` : 'Renewal date unavailable'}
                            </p>
                        </div>

                        {profile?.stripe_customer_id ? (
                            <button
                                onClick={handleManageSubscription}
                                disabled={isPending}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-indigo-600 text-white h-10 px-4 py-2 hover:bg-indigo-500 transition-all hover:scale-[1.02] shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Connecting to Stripe...
                                    </>
                                ) : (
                                    <>
                                        Manage Billing Portal
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-indigo-600 text-white h-10 px-4 py-2 hover:bg-indigo-500 transition-all hover:scale-[1.02] shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                            >
                                Upgrade your Vault
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
