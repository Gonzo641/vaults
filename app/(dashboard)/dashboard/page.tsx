import { getComponents } from '@/actions/components'
import { getPrompts } from '@/actions/prompts'
import { ComponentCard } from '@/components/ComponentCard'
import { MasonryGrid } from '@/components/MasonryGrid'
import { CreateComponentModal } from '@/components/CreateComponentModal'
import { PromptsGrid } from '@/components/dashboard/PromptsGrid'
import { PromptCard } from '@/components/dashboard/PromptCard'
import { CreatePromptModal } from '@/components/CreatePromptModal'
import { PadsView } from '@/components/dashboard/PadsView'
import { TodosView } from '@/components/dashboard/TodosView'
import { SnippetsView } from '@/components/dashboard/SnippetsView'
import { BookmarksView } from '@/components/dashboard/BookmarksView'
import { Search, Hash, X, Code2, Sparkles, Code, Link2 } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; tag?: string; tab?: string }>
}) {
    const params = await searchParams
    const activeTab = params.tab || 'components'

    // Data fetching based on active tab
    let components = []
    let prompts = []
    let pads = []
    let todos = []
    let snippets = []
    let bookmarks = []

    if (activeTab === 'components') {
        components = await getComponents(params.search)
    } else if (activeTab === 'prompts') {
        prompts = await getPrompts()
    } else if (activeTab === 'pads') {
        const { getPads } = await import('@/actions/pads')
        pads = await getPads()
    } else if (activeTab === 'todos') {
        const { getTodos } = await import('@/actions/todos')
        todos = await getTodos()
    } else if (activeTab === 'snippets') {
        const { getSnippets } = await import('@/actions/snippets')
        snippets = await getSnippets()
    } else if (activeTab === 'bookmarks') {
        const { getBookmarks } = await import('@/actions/bookmarks')
        bookmarks = await getBookmarks()
    }

    const filteredComponents = params.tag && activeTab === 'components'
        ? components.filter((c: any) =>
            c.component_tags.some((ct: any) => ct.tags.name === params.tag)
        )
        : components

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 pb-4 border-b border-border/50">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Your Vault</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {activeTab === 'components'
                                ? `${filteredComponents.length} component${filteredComponents.length !== 1 ? 's' : ''} saved`
                                : activeTab === 'prompts'
                                    ? `${prompts.length} prompt${prompts.length !== 1 ? 's' : ''} saved`
                                    : activeTab === 'pads'
                                        ? `${pads.length} note${pads.length !== 1 ? 's' : ''} saved`
                                        : activeTab === 'snippets'
                                            ? `${snippets.length} snippet${snippets.length !== 1 ? 's' : ''} saved`
                                            : activeTab === 'bookmarks'
                                                ? `${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''} saved`
                                                : `${todos.length} task${todos.length !== 1 ? 's' : ''} saved`
                            }
                        </p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50 w-fit">
                        <Link
                            href="/dashboard?tab=components"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'components'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Code2 className="w-4 h-4" />
                            Components
                        </Link>
                        <Link
                            href="/dashboard?tab=prompts"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'prompts'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Prompts
                        </Link>
                        <Link
                            href="/dashboard?tab=pads"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'pads'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Pads
                        </Link>
                        <Link
                            href="/dashboard?tab=todos"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'todos'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Todos
                        </Link>
                        <Link
                            href="/dashboard?tab=snippets"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'snippets'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            Snippets
                        </Link>
                        <Link
                            href="/dashboard?tab=bookmarks"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'bookmarks'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Link2 className="w-4 h-4" />
                            Bookmarks
                        </Link>
                    </div>
                </div>

                {/* Active Filters */}
                {(params.search || params.tag) && (
                    <div className="flex flex-wrap gap-2 items-center mt-2">
                        <span className="text-sm font-medium text-muted-foreground mr-1">Active filters:</span>
                        {params.search && (
                            <div className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground border border-border">
                                <Search className="w-3 h-3" />
                                "{params.search}"
                                <Link href={params.tag ? `/dashboard?tag=${encodeURIComponent(params.tag)}` : '/dashboard'} className="ml-1 opacity-70 hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                        {params.tag && (
                            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary border border-primary/20">
                                <Hash className="w-3 h-3" />
                                {params.tag}
                                <Link
                                    href={params.search ? `/dashboard?search=${encodeURIComponent(params.search)}` : '/dashboard'}
                                    className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                        <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground ml-2 underline underline-offset-2">
                            Clear all
                        </Link>
                    </div>
                )}
            </div>

            {/* Render Content Based on Active Tab */}
            {activeTab === 'components' ? (
                filteredComponents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-muted-foreground opacity-50">/</span>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight mb-2">Vault is empty</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mb-6">
                            You haven't saved any components yet. Create a new component to populate your vault.
                        </p>
                        <CreateComponentModal />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Le bouton d'ajout est maintenant ici, aligné à droite ! */}
                        <div className="flex justify-end">
                            <CreateComponentModal />
                        </div>
                        <MasonryGrid>
                            {filteredComponents.map((component: any) => (
                                <ComponentCard key={component.id} component={component} />
                            ))}
                        </MasonryGrid>
                    </div>
                )
            ) : activeTab === 'prompts' ? (
                prompts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight mb-2">No prompts found</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mb-6">
                            Start saving your favorite AI instructions to quickly access them later.
                        </p>
                        <CreatePromptModal />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <CreatePromptModal />
                        </div>
                        <PromptsGrid>
                            {prompts.map((prompt: any) => (
                                <PromptCard key={prompt.id} prompt={prompt} />
                            ))}
                        </PromptsGrid>
                    </div>
                )
            ) : activeTab === 'pads' ? (
                <PadsView initialPads={pads} />
            ) : activeTab === 'snippets' ? (
                <SnippetsView initialSnippets={snippets} />
            ) : activeTab === 'bookmarks' ? (
                <BookmarksView initialBookmarks={bookmarks} />
            ) : (
                <TodosView initialTodos={todos} />
            )}
        </div>
    )
}
