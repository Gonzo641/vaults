'use client'

import React from 'react'
import { Rocket, Code2, MessageSquare, Crown } from 'lucide-react'

export function CosmicJourney() {
    return (
        <div className="relative w-full max-w-5xl mx-auto mt-24 sm:mt-32 mb-20 px-4 sm:px-6">

            {/* Header / Intro for the section */}
            <div className="text-center mb-16 relative z-10">
                <p className="text-sm font-medium tracking-widest text-indigo-300 uppercase mb-2">
                    Explore the Features
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    An Isodimensional Journey
                </h2>
            </div>

            <div className="relative">
                {/* Central Line */}
                <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent -translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse" />

                {/* Rocket Icon Drop */}
                <div className="absolute left-[30px] md:left-1/2 top-0 -translate-y-6 bg-slate-950 p-2 rounded-full border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.6)] z-20 -translate-x-1/2">
                    <Rocket className="w-5 h-5 text-indigo-400 rotate-180" />
                </div>

                <div className="flex flex-col gap-16 md:gap-24 relative z-10 pt-10">

                    {/* Step 1: Base Camp */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full group relative">
                        {/* Dot */}
                        <div className="absolute left-[30px] md:left-1/2 top-6 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20">
                            <div className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-75"></div>
                        </div>

                        {/* Card on Desktop Left, Mobile Right */}
                        <div className="w-full pl-[70px] md:pl-0 md:w-5/12 flex md:justify-end">
                            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:border-indigo-500/50 w-full md:text-right relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center md:justify-end gap-2"><Code2 className="w-5 h-5 text-indigo-400" /> Base Camp: The Vault</h3>
                                <p className="text-sm text-slate-300 mb-4">Store, organize, and retrieve your components with ease. Your personal codebase awaits.</p>
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-white/5 font-mono text-xs text-left text-indigo-200">
                                    {'export const Hero = () => {'}<br />
                                    {'  return <section... />'}<br />
                                    {'}'}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block md:w-2/12"></div>
                        <div className="hidden md:block md:w-5/12"></div>
                    </div>

                    {/* Step 2: Asteroid Belt */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full group relative">
                        <div className="absolute left-[30px] md:left-1/2 top-6 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] z-20">
                            <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></div>
                        </div>

                        <div className="hidden md:block md:w-5/12"></div>
                        <div className="hidden md:block md:w-2/12"></div>

                        <div className="w-full pl-[70px] md:pl-0 md:w-5/12 flex md:justify-start">
                            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:border-purple-500/50 w-full text-left relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-purple-400" /> Asteroid Belt: The Prompt Forge</h3>
                                <p className="text-sm text-slate-300 mb-4">Forge and save your best AI instructions. Never lose a perfect prompt again with your dedicated prompt library.</p>
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-white/5 font-mono text-xs text-purple-200">
                                    System: Act as an expert Next.js UI Engineer...
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Commander Mode */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full group relative">
                        <div className="absolute left-[30px] md:left-1/2 top-6 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] z-20">
                            <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75"></div>
                        </div>

                        <div className="w-full pl-[70px] md:pl-0 md:w-5/12 flex md:justify-end">
                            <div className="bg-white/[0.03] border border-amber-500/30 p-6 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] group-hover:border-amber-400/60 w-full md:text-right relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                                <h3 className="text-xl font-bold text-amber-50 mb-2 flex items-center md:justify-end gap-2 relative z-10"><Crown className="w-5 h-5 text-amber-400 shrink-0" /> Final Destination: Upgrade</h3>
                                <p className="text-sm text-amber-100/70 mb-4 relative z-10 w-full">Unlock premium Shiki themes, unlimited component and prompt storage. Take control of your universe.</p>
                                <div className="flex items-center md:justify-end gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mt-4">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Access Granted
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block md:w-2/12"></div>
                        <div className="hidden md:block md:w-5/12"></div>
                    </div>

                </div>
            </div>
        </div>
    )
}
