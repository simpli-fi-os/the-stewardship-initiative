import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'For Churches | The Stewardship Initiative',
  description: 'Help your congregation find each other. A free resource directory built for churches who believe in stewardship.',
}

export default function ForChurchesPage() {
  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid flex flex-col">
      <div className="px-6 pt-10">
        <Header />
      </div>

      <main id="main-content" className="flex-1 w-full px-6 py-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <ScrollReveal>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Congregation Already Has Everything It Needs. Help Them Find Each Other.
          </h1>
          <p className="text-lg text-sage max-w-2xl mx-auto mb-10">
            A free resource directory built for churches who believe in stewardship of gifts, skills, and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit" className="btn-primary">List Your Church Free</Link>
            <Link href="/search" className="btn-secondary">Browse the Directory</Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Before / After */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="left">
            <div className="eden-glass p-8 rounded-xl">
              <h3 className="font-display text-2xl font-bold text-eden-redwood mb-6">Before: The Hidden Economy</h3>
              <ul className="space-y-4">
                {[
                  'Members don\'t know what skills exist in the congregation',
                  'Unmet needs go unmet because nobody knows who can help',
                  'Potential volunteers don\'t know where they\'re needed',
                  'Admin scrambles to coordinate help',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-eden-gray">
                    <span className="text-eden-redwood shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={100}>
            <div className="eden-glass p-8 rounded-xl border-eden-tidal/20">
              <h3 className="font-display text-2xl font-bold text-eden-tidal mb-6">After: The Visible Network</h3>
              <ul className="space-y-4">
                {[
                  'Members find each other based on real skills',
                  'Needs get met within hours, not weeks',
                  'Volunteers know exactly where they\'re needed',
                  'Admin dashboard tracks connections and impact',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-eden-orchid">
                    <span className="text-eden-tidal shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-center mb-12">Everything Your Church Needs</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Branded Directory Page', desc: 'Your church\'s name, logo, colors. Shows your unique community.' },
              { title: 'Simple Member Invites', desc: 'Email + text. No training. Members add themselves in 2 minutes.' },
              { title: 'Skill-Based Search', desc: 'Find plumbers, counselors, teachers, contractors. Exactly what your community has.' },
              { title: 'Endorsement System', desc: 'Members vouch for each other. Real trust.' },
              { title: 'Admin Dashboard', desc: 'See all activity, member count, trending skills, connection frequency.' },
              { title: 'Mobile-First Design', desc: 'Works perfectly on phones. Your members live on their phones.' },
            ].map((f, i) => (
              <ScrollReveal key={i} delay={i * 75}>
                <div className="eden-glass p-6 rounded-xl">
                  <h3 className="font-display text-lg font-bold text-eden-orchid mb-2">{f.title}</h3>
                  <p className="text-sm text-eden-gray">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Early Adopter CTA */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="eden-glass p-10 rounded-xl border-l-4 border-eden-hibiscus text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Be One of the First Churches on TSI
              </h2>
              <p className="text-eden-gray text-lg leading-relaxed mb-6">
                TSI is building the community resource directory that Denton County has been missing. Churches that list early get the most visibility as families start discovering resources through the platform.
              </p>
              <Link href="/submit" className="btn-primary inline-block">List Your Church Free</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How long does setup take?', a: '15 minutes. We walk you through every step.' },
              { q: 'Can we control who sees the directory?', a: 'Yes. Public for SEO and visitors, or private with members-only access.' },
              { q: 'What if a member isn\'t tech-savvy?', a: 'They just fill out a simple form. No app, no account creation required.' },
              { q: 'Can we delete the directory later?', a: 'Yes. Your data is always yours. Export or delete anytime.' },
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
      <section className="max-w-2xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Your Congregation Is Full of Hidden Gifts. Help Them Be Seen.
          </h2>
          <Link href="/submit" className="btn-primary text-lg" style={{ padding: '1rem 3rem' }}>
            List Your Church Free
          </Link>
          <p className="text-xs text-sage mt-6">No credit card. No setup fee. No obligation.</p>
        </ScrollReveal>
      </section>
      </main>

      <Footer backLink="/" backLabel="Back to Home" />
    </div>
  )
}
