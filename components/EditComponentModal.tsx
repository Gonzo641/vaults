'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Edit, X } from 'lucide-react'
import { EditComponentForm } from '@/components/forms/EditComponentForm'

interface EditComponentModalProps {
    component: any
}

export function EditComponentModal({ component }: EditComponentModalProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:rounded-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                        <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                            Edit Component
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground">
                            Update your component details, code, or preview images.
                        </Dialog.Description>
                    </div>

                    <div className="py-4">
                        <EditComponentForm component={component} onSuccess={() => setOpen(false)} />
                    </div>

                    <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
