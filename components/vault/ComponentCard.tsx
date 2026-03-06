'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ComponentWithTags } from '@/types';

export function ComponentCard({ component }: { component: ComponentWithTags }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [copied, setCopied] = useState(false);

    // Initialiser les animations GSAP avec un scope sur le container
    useGSAP(() => {
        // État initial (caché)
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(buttonRef.current, { y: 20, opacity: 0, scale: 0.95 });
    }, { scope: containerRef });

    const handleMouseEnter = () => {
        gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
        gsap.to(buttonRef.current, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
        });
    };

    const handleMouseLeave = () => {
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
        });
        gsap.to(buttonRef.current, {
            y: 20,
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.in',
        });
    };

    const handleCopy = async () => {
        try {
            // Pick the first non-empty file (TSX priority)
            const files = Array.isArray(component.code_files) ? component.code_files : []
            const firstFile = files.find((f: any) => f.code?.trim())
            if (firstFile) {
                await navigator.clipboard.writeText(firstFile.code)
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy code: ', err)
        }
    }

    return (
        <div
            ref={containerRef}
            className="group relative flex flex-col items-start gap-4 mb-6 break-inside-avoid rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image Preview Container */}
            <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-muted border border-border">
                {component.preview_image_1_url ? (
                    <img
                        src={component.preview_image_1_url}
                        alt={component.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                        No preview available
                    </div>
                )}

                {/* Hover Overlay with GSAP */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                    <button
                        ref={buttonRef}
                        onClick={handleCopy}
                        className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        {copied ? (
                            <>
                                <Check className="h-5 w-5" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-5 w-5" />
                                Copy Code
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex w-full flex-col gap-2">
                <h3 className="font-semibold text-lg leading-none tracking-tight">
                    {component.title}
                </h3>

                {component.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {component.description}
                    </p>
                )}

                {/* Tags */}
                {component.tags && component.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {component.tags.map(tag => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
