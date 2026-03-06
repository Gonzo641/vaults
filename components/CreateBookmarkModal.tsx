'use client'

import * as React from 'react'
import { useState, useTransition } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus, Loader2, Link2 } from 'lucide-react'
import { createBookmark } from '@/actions/bookmarks'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function CreateBookmarkModal() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !url.trim()) {
            toast.error('Title and URL are required.')
            return
        }

        try {
            new URL(url)
        } catch {
            toast.error('Please enter a valid URL (including https://).')
            return
        }

        startTransition(async () => {
            try {
                await createBookmark(title, url, description)
                toast.success('Bookmark saved successfully!')
                setOpen(false)
                setTitle('')
                setUrl('')
                setDescription('')
                router.refresh()
            } catch (error: any) {
                toast.error(error.message || 'Failed to create bookmark.')
            }
        })
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" />
                    <span>Add Bookmark</span>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl">
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                        <Dialog.Title className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Link2 className="w-5 h-5 text-primary" />
                            Save a new Bookmark
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground">
                            Add a useful link to your vault. We'll try to fetch its icon automatically!
                        </Dialog.Description>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="url">
                                URL <span className="text-destructive">*</span>
                            </label>
                            <input
                                id="url"
                                type="url"
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://github.com..."
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="title">
                                Title <span className="text-destructive">*</span>
                            </label>
                            <input
                                id="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="GitHub Repository"
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="description">
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="This repository contains..."
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px] resize-none"
                            />
                        </div>

                        <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="mt-2 sm:mt-0 inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={isPending || !title.trim() || !url.trim()}
                                className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 bg-primary text-primary-foreground hover:opacity-90 h-10 px-4 py-2 text-sm shadow-sm"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Bookmark'
                                )}
                            </button>
                        </div>
                    </form>

                    <Dialog.Close asChild>
                        <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
