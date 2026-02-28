'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Rocket, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react'
import { gsap } from 'gsap'

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const subtitleRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()

            tl.fromTo(titleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
            )
                .fromTo(subtitleRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                    "-=0.6"
                )
                .fromTo(buttonsRef.current,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
                    "-=0.4"
                )

            if (cardsRef.current) {
                const cards = cardsRef.current.children

                tl.fromTo(cards,
                    { y: 100, opacity: 0, rotationX: 45 },
                    { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.2, ease: 'power2.out' },
                    "-=0.5"
                )

                // Add GSAP tweens explicitly to the current context for unmounting safety
                Array.from(cards).forEach((card, i) => {
                    gsap.to(card, {
                        y: -15, // Float upwards
                        rotationZ: Math.random() * 2 - 1, // Slight rock
                        duration: 3 + Math.random(),
                        yoyo: true,
                        repeat: -1,
                        ease: 'sine.inOut',
                        delay: 1.5 + (i * 0.2) // Delay until entrance finishes
                    })
                })
            }
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="relative z-10 flex flex-col items-center pt-24 pb-16 px-4 text-center">

            {/* Aurora Borealis Accent behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[1200px] h-[400px] bg-gradient-to-r from-emerald-500/30 via-indigo-500/40 to-purple-500/30 blur-[120px] rounded-[100%] rotate-6 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[900px] h-[300px] bg-gradient-to-r from-blue-500/30 via-cyan-400/30 to-transparent blur-[100px] rounded-full -rotate-12 pointer-events-none" />

            <h1 ref={titleRef} className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 max-w-4xl drop-shadow-sm">
                Elevate your components to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">cosmos.</span>
            </h1>

            <p ref={subtitleRef} className="mt-6 text-lg md:text-xl text-blue-100/70 max-w-2xl font-light">
                The ultimate vault to store, organize, and retrieve your React components. Featuring drag-and-drop uploads, automatic WebP compression, and stellar organization.
            </p>

            <div ref={buttonsRef} className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/login?tab=signup" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-full hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                    <Rocket className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    Launch your Vault
                </Link>
                <Link href="/login" className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium text-white transition-all bg-white/5 border border-white/10 rounded-full hover:bg-white/10 backdrop-blur-sm">
                    Access Terminal <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Video Placeholder */}
            <div className="mt-16 sm:mt-20 w-full max-w-4xl mx-auto flex flex-col items-center group perspective-1000 z-20">
                <p className="text-sm font-medium tracking-widest text-indigo-300 uppercase mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    See the Omnibar in action
                </p>
                <div className="w-full aspect-video rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-[0_0_50px_-15px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_80px_-20px_rgba(99,102,241,0.5)] flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:border-indigo-500/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-full bg-indigo-600/80 group-hover:bg-indigo-500 flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(99,102,241,0.8)] backdrop-blur-sm transition-all group-hover:scale-110 relative z-10">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                    </div>
                </div>
            </div>

            {/* Zero-Gravity Feature Cards */}
            <div ref={cardsRef} className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full perspective-1000 items-stretch">

                <div className="flex flex-col items-center p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl h-full">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-4">
                        <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Lightspeed Uploads</h3>
                    <p className="text-sm text-center text-white/50">Instant uploads. Your images are automatically optimized in the background for zero loading time.</p>
                </div>

                <div className="flex flex-col items-center p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl h-full mt-4 md:mt-0">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mb-4">
                        <Layers className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Infinite Organization</h3>
                    <p className="text-sm text-center text-white/50">Tag, search, and filter through your UI multiverse using our powerful Omnibar system.</p>
                </div>

                <div className="flex flex-col items-center p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl h-full mt-4 md:mt-0">
                    <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 mb-4">
                        <ShieldCheck className="w-6 h-6 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Secure Orbit</h3>
                    <p className="text-sm text-center text-white/50">100% Private. Your component code is completely isolated, encrypted, and accessible only by you.</p>
                </div>

            </div>

        </div>
    )
}
