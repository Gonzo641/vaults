import { getComponents } from '@/actions/components'
import { getPrompts } from '@/actions/prompts'
import { ComponentCard } from '@/components/ComponentCard'
import { MasonryGrid } from '@/components/MasonryGrid'
import { CreateComponentModal } from '@/components/CreateComponentModal'
import { PromptsGrid } from '@/components/dashboard/PromptsGrid'
import { PromptCard } from '@/components/dashboard/PromptCard'
import { CreatePromptModal } from '@/components/CreatePromptModal'
import { Search, Hash, X, Code2, Sparkles } from 'lucide-react'
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

    if (activeTab === 'components') {
        components = await getComponents(params.search)
    } else if (activeTab === 'prompts') {
        prompts = await getPrompts()
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
                                : `${prompts.length} prompt${prompts.length !== 1 ? 's' : ''} saved`
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
                    <MasonryGrid>
                        {filteredComponents.map((component: any) => (
                            <ComponentCard key={component.id} component={component} />
                        ))}
                    </MasonryGrid>
                )
            ) : (
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
            )}
        </div>
    )
}
