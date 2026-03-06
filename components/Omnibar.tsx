'use client'

import * as React from 'react'
import { Command } from 'cmdk'
import { Search, Component, Hash, Sparkles, FileText, ListTodo, Loader2, Clock, Trash2, Code, Link2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useDebounce } from '@/hooks/use-debounce'
import { globalSearch, SearchResult } from '@/actions/search'

const RECENT_SEARCHES_KEY = 'component-vault-recent-searches-v4'
const MAX_RECENT = 5

export function Omnibar() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = React.useState(false)
    const [recentSearches, setRecentSearches] = React.useState<SearchResult[]>([])

    const debouncedQuery = useDebounce(query, 300)
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

    React.useEffect(() => {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse recent searches')
            }
        }
    }, [])

    React.useEffect(() => {
        if (!debouncedQuery) {
            setResults([])
            setIsSearching(false)
            return
        }

        let isMounted = true
        setIsSearching(true)

        globalSearch(debouncedQuery).then(res => {
            if (isMounted) {
                setResults(res)
                setIsSearching(false)
            }
        }).catch(err => {
            console.error('Search error:', err)
            if (isMounted) setIsSearching(false)
        })

        return () => { isMounted = false }
    }, [debouncedQuery])

    const saveRecentSearch = (item: SearchResult) => {
        setRecentSearches(prev => {
            const filtered = prev.filter(p => `${p.type}-${p.id}` !== `${item.type}-${item.id}`)
            const updated = [item, ...filtered].slice(0, MAX_RECENT)
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const clearRecentSearches = (e: React.MouseEvent) => {
        e.stopPropagation()
        setRecentSearches([])
        localStorage.removeItem(RECENT_SEARCHES_KEY)
    }

    const runCommand = React.useCallback((item: SearchResult) => {
        saveRecentSearch(item)
        setOpen(false)

        if (item.type === 'bookmark') {
            window.open(item.url, '_blank', 'noopener,noreferrer')
        } else {
            React.startTransition(() => {
                router.push(item.url)
            })
        }
    }, [router])

    const getIcon = (type: string) => {
        switch (type) {
            case 'component': return <Component className="mr-2 h-4 w-4 text-blue-400" />
            case 'prompt': return <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
            case 'pad': return <FileText className="mr-2 h-4 w-4 text-amber-400" />
            case 'todo': return <ListTodo className="mr-2 h-4 w-4 text-emerald-400" />
            case 'snippet': return <Code className="mr-2 h-4 w-4 text-sky-400" />
            case 'bookmark': return <Link2 className="mr-2 h-4 w-4 text-indigo-400" />
            default: return <Search className="mr-2 h-4 w-4" />
        }
    }

    const getBadgeText = (type: string) => {
        switch (type) {
            case 'component': return 'Component'
            case 'prompt': return 'Prompt'
            case 'pad': return 'Note'
            case 'todo': return 'Task'
            case 'snippet': return 'Snippet'
            case 'bookmark': return 'Bookmark'
            default: return 'Item'
        }
    }

    return (
        <>
            <div
                className="hidden sm:flex text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border/50 items-center gap-2 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4" />
                <span>Global Search...</span>
                <kbd className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border border-border text-foreground shadow-sm ml-2">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Search"
                className="fixed top-[15vh] z-[60] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-2xl bg-card rounded-xl shadow-2xl shadow-black/50 border border-border/80 overflow-hidden p-0 flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[10%] data-[state=open]:slide-in-from-top-[10%] duration-200"
            >
                <DialogTitle className="sr-only">Global Search</DialogTitle>
                <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Command.Input
                        value={query}
                        onValueChange={setQuery}
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Search components, prompts, notes, tasks..."
                    />
                    {isSearching && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />}
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                    {!query && recentSearches.length > 0 && (
                        <Command.Group heading={
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>Recent Searches</span>
                                <button
                                    onClick={clearRecentSearches}
                                    className="flex items-center gap-1 opacity-70 hover:opacity-100 hover:text-destructive transition-colors text-[10px] bg-background border border-border px-1.5 py-0.5 rounded"
                                >
                                    <Trash2 className="w-3 h-3" /> Clear
                                </button>
                            </div>
                        } className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            {recentSearches.map((item) => (
                                <Command.Item
                                    key={`recent-${item.type}-${item.id}`}
                                    value={`recent-${item.title}`} // Value is used for filtering, but since query is empty, it doesn't matter much here
                                    onSelect={() => runCommand(item)}
                                    className="relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground transition-colors group"
                                >
                                    <div className="flex items-center truncate">
                                        <Clock className="mr-2 h-3.5 w-3.5 opacity-50" />
                                        {getIcon(item.type)}
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                    <span className="text-[10px] ml-4 bg-background border border-border px-1.5 py-0.5 rounded opacity-50 group-hover:opacity-100 shrink-0">
                                        {getBadgeText(item.type)}
                                    </span>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}

                    {query && !isSearching && results.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No results found for "{query}".
                        </div>
                    )}

                    {results.length > 0 && (
                        <Command.Group heading="Search Results" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            {results.map((item) => (
                                <Command.Item
                                    key={`${item.type}-${item.id}`}
                                    value={item.title} // cmdk uses value for filtering, but since we already filtered on server, this is mostly for UI selection
                                    onSelect={() => runCommand(item)}
                                    className="relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground transition-colors group"
                                >
                                    <div className="flex items-center truncate">
                                        {getIcon(item.type)}
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                    <span className="text-[10px] ml-4 bg-background border border-border px-1.5 py-0.5 rounded opacity-50 group-hover:opacity-100 shrink-0">
                                        {getBadgeText(item.type)}
                                    </span>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}
                </Command.List>
            </Command.Dialog>

            {/* Background overlay when dialog is open */}
            {open && (
                <div
                    className="fixed inset-0 z-50 w-screen h-screen bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    )
}
