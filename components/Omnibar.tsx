'use client'

import * as React from 'react'
import { Command } from 'cmdk'
import { Search, Component, Hash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import { DialogTitle } from '@radix-ui/react-dialog'

export function Omnibar({ components, tags }: { components: any[], tags: any[] }) {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        React.startTransition(() => {
            command()
        })
    }, [])

    return (
        <>
            <div
                className="hidden sm:flex text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border/50 items-center gap-2 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4" />
                <span>Search components...</span>
                <kbd className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border border-border text-foreground shadow-sm ml-2">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-background rounded-xl shadow-2xl border border-border overflow-hidden p-0 z-50 flex flex-col"
            >
                <DialogTitle className="sr-only">Search Components</DialogTitle>
                <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Command.Input
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type a command or search..."
                    />
                </div>
                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                    <Command.Empty className="py-6 text-center text-sm text-white">No results found.</Command.Empty>

                    <Command.Group heading="Components" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {components.map((component) => (
                            <Command.Item
                                key={component.id}
                                value={component.title}
                                onSelect={() => {
                                    runCommand(() => router.push(`/component/${component.id}`))
                                }}
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <Component className="mr-2 h-4 w-4" />
                                <span>{component.title}</span>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Separator className="-mx-2 my-1 h-px bg-border" />

                    <Command.Group heading="Tags" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {tags.map((tag) => (
                            <Command.Item
                                key={tag.id}
                                value={`tag:${tag.name}`}
                                onSelect={() => {
                                    runCommand(() => router.push(`/dashboard?tag=${encodeURIComponent(tag.name)}`))
                                }}
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <Hash className="mr-2 h-4 w-4 text-primary" />
                                <span>{tag.name}</span>
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>
            </Command.Dialog>

            {/* Background overlay when dialog is open */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    )
}
