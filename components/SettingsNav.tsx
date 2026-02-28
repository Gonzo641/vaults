'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function SettingsNav() {
    const pathname = usePathname()

    return (
        <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1">
            <Link
                href="/settings/profile"
                className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors",
                    pathname === '/settings/profile'
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
            >
                Profile
            </Link>
            <Link
                href="/settings/preferences"
                className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors",
                    pathname === '/settings/preferences'
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
            >
                Settings
            </Link>
        </nav>
    )
}
