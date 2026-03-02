import { SpaceBackground } from '@/components/landing/SpaceBackground'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { HeroSection } from '@/components/landing/HeroSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) profile = data
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-50 selection:bg-indigo-500/30">
      <SpaceBackground />
      <LandingHeader isLoggedIn={isLoggedIn} user={user} profile={profile} />
      <div className="pt-20 pb-16">
        <HeroSection isLoggedIn={isLoggedIn} />
        <PricingSection />
      </div>

      {/* Subtle bottom gradient for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </main>
  )
}
