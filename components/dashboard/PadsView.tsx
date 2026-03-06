'use client'

import { useState, useTransition, useEffect } from 'react'
import { createPad, updatePad, deletePad } from '@/actions/pads'
import { Pad } from '@/types'
import { toast } from 'sonner'
import { Plus, Trash2, Save, FileText, Loader2, Edit3 } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

export function PadsView({ initialPads }: { initialPads: Pad[] }) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [pads, setPads] = useState<Pad[]>(initialPads)
    const [selectedPad, setSelectedPad] = useState<Pad | null>(null) // Initialize as null to prevent premature default selection

    // Editor State
    const [title, setTitle] = useState(selectedPad?.title || '')
    const [content, setContent] = useState(selectedPad?.content || '')
    const [isPending, startTransition] = useTransition()

    // Sync selected pad with URL changes cleanly
    useEffect(() => {
        if (!pads || pads.length === 0) return;

        const padId = searchParams.get('padId');

        // Si un padId est dans l'URL
        if (padId) {
            const found = pads.find(p => p.id === padId);
            if (found) {
                if (selectedPad?.id !== found.id) {
                    setSelectedPad(found);
                }
                return; // On arrête là
            }
        }

        // Logique de repli par défaut SEULEMENT si aucun padId valide n'est trouvé
        if (!selectedPad && pads.length > 0) {
            setSelectedPad(pads[0]);
        }
    }, [pads, searchParams, selectedPad?.id])

    // Sync Editor State when selected Pad changes
    useEffect(() => {
        if (selectedPad) {
            setTitle(selectedPad.title)
            setContent(selectedPad.content)
        } else {
            setTitle('')
            setContent('')
        }
    }, [selectedPad?.id])

    const handleCreatePad = () => {
        startTransition(async () => {
            try {
                const newPad = await createPad('New Note', '')
                setPads(prev => [newPad, ...prev])
                setSelectedPad(newPad)
                router.push(`/dashboard?tab=pads&padId=${newPad.id}`)
            } catch (error: any) {
                toast.error(error.message || 'Failed to create pad')
            }
        })
    }

    const handleSavePad = () => {
        if (!selectedPad) return

        if (content.length > 5000) {
            toast.error('Content exceeds 5000 characters limit.')
            return
        }

        startTransition(async () => {
            try {
                const updated = await updatePad(selectedPad.id, title, content)
                setPads(prev => prev.map(p => p.id === updated.id ? updated : p))
                toast.success('Pad saved')
            } catch (error: any) {
                toast.error(error.message || 'Failed to save pad')
            }
        })
    }

    const handleDeletePad = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this note?')) return

        startTransition(async () => {
            try {
                await deletePad(id)
                setPads(prev => prev.filter(p => p.id !== id))
                if (selectedPad?.id === id) {
                    setSelectedPad(null)
                    router.push('/dashboard?tab=pads')
                }
                toast.success('Pad deleted')
            } catch (error: any) {
                toast.error(error.message || 'Failed to delete pad')
            }
        })
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] border border-border rounded-xl overflow-hidden bg-background">
            {/* Sidebar List */}
            <div className="w-1/3 md:w-1/4 min-w-[250px] border-r border-border flex flex-col bg-muted/20">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Notes
                    </h2>
                    <button
                        onClick={handleCreatePad}
                        disabled={isPending}
                        className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {pads.length === 0 ? (
                        <div className="text-center p-4 text-sm text-muted-foreground mt-10">
                            No notes yet. Create one!
                        </div>
                    ) : (
                        pads.map(pad => (
                            <div
                                key={pad.id}
                                onClick={() => {
                                    setSelectedPad(pad)
                                    // Use shallow replace to update URL without triggering full server re-renders if possible,
                                    // or just push to have history. Push is fine for deep linking.
                                    router.push(`/dashboard?tab=pads&padId=${pad.id}`)
                                }}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedPad?.id === pad.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
                            >
                                <div className="truncate pr-2">
                                    <p className="font-medium text-sm truncate">{pad.title}</p>
                                    <p className="text-xs opacity-70 truncate mt-0.5">{pad.content.slice(0, 30) || 'Empty...'}</p>
                                </div>
                                <button
                                    onClick={(e) => handleDeletePad(pad.id, e)}
                                    className="p-1.5 opacity-50 hover:opacity-100 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all shrink-0"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col bg-background relative">
                {selectedPad ? (
                    <>
                        <div className="flex items-center p-4 border-b border-border gap-3">
                            <Edit3 className="w-4 h-4 text-muted-foreground shrink-0" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Note Title"
                                className="flex-1 bg-transparent border-none outline-none font-bold text-lg font-sans placeholder:text-muted-foreground/50"
                            />
                            <div className={`text-xs font-mono mr-2 ${content.length > 5000 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                {content.length} / 5000
                            </div>
                            <button
                                onClick={handleSavePad}
                                disabled={isPending || content.length > 5000}
                                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save
                            </button>
                        </div>
                        <div className="flex-1 p-0 relative">
                            <textarea
                                value={content}
                                onChange={(e) => {
                                    if (e.target.value.length <= 5000) {
                                        setContent(e.target.value)
                                    }
                                }}
                                placeholder="Start typing your note here..."
                                className="w-full h-full p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a note or create a new one.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
