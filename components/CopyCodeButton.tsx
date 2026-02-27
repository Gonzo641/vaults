'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyCodeButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false)

    const copyCode = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                </>
            )}
        </button>
    )
}
