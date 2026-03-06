import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckoutButton } from './CheckoutButton'

export async function PricingSection() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let planId = null
    if (user) {
        const { data } = await supabase.from('profiles').select('plan_id').eq('id', user.id).single()
        planId = data?.plan_id
    }

    const getButtonProps = (cardPlan: string, defaultText: string) => {
        if (!user) {
            return {
                text: defaultText,
                disabled: false,
                href: cardPlan === 'hitchhiker' ? '/login?tab=signup' : '/login'
            }
        }

        const planWeights: Record<string, number> = {
            'hitchhiker': 0,
            'explorer': 1,
            'commander': 2,
            'lifetime_friend': 3
        }

        const currentWeight = planId ? planWeights[planId] : 0
        const cardWeight = planWeights[cardPlan]

        let priceId = undefined
        if (cardPlan === 'explorer') priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPLORER
        if (cardPlan === 'commander') priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_COMMANDER
        if (cardPlan === 'lifetime_friend') priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME

        if (planId === cardPlan) {
            return { text: 'Current Plan', disabled: true, href: '#' }
        } else if (cardWeight > currentWeight) {
            // It's an upgrade: return the priceId so the CheckoutButton triggers Stripe
            return { text: 'Upgrade to ' + cardPlan, disabled: false, priceId }
        } else {
            // Downgrades are handled manually via portal or dashboard settings
            return { text: 'Downgrade', disabled: false, href: '/settings/profile' }
        }
    }

    const hitchhikerProps = getButtonProps('hitchhiker', 'Start for free')
    const explorerProps = getButtonProps('explorer', 'Select Plan')
    const commanderProps = getButtonProps('commander', 'Select Plan')

    const renderButton = (props: any, baseClasses: string) => {
        return (
            <CheckoutButton
                text={props.text}
                href={props.href}
                priceId={props.priceId}
                disabled={props.disabled}
                className={baseClasses}
            />
        )
    }

    return (
        <section className="relative z-10 py-24 px-4 bg-transparent border-t border-white/5 mt-12 backdrop-blur-sm">

            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 drop-shadow-sm mb-4 pb-2">
                    Pricing
                </h2>
                <p className="text-blue-100/60 max-w-2xl mx-auto mb-16 text-lg">
                    Simple, transparent pricing to power your ultimate developer workspace.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">

                    {/* Free Plan */}
                    <div className="flex flex-col p-8 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-colors mt-4 md:mt-0">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl font-black italic">00</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white text-left mb-2">Hitchhiker</h3>
                        <p className="text-white/50 text-left text-sm mb-6">Ideal for testing the orbit and discovering the platform.</p>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-bold text-white">0€</span>
                            <span className="text-white/50">/ month</span>
                        </div>

                        <ul className="flex flex-col gap-3 text-left mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Up to 15 Components & Prompts</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> 10 Snippets & Bookmarks</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Basic Pads & Todos</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Global Search</li>
                        </ul>

                        {renderButton(hitchhikerProps, "w-full mt-auto py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors")}
                    </div>

                    {/* 1 Month Plan */}
                    <div className="flex flex-col p-8 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/30 transition-colors mt-4 md:mt-0">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl font-black italic">01</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white text-left mb-2">Explorer Pass</h3>
                        <p className="text-white/50 text-left text-sm mb-6">Perfect for developers who need a unified daily workspace.</p>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-bold text-white">4.99€</span>
                            <span className="text-white/50">/ 1 month</span>
                        </div>

                        <ul className="flex flex-col gap-3 text-left mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Unlimited Components & Prompts</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Native Multi-Language Editor</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Unlimited Workspace (Snippets, Pads, Todos)</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> 500MB Cloud Storage</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Full Command Palette (Omnibar)</li>
                        </ul>

                        {renderButton(explorerProps, "w-full mt-auto py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors")}
                    </div>

                    {/* 3 Months Plan (Highlighted) */}
                    <div className="flex flex-col p-8 bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/30 rounded-3xl backdrop-blur-md relative overflow-hidden group md:-mt-4 md:mb-4">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <span className="text-6xl font-black italic text-indigo-300">03</span>
                        </div>

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 py-1 px-3 bg-indigo-500/20 border border-indigo-500/30 rounded-b-lg text-xs font-semibold text-indigo-300">
                            BEST VALUE
                        </div>

                        <h3 className="text-xl font-semibold text-white text-left mb-2 mt-4">Commander License</h3>
                        <p className="text-white/50 text-left text-sm mb-6">The ultimate setup for establishing your UI orbit.</p>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-bold text-white">11.99€</span>
                            <span className="text-white/50">/ 3 months</span>
                        </div>

                        <ul className="flex flex-col gap-3 text-left mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Everything in Explorer</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Massive 2GB Cloud Storage</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Premium Shiki Editor Themes</li>
                            <li className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-indigo-400" /> Priority Support</li>
                        </ul>

                        {renderButton(commanderProps, "w-full mt-auto py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]")}
                    </div>

                </div>
            </div>
        </section>
    )
}
