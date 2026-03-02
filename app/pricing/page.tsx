import { PricingSection } from "@/components/landing/PricingSection"
import { SpaceBackground } from "@/components/landing/SpaceBackground"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
    title: 'Pricing - Component Vault',
    description: 'Choose the right plan to expand your UI universe.',
}

export default async function PricingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="relative min-h-screen bg-[#020205] overflow-x-hidden selection:bg-indigo-500/30">
            <SpaceBackground />

            <div className="relative z-10 pt-10 pb-20">
                <div className="container mx-auto px-4 mb-10 w-full max-w-6xl">
                    <Link
                        href={user ? "/dashboard" : "/"}
                        className="inline-flex items-center text-sm font-medium text-white/60 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        {user ? "Back to Dashboard" : "Back to Home"}
                    </Link>
                </div>

                <PricingSection />
            </div>
        </div>
    )
}
