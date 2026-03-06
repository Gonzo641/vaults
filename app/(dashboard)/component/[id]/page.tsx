import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { EditComponentModal } from '@/components/EditComponentModal'
import { DeleteComponentModal } from '@/components/DeleteComponentModal'
import { codeToHtml } from 'shiki'
import { CodeFilesViewer } from '@/components/CodeFilesViewer'
import { CodeFile } from '@/types'

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

    const { data: { user } } = await supabase.auth.getUser()
    let editorTheme = 'github-dark'

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('editor_theme')
            .eq('id', user.id)
            .single()

        if (profile?.editor_theme) {
            editorTheme = profile.editor_theme
        }
    }

    const codeFiles: CodeFile[] = Array.isArray(component.code_files) ? component.code_files : []

    // Map language IDs to Shiki-compatible language identifiers
    const langMap: Record<string, string> = { tsx: 'tsx', html: 'html', css: 'css', js: 'javascript' }

    // Highlight all code files in parallel on the server
    const highlightedFiles: Record<string, string> = {}
    await Promise.all(
        codeFiles.map(async (file) => {
            const lang = langMap[file.language] ?? 'text'
            const html = await codeToHtml(file.code || '', { lang, theme: editorTheme as any })
            highlightedFiles[file.language] = html
        })
    )

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

                    <CodeFilesViewer
                        codeFiles={codeFiles}
                        highlightedFiles={highlightedFiles}
                    />
                </div>
            </div>
        </div>
    )
}
