'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Copy, Code, Check } from 'lucide-react'

interface ComponentCardProps {
    component: any
}

import { useRouter } from 'next/navigation'

export function ComponentCard({ component }: ComponentCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    const handleMouseEnter = () => {
        if (!cardRef.current || !overlayRef.current || !contentRef.current) return

        gsap.killTweensOf([overlayRef.current, contentRef.current])

        gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
        })

        gsap.fromTo(
            contentRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.1 }
        )
    }

    const handleMouseLeave = () => {
        if (!cardRef.current || !overlayRef.current || !contentRef.current) return

        gsap.killTweensOf([overlayRef.current, contentRef.current])

        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
        })

        gsap.to(contentRef.current, {
            y: 10,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
        })
    }

    const copyCode = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        // Pick first non-empty file to copy from the card hover
        const files = Array.isArray(component.code_files) ? component.code_files : []
        const firstFile = files.find((f: any) => f.code?.trim())
        if (firstFile) {
            navigator.clipboard.writeText(firstFile.code)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCardClick = () => {
        router.push(`/component/${component.id}`)
    }

    return (
        <div
            ref={cardRef}
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group block relative cursor-pointer rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-border break-inside-avoid"
        >
            {/* Fallback pattern if no image */}
            {!component.preview_image_1_url && (
                <div className="w-full aspect-[4/3] bg-[#1c2128] flex items-center justify-center p-8">
                    <div className="flex items-center gap-2 text-[#4d5b76]">
                        <Code className="w-10 h-10 -rotate-12 opacity-80" strokeWidth={1.5} />
                        <span className="font-medium text-sm">No preview</span>
                    </div>
                </div>
            )}

            {/* Preview Image */}
            {component.preview_image_1_url && (
                <div className="w-full relative aspect-[4/3] bg-muted overflow-hidden">
                    {/* We assume Next.js Image isn't fully configured for remote domains yet, so using img for rapid prototyping */}
                    <img
                        src={component.preview_image_1_url}
                        alt={component.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Info Section */}
            <div className="p-4 bg-card relative z-10">
                <h3 className="font-semibold px-1 text-base tracking-tight mb-1 truncate text-foreground">
                    {component.title}
                </h3>
                {component.description && (
                    <p className="px-1 text-sm text-muted-foreground line-clamp-2">
                        {component.description}
                    </p>
                )}

                {component.component_tags && component.component_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {component.component_tags.map((relation: any) => (
                            <span
                                key={relation.tags.id}
                                className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                            >
                                {relation.tags.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Animated Overlay for quick Copy */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 opacity-0 pointer-events-none flex items-center justify-center"
            >
                <div ref={contentRef} className="opacity-0 pointer-events-auto">
                    <button
                        onClick={copyCode}
                        className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        {copied ? (
                            <>
                                <Check className="w-5 h-5" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                <span>Copy Code</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
