'use client'

import { useState } from 'react'
import { CodeFile } from '@/types'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

const LANGUAGE_LABELS: Record<string, string> = {
    tsx: 'React / TSX',
    html: 'HTML',
    css: 'CSS',
    js: 'JavaScript',
}

interface CodeFilesViewerProps {
    codeFiles: CodeFile[]
    // Pre-rendered HTML strings from Shiki (keyed by language)
    highlightedFiles: Record<string, string>
}

export function CodeFilesViewer({ codeFiles, highlightedFiles }: CodeFilesViewerProps) {
    const [activeTab, setActiveTab] = useState(codeFiles[0]?.language ?? 'tsx')
    const [copied, setCopied] = useState(false)

    const activeFile = codeFiles.find(f => f.language === activeTab)

    const onCopy = () => {
        if (!activeFile?.code) return
        navigator.clipboard.writeText(activeFile.code)
        setCopied(true)
        toast.success('Code copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    if (codeFiles.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                No code saved yet.
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 min-h-[400px]">
            <div className="flex items-center justify-between shrink-0 mb-2">
                {/* Tab switching */}
                <div className="flex items-center gap-1">
                    {codeFiles.map(file => (
                        <button
                            key={file.language}
                            type="button"
                            onClick={() => setActiveTab(file.language)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === file.language
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            {LANGUAGE_LABELS[file.language] ?? file.language}
                        </button>
                    ))}
                </div>

                {/* Copy current tab */}
                <button
                    onClick={onCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>

            <div className="relative flex-1 rounded-xl border border-border bg-[#1a1b26] overflow-hidden">
                <div className="absolute inset-0 overflow-auto">
                    {codeFiles.map(file => (
                        <div
                            key={file.language}
                            className={file.language === activeTab ? 'block min-h-full' : 'hidden'}
                            dangerouslySetInnerHTML={{ __html: highlightedFiles[file.language] ?? file.code }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
