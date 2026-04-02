import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'For Providers',
  description: 'Get found by your community. Create a free profile, get discovered, and build trust through real endorsements.',
}

export default function ForProvidersPage() {
  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid">
      <div className="px-6 pt-10"><Header /></div>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get Found by Your Community
          </h1>
          <p className="text-lg text-sage max-w-2xl mx-auto mb-10">
            Create a free profile. Get discovered. Build trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started" className="btn-primary">Create Free Profile</Link>
            <Link href="/directory/village-church" className="btn-secondary">See Examples</Link>
          </div>
        </div>
      </section>

      {/* Why List */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-center mb-12">Why List on TSI</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Get Discovered', desc: 'Appear in communities where you already live and work. No ads. No cold calling.' },
              { title: 'Build Trust Fast', desc: 'Endorsements from real community members create credibility you can\'t buy.' },
              { title: 'Three-Layer Opportunity', desc: 'Your service gets you connected with a community leader who might become a wealth management client.' },
            ].map((card, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="eden-glass p-8 rounded-xl text-center">
                  <h3 className="font-display text-xl font-bold text-eden-orchid mb-3">{card.title}</h3>
                  <p className="text-sm text-eden-gray">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How to Create a Profile */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-center mb-4">It Takes 5 Minutes</h2>
            <p className="text-sage text-center mb-12">Three simple steps to being discoverable.</p>
          </ScrollReveal>
          <div className="space-y-6">
            {[
              { num: '1', title: 'Basic Info', desc: 'Name, photo, email, phone. The essentials.' },
              { num: '2', title: 'Skills & Services', desc: 'What you offer, your availability, and how you can help.' },
              { num: '3', title: 'Go Live', desc: 'Community admin approves your profile. You\'re discoverable.' },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="eden-glass p-6 rounded-xl flex gap-6 items-start">
                  <span className="font-display text-4xl font-bold text-eden-marigold/30 shrink-0">{step.num}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-eden-orchid mb-1">{step.title}</h3>
                    <p className="text-sm text-eden-gray">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold mb-8">How We Keep Everyone Safe</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Community admins verify every provider',
              'Endorsements build accountability',
              'Clear rating/review system coming soon',
            ].map((point, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="eden-glass p-6 rounded-xl">
                  <p className="text-sm text-eden-gray">{point}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What\'s the cost?', a: 'Free to list. Premium features coming at $19/mo for enhanced visibility.' },
              { q: 'What communities are on TSI?', a: 'Starting with churches, adding fire departments, local artisans, and more.' },
              { q: 'How do I get paid?', a: 'That\'s between you and the client. We don\'t handle payments.' },
            ].map((faq, i) => (
              <details key={i} className="eden-glass rounded-xl group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-5 text-eden-orchid font-medium text-sm">
                  {faq.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-eden-gray group-open:rotate-180 transition-transform shrink-0 ml-4">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-sm text-sage">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Your Skills Deserve to Be Visible</h2>
        <Link href="/get-started" className="btn-primary text-lg" style={{ padding: '1rem 3rem' }}>
          Create Your Free Profile
        </Link>
      </section>
    </div>
  )
}
