import { SpaceBackground } from '@/components/landing/SpaceBackground'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { HeroSection } from '@/components/landing/HeroSection'
import { PricingSection } from '@/components/landing/PricingSection'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-50 selection:bg-indigo-500/30">
      <SpaceBackground />
      <LandingHeader />
      <div className="pt-20 pb-16">
        <HeroSection />
        <PricingSection />
      </div>

      {/* Subtle bottom gradient for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </main>
  )
}
