'use client'

import { useState, useTransition, useEffect } from 'react'
import { createSnippet, updateSnippet, deleteSnippet } from '@/actions/snippets'
import { Snippet } from '@/types'
import { toast } from 'sonner'
import { Plus, Trash2, Save, Code, Loader2, Copy, Check, FileCode2 } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

const LANGUAGES = [
    { id: 'typescript', label: 'TypeScript' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'tsx', label: 'React (TSX)' },
    { id: 'jsx', label: 'React (JSX)' },
    { id: 'css', label: 'CSS' },
    { id: 'html', label: 'HTML' },
    { id: 'python', label: 'Python' },
    { id: 'sql', label: 'SQL' },
    { id: 'json', label: 'JSON' },
    { id: 'bash', label: 'Bash / Shell' },
    { id: 'plaintext', label: 'Plain Text' }
]

export function SnippetsView({ initialSnippets }: { initialSnippets: Snippet[] }) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets)
    const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)

    // Editor State
    const [title, setTitle] = useState(selectedSnippet?.title || '')
    const [code, setCode] = useState(selectedSnippet?.code || '')
    const [language, setLanguage] = useState(selectedSnippet?.language || 'typescript')
    const [isPending, startTransition] = useTransition()
    const [hasCopied, setHasCopied] = useState(false)

    // Sync selected snippet with URL changes cleanly
    useEffect(() => {
        if (!snippets || snippets.length === 0) return;

        const snippetId = searchParams.get('snippetId');

        if (snippetId) {
            const found = snippets.find(s => s.id === snippetId);
            if (found) {
                if (selectedSnippet?.id !== found.id) {
                    setSelectedSnippet(found);
                }
                return;
            }
        }

        if (!selectedSnippet && snippets.length > 0) {
            setSelectedSnippet(snippets[0]);
        }
    }, [snippets, searchParams, selectedSnippet?.id])

    // Sync Editor State when selected Snippet changes
    useEffect(() => {
        if (selectedSnippet) {
            setTitle(selectedSnippet.title)
            setCode(selectedSnippet.code)
            setLanguage(selectedSnippet.language)
            setHasCopied(false)
        } else {
            setTitle('')
            setCode('')
            setLanguage('typescript')
        }
    }, [selectedSnippet?.id])

    const handleCreateSnippet = () => {
        startTransition(async () => {
            try {
                const newSnippet = await createSnippet('New Snippet', '', 'typescript')
                setSnippets(prev => [newSnippet, ...prev])
                setSelectedSnippet(newSnippet)
                router.push(`/dashboard?tab=snippets&snippetId=${newSnippet.id}`)
            } catch (error: any) {
                toast.error(error.message || 'Failed to create snippet')
            }
        })
    }

    const handleSaveSnippet = () => {
        if (!selectedSnippet) return

        if (code.length > 50000) {
            toast.error('Code exceeds 50000 characters limit.')
            return
        }

        startTransition(async () => {
            try {
                const updated = await updateSnippet(selectedSnippet.id, title, code, language)
                setSnippets(prev => prev.map(s => s.id === updated.id ? updated : s))
                toast.success('Snippet saved')
            } catch (error: any) {
                toast.error(error.message || 'Failed to save snippet')
            }
        })
    }

    const handleDeleteSnippet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this snippet?')) return

        startTransition(async () => {
            try {
                await deleteSnippet(id)
                setSnippets(prev => prev.filter(s => s.id !== id))
                if (selectedSnippet?.id === id) {
                    setSelectedSnippet(null)
                    router.push('/dashboard?tab=snippets')
                }
                toast.success('Snippet deleted')
            } catch (error: any) {
                toast.error(error.message || 'Failed to delete snippet')
            }
        })
    }

    const onCopy = () => {
        if (!code) return
        navigator.clipboard.writeText(code)
        setHasCopied(true)
        toast.success('Code copied to clipboard')
        setTimeout(() => setHasCopied(false), 2000)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Tab support in textarea
        if (e.key === 'Tab') {
            e.preventDefault()
            const target = e.target as HTMLTextAreaElement
            const start = target.selectionStart
            const end = target.selectionEnd

            const newValue = code.substring(0, start) + '    ' + code.substring(end)
            setCode(newValue)

            // Put caret at right position again
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + 4
            }, 0)
        }
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] border border-border rounded-xl overflow-hidden bg-background">
            {/* Sidebar List */}
            <div className="w-1/3 md:w-1/4 min-w-[250px] border-r border-border flex flex-col bg-muted/20">
                <div className="p-4 border-b border-border flex items-center justify-between bg-card shrink-0">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Code className="w-4 h-4 text-blue-500" />
                        Snippets
                    </h2>
                    <button
                        onClick={handleCreateSnippet}
                        disabled={isPending}
                        className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors"
                        title="New Snippet"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {snippets.length === 0 ? (
                        <div className="text-center p-4 text-sm text-muted-foreground mt-10">
                            No snippets yet. Create one!
                        </div>
                    ) : (
                        snippets.map(snippet => (
                            <div
                                key={snippet.id}
                                onClick={() => router.push(`/dashboard?tab=snippets&snippetId=${snippet.id}`)}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedSnippet?.id === snippet.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
                            >
                                <div className="truncate pr-2">
                                    <p className="font-medium text-sm truncate">{snippet.title}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-[10px] font-mono uppercase bg-background border border-border/50 px-1 py-0.5 rounded text-muted-foreground">
                                            {snippet.language}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteSnippet(snippet.id, e)}
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
                {selectedSnippet ? (
                    <>
                        {/* Editor Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center p-4 border-b border-border gap-3 bg-card shrink-0">
                            <FileCode2 className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Snippet Title"
                                className="flex-1 w-full bg-transparent border-none outline-none font-bold text-lg font-sans placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-border rounded px-1 -mx-1"
                            />

                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-muted text-foreground text-xs rounded-md px-2 py-1.5 border border-border outline-none focus:ring-1 focus:ring-primary"
                                >
                                    {LANGUAGES.map(l => (
                                        <option key={l.id} value={l.id}>{l.label}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={onCopy}
                                    title="Copy to clipboard"
                                    className="p-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
                                >
                                    {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>

                                <button
                                    onClick={handleSaveSnippet}
                                    disabled={isPending || code.length > 50000}
                                    className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-medium text-sm shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 p-0 relative overflow-hidden flex flex-col bg-zinc-950">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                                spellCheck={false}
                                placeholder="Write your code snippet here..."
                                className="w-full h-full p-4 bg-transparent text-zinc-300 border-none outline-none resize-none font-mono text-sm leading-relaxed"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                        <Code className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a snippet or create a new one.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
