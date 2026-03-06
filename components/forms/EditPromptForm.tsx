'use client'

import { useState, useTransition, useCallback } from 'react'
import { updatePrompt } from '@/actions/prompts'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { compressToWebP } from '@/lib/image-compression'
import { cn } from '@/lib/utils'

export function EditPromptForm({ prompt, onSuccess }: { prompt: any, onSuccess: () => void }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(prompt.image_url || null)

    const handleImageDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            await processImage(file)
        }
    }, [])

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            await processImage(file)
        }
    }

    const processImage = async (file: File) => {
        try {
            const compressedFile = await compressToWebP(file)
            const previewUrl = URL.createObjectURL(compressedFile)
            setImage(compressedFile)
            setImagePreview(previewUrl)
        } catch (err) {
            console.error('Error compressing image:', err)
            setError('Error compressing image.')
        }
    }

    const removeImage = () => {
        setImage(null)
        if (imagePreview && !imagePreview.startsWith('http')) URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)
        if (image) formData.set('image', image)

        // Handle case where we removed the existing image, but without a dedicated backend field for "deletion flag".
        // Typically, to delete an image in this setup we might need an explicit flag, 
        // but let's assume if they remove it, they would upload a new one, or we just keep the old one on backend.
        // Actually, if we just want to update title/content and keep old image, we just don't append a new image.
        // If we want to actively delete it, we'd need a backend change. For now we just allow uploading *new* images.

        startTransition(async () => {
            try {
                const result = await updatePrompt(prompt.id, null, formData)

                if (result?.error) {
                    setError(result.error)
                    toast.error(result.error)
                } else if (result?.success) {
                    toast.success('Prompt updated successfully!')
                    onSuccess()
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.")
                toast.error("An unexpected error occurred.")
            }
        })
    }

    const defaultTags = prompt.tags ? prompt.tags.join(', ') : ''

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-destructive-foreground bg-destructive/20 border border-destructive/50 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Cover Image (Optional)</label>
                    <ImageDropzone
                        preview={imagePreview}
                        onDrop={handleImageDrop}
                        onSelect={handleImageSelect}
                        onRemove={removeImage}
                        id={`edit_prompt_image_${prompt.id}`}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Prompt Title *
                </label>
                <input
                    id="title"
                    name="title"
                    required
                    defaultValue={prompt.title}
                    placeholder="Ex: React Tailwind Component Generator"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Prompt Content *
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={6}
                    defaultValue={prompt.content}
                    placeholder="Write your system prompt or instructions here..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <label htmlFor="tags" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Tags (comma separated)
                    </label>
                    <input
                        id="tags"
                        name="tags"
                        defaultValue={defaultTags}
                        placeholder="nextjs, react, system"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                    type="button"
                    onClick={() => onSuccess()}
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </form>
    )
}

function ImageDropzone({
    preview,
    onDrop,
    onSelect,
    onRemove,
    id
}: {
    preview: string | null
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void
    onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemove: () => void
    id: string
}) {
    const [isDragActive, setIsDragActive] = useState(false)

    return (
        <div
            className={cn(
                "relative rounded-lg border-2 border-dashed p-6 transition-all",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                preview ? "p-2 border-solid" : "flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px]"
            )}
            onDragEnter={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragActive(false); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDrop={(e) => { setIsDragActive(false); onDrop(e); }}
            onClick={() => !preview && document.getElementById(id)?.click()}
        >
            <input
                id={id}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onSelect}
            />

            {preview ? (
                <div className="relative group w-full h-40 rounded-md overflow-hidden bg-muted">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="bg-destructive text-destructive-foreground p-2 rounded-full shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">Drag image here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                </>
            )}
        </div>
    )
}
