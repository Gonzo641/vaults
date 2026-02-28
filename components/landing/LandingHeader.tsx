import Link from 'next/link'
import { Rocket } from 'lucide-react'

export function LandingHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent border-b border-white/[0.05] backdrop-blur-md">

            <div className="flex items-center gap-2 text-white">
                <div className="p-1.5 bg-indigo-500 rounded-lg">
                    <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-wider">Component Vault</span>
            </div>

            <nav className="flex items-center gap-6">
                <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                    Terminal Login
                </Link>
                <Link href="/login?tab=signup" className="text-sm font-medium px-4 py-2 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
                    Initiate Launch
                </Link>
            </nav>

        </header>
    )
}
