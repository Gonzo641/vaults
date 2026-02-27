import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CopyCodeButton } from '@/components/CopyCodeButton'
import { EditComponentModal } from '@/components/EditComponentModal'
import { DeleteComponentModal } from '@/components/DeleteComponentModal'
import { codeToHtml } from 'shiki'

export default async function ComponentDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: component, error } = await supabase
        .from('components')
        .select(`
            *,
            component_tags (
                tags (
                    id,
                    name
                )
            )
        `)
        .eq('id', id)
        .single()

    if (error || !component) {
        notFound()
    }

    const highlightedCode = await codeToHtml(component.code_snippet, {
        lang: 'tsx',
        theme: 'tokyo-night'
    })

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Vault
                </Link>
                <div className="flex gap-2">
                    <EditComponentModal component={component} />
                    <DeleteComponentModal componentId={component.id} componentTitle={component.title} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Visual Preview (Left Column) */}
                <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm aspect-[4/3] bg-muted relative">
                        {component.preview_image_1_url ? (
                            <img
                                src={component.preview_image_1_url}
                                alt={component.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                No preview available
                            </div>
                        )}
                    </div>
                    {component.preview_image_2_url && (
                        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm aspect-[4/3] bg-muted relative">
                            <img
                                src={component.preview_image_2_url}
                                alt={`${component.title} - Dark Mode`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Details & Code (Right Column) */}
                <div className="flex flex-col h-full space-y-6 lg:self-stretch">
                    <div className="space-y-4 shrink-0">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{component.title}</h1>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                            {component.description ? (
                                <p className="text-foreground">{component.description}</p>
                            ) : (
                                <p className="text-muted-foreground text-sm italic">Aucune description.</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                            {component.component_tags && component.component_tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {component.component_tags.map((relation: any) => (
                                        <span
                                            key={relation.tags.id}
                                            className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                                        >
                                            {relation.tags.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm italic">Aucun tag.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 min-h-[400px]">
                        <div className="flex items-center justify-between shrink-0 mb-2">
                            <h3 className="text-sm font-medium">Code Snippet</h3>
                            <CopyCodeButton code={component.code_snippet} />
                        </div>
                        <div className="relative flex-1 rounded-xl border border-border bg-[#1a1b26] overflow-hidden">
                            <div className="absolute inset-0 overflow-auto">
                                <div
                                    className="[&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:text-sm [&>pre]:font-mono [&>pre]:m-0 [&>pre]:w-max [&>pre]:min-w-full min-h-full"
                                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
