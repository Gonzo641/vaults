'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react'
import { deleteComponent } from '@/actions/components'
import { useRouter } from 'next/navigation'

interface DeleteComponentModalProps {
    componentId: string
    componentTitle: string
}

export function DeleteComponentModal({ componentId, componentTitle }: DeleteComponentModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        setError(null)

        try {
            const result = await deleteComponent(componentId)

            if (result && result.error) {
                setError(result.error)
                setIsDeleting(false)
                return
            }

            setOpen(false)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'An error occurred during deletion.')
            setIsDeleting(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="inline-flex items-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:rounded-xl">
                    <div className="flex flex-col space-y-2 text-center sm:text-left">
                        <Dialog.Title className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            Delete Component
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground pt-2">
                            Are you absolutely sure you want to delete <strong className="text-foreground">"{componentTitle}"</strong>?
                            <br /><br />
                            This action cannot be undone. This will permanently delete the component, its code, and associated images from the servers.
                        </Dialog.Description>
                    </div>

                    {error && (
                        <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => setOpen(false)}
                            className="mt-2 sm:mt-0 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={handleDelete}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-destructive text-destructive-foreground h-10 px-4 py-2 hover:bg-destructive/90 transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, delete it'
                            )}
                        </button>
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
