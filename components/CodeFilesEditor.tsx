'use client'

import { useState, useRef, useEffect } from 'react'
import { CodeFile } from '@/types'

const CODE_TABS = [
    { id: 'tsx', label: 'React / TSX' },
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'js', label: 'JavaScript' },
]

interface CodeFilesEditorProps {
    initialFiles?: CodeFile[]
    // Name attribute for the hidden input that holds serialized JSON
    inputName?: string
}

export function CodeFilesEditor({ initialFiles = [], inputName = 'code_files' }: CodeFilesEditorProps) {
    const initCodes = () => {
        const map: Record<string, string> = {}
        CODE_TABS.forEach(tab => {
            const found = initialFiles.find(f => f.language === tab.id)
            map[tab.id] = found?.code ?? ''
        })
        return map
    }

    const [codes, setCodes] = useState<Record<string, string>>(initCodes)
    const [activeTab, setActiveTab] = useState('tsx')

    // Serialize to JSON for form submission
    const getCodeFiles = (): CodeFile[] => {
        return CODE_TABS
            .filter(tab => codes[tab.id]?.trim())
            .map(tab => ({ language: tab.id, code: codes[tab.id] }))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            const target = e.target as HTMLTextAreaElement
            const start = target.selectionStart
            const end = target.selectionEnd
            const newVal = codes[activeTab].substring(0, start) + '    ' + codes[activeTab].substring(end)
            setCodes(prev => ({ ...prev, [activeTab]: newVal }))
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + 4
            }, 0)
        }
    }

    return (
        <div className="space-y-1">
            {/* Tab Bar */}
            <div className="flex items-center border border-border bg-muted rounded-t-md overflow-hidden">
                {CODE_TABS.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 py-2 text-xs font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-background text-foreground border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }`}
                    >
                        {tab.label}
                        {/* Dot indicator if this tab has content */}
                        {codes[tab.id]?.trim() && (
                            <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-primary/70 align-middle" />
                        )}
                    </button>
                ))}
            </div>

            {/* Code Textarea */}
            {CODE_TABS.map(tab => (
                <div
                    key={tab.id}
                    className={tab.id === activeTab ? 'block' : 'hidden'}
                >
                    <textarea
                        value={codes[tab.id]}
                        onChange={e => setCodes(prev => ({ ...prev, [tab.id]: e.target.value }))}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        placeholder={`Your ${tab.label} code here...`}
                        className="flex min-h-[220px] w-full rounded-b-md border border-t-0 border-input bg-muted/30 font-mono px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y leading-relaxed"
                    />
                </div>
            ))}

            {/* Hidden input to submit JSON to the form action */}
            <input
                type="hidden"
                name={inputName}
                value={JSON.stringify(getCodeFiles())}
                readOnly
            />
        </div>
    )
}
