'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Pencil, X } from 'lucide-react'
import { EditPromptForm } from '@/components/forms/EditPromptForm'

export function EditPromptModal({ prompt }: { prompt: any }) {
    const [open, setOpen] = React.useState(false)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <button className="p-1.5 rounded-md text-muted-foreground opacity-50 transition-all shrink-0">
                <Pencil className="w-4 h-4" />
            </button>
        )
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button
                    className="p-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-md transition-colors"
                    title="Edit Prompt"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className="fixed left-[50%] top-[50%] z-[100] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-2xl sm:rounded-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
                        <Dialog.Title className="text-xl font-semibold leading-none tracking-tight">
                            Edit Personal Prompt
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground">
                            Update your prompt's details and metadata.
                        </Dialog.Description>
                    </div>

                    <EditPromptForm prompt={prompt} onSuccess={() => setOpen(false)} />

                    <Dialog.Close asChild>
                        <button
                            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
