'use client'

import React, { useCallback, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { compressToWebP } from '@/lib/image-compression'
import { updateComponent } from '@/actions/components'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface EditComponentFormProps {
    component: any
    onSuccess?: () => void
}

export function EditComponentForm({ component, onSuccess }: EditComponentFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [image1, setImage1] = useState<File | null>(null)
    const [image2, setImage2] = useState<File | null>(null)

    // Initialize previews with existing URLs if they exist
    const [image1Preview, setImage1Preview] = useState<string | null>(component.preview_image_1_url || null)
    const [image2Preview, setImage2Preview] = useState<string | null>(component.preview_image_2_url || null)

    const [deleteImage1, setDeleteImage1] = useState(false)
    const [deleteImage2, setDeleteImage2] = useState(false)

    // Initialize tags from relations
    const initialTags = component.component_tags ? component.component_tags.map((rt: any) => rt.tags.name) : []
    const [tags, setTags] = useState<string[]>(initialTags)
    const [tagInput, setTagInput] = useState('')

    const handleImageDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>, index: 1 | 2) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            await processImage(file, index)
        }
    }, [])

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, index: 1 | 2) => {
        const file = e.target.files?.[0]
        if (file) {
            await processImage(file, index)
        }
    }

    const processImage = async (file: File, index: 1 | 2) => {
        try {
            const compressedFile = await compressToWebP(file)
            const previewUrl = URL.createObjectURL(compressedFile)

            if (index === 1) {
                setImage1(compressedFile)
                setImage1Preview(previewUrl)
                setDeleteImage1(false)
            } else {
                setImage2(compressedFile)
                setImage2Preview(previewUrl)
                setDeleteImage2(false)
            }
        } catch (err) {
            console.error('Error compressing image:', err)
            setError('Erreur lors de la compression de l\'image.')
        }
    }

    const removeImage = (index: 1 | 2) => {
        if (index === 1) {
            setImage1(null)
            // Note: We don't unset old supabase URLs, only new local blobs to avoid memory leaks
            if (image1Preview && image1Preview.startsWith('blob:')) URL.revokeObjectURL(image1Preview)
            setImage1Preview(null)
            setDeleteImage1(true)
        } else {
            setImage2(null)
            if (image2Preview && image2Preview.startsWith('blob:')) URL.revokeObjectURL(image2Preview)
            setImage2Preview(null)
            setDeleteImage2(true)
        }
    }

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const newTag = tagInput.trim().toLowerCase()
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag])
            }
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        formData.set('tags', JSON.stringify(tags))

        if (deleteImage1) formData.set('deleteImage1', 'true')
        if (deleteImage2) formData.set('deleteImage2', 'true')

        // Only append images if they were newly uploaded/changed
        if (image1) formData.set('image1', image1)
        if (image2) formData.set('image2', image2)

        try {
            const result = await updateComponent(component.id, formData)

            if (result && result.error) {
                setError(result.error)
                setIsSubmitting(false)
                return
            }

            router.refresh()
            if (onSuccess) onSuccess()
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.')
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Image Principale (ex: Light Mode)</label>
                    <ImageDropzone
                        preview={image1Preview}
                        onDrop={(e) => handleImageDrop(e, 1)}
                        onSelect={(e) => handleImageSelect(e, 1)}
                        onRemove={() => removeImage(1)}
                        id="edit-image1"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Image Secondaire (ex: Dark Mode)</label>
                    <ImageDropzone
                        preview={image2Preview}
                        onDrop={(e) => handleImageDrop(e, 2)}
                        onSelect={(e) => handleImageSelect(e, 2)}
                        onRemove={() => removeImage(2)}
                        id="edit-image2"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Titre du composant</label>
                <input
                    id="title"
                    name="title"
                    required
                    defaultValue={component.title}
                    placeholder="Ex: Primary Button Glow"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description (Optionnel)</label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={component.description || ''}
                    placeholder="Brève description de l'utilité ou des dépendances..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Appuyez sur Entrée pour ajouter un tag"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="code_snippet" className="text-sm font-medium">Code (React/JSX/JS/CSS)</label>
                <textarea
                    id="code_snippet"
                    name="code_snippet"
                    required
                    defaultValue={component.code_snippet}
                    placeholder="..."
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-muted/30 font-mono px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90 transition-colors disabled:pointer-events-none disabled:opacity-50"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mise à jour...
                    </>
                ) : (
                    'Mettre à jour le composant'
                )}
            </button>
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
                preview ? "p-2 border-solid" : "flex flex-col items-center justify-center text-center aspect-[4/3] cursor-pointer"
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
                <div className="relative group w-full aspect-[4/3] rounded-md overflow-hidden bg-muted">
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
                    <p className="text-sm font-medium mb-1">Glissez une image ici</p>
                    <p className="text-xs text-muted-foreground">ou cliquez pour parcourir</p>
                    <p className="text-[10px] text-muted-foreground mt-2 bg-muted px-2 py-1 rounded">Sera compressé en WebP (&lt;500Ko)</p>
                </>
            )}
        </div>
    )
}
