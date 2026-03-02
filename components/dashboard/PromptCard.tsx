'use client'

import { useState } from 'react'
import { Copy, Check, Hash, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export function PromptCard({ prompt }: { prompt: any }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.content)
            setCopied(true)
            toast.success("Prompt copié dans le presse-papiers !")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Échec de la copie.")
        }
    }

    return (
        <div className="group relative flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-500/50 transition-all duration-300">
            {/* Image Banner (Optional) */}
            {prompt.image_url ? (
                <div className="w-full h-32 relative overflow-hidden bg-muted/50 border-b border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={prompt.image_url}
                        alt={prompt.title}
                        className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    />
                </div>
            ) : (
                <div className="w-full h-6 bg-gradient-to-r from-indigo-500/10 to-transparent border-b border-border/50" />
            )}

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-lg line-clamp-2 leading-tight flex-grow text-foreground group-hover:text-indigo-400 transition-colors">
                        {prompt.title}
                    </h3>
                    <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                        <Sparkles className="w-4 h-4" />
                    </div>
                </div>

                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border/50 font-mono line-clamp-4 mb-4 flex-grow relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 z-10" />
                    {prompt.content}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex flex-wrap gap-1.5 overflow-hidden max-w-[60%]">
                        {prompt.tags && prompt.tags.map((tag: string, index: number) => (
                            <span key={index} className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border shrink-0 max-w-[80px] truncate">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={handleCopy}
                        className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-full transition-all duration-200 ${copied
                            ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                            : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-110'
                            }`}
                        title="Copier le prompt"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
