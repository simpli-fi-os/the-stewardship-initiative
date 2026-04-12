import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'For First Responders',
  description: 'Specialists who understand your life. First responder advisors, family season guides, and community support.',
}

export default function ForFirstRespondersPage() {
  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid">
      <div className="px-6 pt-10"><Header /></div>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Specialists Who Understand Your Life
          </h1>
          <p className="text-lg text-sage max-w-2xl mx-auto mb-10">
            First responder advisors. Family season guides. When you need help, someone who <em>gets it</em> is right there.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn-primary">Explore Specialists</Link>
            <Link href="/get-started" className="btn-secondary">List Your Practice</Link>
          </div>
        </div>
      </section>

      {/* Life Stages */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-center mb-4">The First Responder Journey</h2>
            <p className="text-sage text-center mb-12">Different life stages with specialists who understand.</p>
          </ScrollReveal>
          <div className="space-y-4">
            {[
              { stage: 'New to the Force', desc: 'Onboarding advisors who help with adjustment, family strain, and navigating the culture.' },
              { stage: 'Career Growth', desc: 'Advancement planning, promotion prep, parallel income strategies for first responder families.' },
              { stage: 'Family Transitions', desc: 'Spouse career changes, childcare, education planning, and family financial planning.' },
              { stage: 'Burnout & Career End', desc: 'Transition planning, second career coaching, business opportunities for ex-first responders.' },
              { stage: 'Loss & Trauma', desc: 'Grief counseling specialists trained in first responder culture. PTSD support. Critical incident debriefing.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 75}>
                <div className="eden-glass p-6 rounded-xl flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-eden-marigold mt-2 shrink-0" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-eden-orchid mb-1">{item.stage}</h3>
                    <p className="text-sm text-eden-gray">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Specialist Types */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold text-center mb-10">Specialist Categories</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Mental health professionals trained in first responder trauma',
              'Financial advisors who understand pension/benefits structures',
              'Career counselors for second careers',
              'Family counselors experienced with first responder families',
              'Business advisors for moonlighting and post-career entrepreneurship',
              'Fitness and wellness coaches specializing in shift-work health',
            ].map((spec, i) => (
              <ScrollReveal key={i} delay={i * 75}>
                <div className="eden-glass p-5 rounded-xl">
                  <p className="text-sm text-eden-gray">{spec}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-center mb-12">Find Your Specialist</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num: '1', title: 'Search by Need', desc: '"PTSD support", "career planning", "spouse career coaching"' },
              { num: '2', title: 'See Credentials', desc: 'Verified specialists with first responder training' },
              { num: '3', title: 'Connect Direct', desc: 'Message or call the specialist directly' },
              { num: '4', title: 'Get Help', desc: 'Pay out-of-pocket or use insurance (varies by provider)' },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="eden-glass p-6 rounded-xl flex gap-4 items-start">
                  <span className="font-display text-3xl font-bold text-eden-marigold/30">{step.num}</span>
                  <div>
                    <h3 className="font-display text-base font-bold text-eden-orchid mb-1">{step.title}</h3>
                    <p className="text-sm text-eden-gray">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Your Family Deserves Specialists Who Understand.
        </h2>
        <p className="text-sage mb-8">The people who serve deserve people who serve them back.</p>
        <Link href="/search" className="btn-primary text-lg" style={{ padding: '1rem 3rem' }}>
          Find Your Specialist
        </Link>
      </section>
    </div>
  )
}
