'use client'

import * as React from 'react'
import { UserNav } from '@/components/UserNav'
import Link from 'next/link'

export function LayoutShell({ children, user, profile }: { children: React.ReactNode, user: any, profile?: any }) {
    const { Omnibar } = require('@/components/Omnibar')

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="border-b border-border p-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-xs leading-none">CV</span>
                    </div>
                    <span>Component Vault</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Omnibar />
                    <UserNav user={user} profile={profile} />
                </div>
            </header>
            <main className="flex-1 p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
