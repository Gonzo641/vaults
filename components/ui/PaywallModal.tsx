'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Rocket, X, Crown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PaywallModalProps {
    isOpen: boolean
    onClose: () => void
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            // Animate In
            document.body.style.overflow = 'hidden'
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            )
            gsap.fromTo(modalRef.current,
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.1 }
            )
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleClose = () => {
        // Animate Out
        gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.2, ease: 'power2.in' })
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: onClose })
    }

    if (!isOpen) return null

    return (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm opacity-0">
            {/* Ambient Background Glow behind modal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full pointer-events-none" />

            <div
                ref={modalRef}
                className="relative w-full max-w-lg overflow-hidden bg-[#020205] border border-white/10 rounded-2xl shadow-[0_0_50px_-15px_rgba(99,102,241,0.5)] opacity-0"
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative p-8 text-center flex flex-col items-center">

                    <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse blur-md" />
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <Crown className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 rotate-12 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">Orbit Capacity Reached</h2>
                    <p className="text-white/60 mb-8 max-w-sm">
                        You&apos;ve stored 15 components. Upgrade your pass to expand your vault to infinity and beyond.
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <Link
                            href="/pricing"
                            onClick={handleClose}
                            className="group relative flex items-center justify-center w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
                        >
                            View Plans <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <button
                            onClick={handleClose}
                            className="w-full px-6 py-3 font-medium text-white/70 hover:text-white bg-transparent hover:bg-white/[0.05] rounded-xl transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
