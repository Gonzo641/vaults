import Link from 'next/link'
import { Rocket } from 'lucide-react'
import { UserNav } from '@/components/UserNav'

export function LandingHeader({ isLoggedIn, user, profile }: { isLoggedIn?: boolean, user?: any, profile?: any }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent border-b border-white/[0.05] backdrop-blur-md">

            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                <div className="p-1.5 bg-indigo-500 rounded-lg">
                    <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-wider">Component Vault</span>
            </Link>

            <nav className="flex items-center gap-6">
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm font-medium px-4 py-2 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
                            Go to Dashboard
                        </Link>
                        {user && <UserNav user={user} profile={profile} />}
                    </div>
                ) : (
                    <>
                        <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link href="/login?tab=signup" className="text-sm font-medium px-4 py-2 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
                            Sign Up
                        </Link>
                    </>
                )}
            </nav>

        </header>
    )
}
