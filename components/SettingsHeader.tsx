'use client'

import { usePathname } from 'next/navigation'

export function SettingsHeader() {
    const pathname = usePathname()

    const title = pathname === '/settings/profile' ? 'User Profile' : 'Settings'

    return (
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    )
}
