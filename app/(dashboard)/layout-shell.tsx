'use client'

import * as React from 'react'

import { CreateComponentModal } from '@/components/CreateComponentModal'
import { UserNav } from '@/components/UserNav'

export function LayoutShell({ children, omnibarProps, user }: { children: React.ReactNode, omnibarProps: { components: any[], tags: any[] }, user: any }) {
    const { Omnibar } = require('@/components/Omnibar')

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="border-b border-border p-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
                <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-xs leading-none">CV</span>
                    </div>
                    <span>Component Vault</span>
                </div>
                <div className="flex items-center gap-4">
                    <Omnibar {...omnibarProps} />
                    <CreateComponentModal />
                    <UserNav user={user} />
                </div>
            </header>
            <main className="flex-1 p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
