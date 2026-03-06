'use client'

import { Bookmark } from '@/types'
import { Link2, Trash2, ExternalLink } from 'lucide-react'
import { deleteBookmark } from '@/actions/bookmarks'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { CreateBookmarkModal } from '@/components/CreateBookmarkModal'
import { EditBookmarkModal } from '@/components/EditBookmarkModal'
import { MasonryGrid } from '@/components/MasonryGrid'
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal'

export function BookmarksView({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    if (initialBookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Link2 className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">No bookmarks found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                    Start saving your favorite documentation, tools, and resources here.
                </p>
                <CreateBookmarkModal />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <CreateBookmarkModal />
            </div>
            <MasonryGrid>
                {initialBookmarks.map((bookmark) => (
                    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))}
            </MasonryGrid>
        </div>
    )
}

function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = async () => {
        try {
            await deleteBookmark(bookmark.id)
            toast.success('Bookmark deleted')
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete bookmark')
            throw error // Throw to let Modal catch it
        }
    }

    return (
        <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div className="p-4 sm:p-5 flex flex-col h-full bg-gradient-to-b from-transparent to-muted/20">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 truncate">
                        {bookmark.favicon_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={bookmark.favicon_url}
                                alt=""
                                className="w-8 h-8 rounded shrink-0 object-contain bg-background"
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                            />
                        ) : null}
                        {/* Fallback Icon */}
                        <div className={`w-8 h-8 rounded shrink-0 bg-primary/10 flex items-center justify-center ${bookmark.favicon_url ? 'hidden' : ''}`}>
                            <Link2 className="w-4 h-4 text-primary" />
                        </div>

                        <div className="truncate">
                            <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
                                {bookmark.title}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1 truncate">
                                <span className="truncate">{new URL(bookmark.url).hostname}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditBookmarkModal bookmark={bookmark} />
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <ConfirmDeleteModal
                                title="Delete Bookmark"
                                description={`Are you sure you want to delete the bookmark for "${bookmark.title}"?`}
                                onConfirm={handleDelete}
                                trigger={
                                    <button
                                        type="button"
                                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>

                {bookmark.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {bookmark.description}
                    </p>
                )}

                <div className="mt-auto pt-4 flex justify-between items-end">
                    <div className="text-[10px] text-muted-foreground font-mono">
                        {new Date(bookmark.created_at).toLocaleDateString()}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:rotate-12">
                        <ExternalLink className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </a>
    )
}
