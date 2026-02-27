'use client'

import * as React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { User, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/actions/auth'
import Link from 'next/link'

interface UserNavProps {
    user: any
}

export function UserNav({ user }: UserNavProps) {
    // Use email first letter as avatar fallback
    const fallbackLetters = user?.email?.substring(0, 2).toUpperCase() || 'CV'

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="relative h-8 w-8 rounded-full border border-border bg-muted flex items-center justify-center hover:ring-2 hover:ring-primary/50 transition-all outline-none">
                    <span className="text-xs font-semibold text-foreground">{fallbackLetters}</span>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    align="end"
                >
                    <div className="flex flex-col space-y-1 p-2 border-b border-border/50 mb-1">
                        <p className="text-sm font-medium leading-none truncate">{user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user?.id?.substring(0, 8)}...
                        </p>
                    </div>

                    <DropdownMenu.Item asChild>
                        <Link
                            href="/settings/profile"
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                        <Link
                            href="/settings"
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Paramètres</span>
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-border" />

                    <DropdownMenu.Item
                        asChild
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive/10 focus:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive"
                    >
                        <form action={signOut} className="w-full">
                            <button type="submit" className="flex items-center w-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Se déconnecter</span>
                            </button>
                        </form>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
