import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollReveal from '@/components/ScrollReveal'
import Footer from '@/components/Footer'
import { Search, Upload, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Get Started with TSI',
  description: 'Join The Stewardship Initiative. Find resources, list your organization, or volunteer to help.',
}

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid flex flex-col">
      <div className="px-6 pt-10">
        <Header />
      </div>

      <main id="main-content" className="flex-1 w-full px-6 py-20">
        {/* Hero */}
        <section className="max-w-4xl mx-auto text-center mb-24">
          <ScrollReveal>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Make Invisible Resources Visible
            </h1>
            <p className="text-lg text-sage max-w-2xl mx-auto mb-10">
              Whether you need help, want to help, or provide services -- TSI connects ordinary families with the resources they need.
            </p>
          </ScrollReveal>
        </section>

        {/* Three Paths */}
        <section className="max-w-5xl mx-auto mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Path 1: I Need Resources */}
            <ScrollReveal delay={0}>
              <Link
                href="/search"
                className="group block h-full"
              >
                <div className="eden-glass rounded-2xl p-8 h-full flex flex-col hover:border-eden-tidal/50 transition-colors duration-300 border border-eden-tidal/20">
                  <div className="w-16 h-16 bg-eden-marigold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-eden-marigold/30 transition-colors">
                    <Search className="w-8 h-8 text-eden-marigold" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-eden-orchid mb-3">
                    I Need Resources
                  </h2>
                  <p className="text-eden-gray mb-6 flex-grow">
                    Find help from vetted community organizations, providers, and volunteers in your area.
                  </p>
                  <div className="text-sm text-eden-marigold font-semibold flex items-center gap-2">
                    Search Resources
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Path 2: I Provide Resources */}
            <ScrollReveal delay={100}>
              <Link
                href="/submit"
                className="group block h-full"
              >
                <div className="eden-glass rounded-2xl p-8 h-full flex flex-col hover:border-eden-tidal/50 transition-colors duration-300 border border-eden-tidal/20">
                  <div className="w-16 h-16 bg-eden-tidal/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-eden-tidal/30 transition-colors">
                    <Upload className="w-8 h-8 text-eden-tidal" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-eden-orchid mb-3">
                    I Provide Resources
                  </h2>
                  <p className="text-eden-gray mb-6 flex-grow">
                    List your nonprofit, agency, business, or services so families in your community can find you.
                  </p>
                  <div className="text-sm text-eden-tidal font-semibold flex items-center gap-2">
                    List Your Organization
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Path 3: I Want to Help */}
            <ScrollReveal delay={200}>
              <a
                href="mailto:hunter@simpli-fi-os.com?subject=TSI%20-%20Volunteer%20Mentor%20Interest"
                className="group block h-full"
              >
                <div className="eden-glass rounded-2xl p-8 h-full flex flex-col hover:border-eden-hibiscus/50 transition-colors duration-300 border border-eden-tidal/20">
                  <div className="w-16 h-16 bg-eden-hibiscus/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-eden-hibiscus/30 transition-colors">
                    <Heart className="w-8 h-8 text-eden-hibiscus" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-eden-orchid mb-3">
                    I Want to Help
                  </h2>
                  <p className="text-eden-gray mb-6 flex-grow">
                    Volunteer as a mentor, community guide, or partner to help TSI grow and serve more families.
                  </p>
                  <div className="text-sm text-eden-hibiscus font-semibold flex items-center gap-2">
                    Join Our Team
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          </div>
        </section>

        {/* Why TSI */}
        <section className="max-w-4xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              Why TSI Matters
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'For Families Seeking Help',
                points: [
                  'Find verified, trusted resources without the runaround',
                  'Browse what is available in your community',
                  'Connect directly with providers',
                  'Free to search and use'
                ]
              },
              {
                title: 'For Organizations & Providers',
                points: [
                  'Get discovered by families who need you',
                  'Build trust with real community endorsements',
                  'Free listings for nonprofits (always)',
                  'Premium options for enhanced visibility'
                ]
              }
            ].map((section, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="eden-glass rounded-xl p-8">
                  <h3 className="font-display text-xl font-bold text-eden-orchid mb-6">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.points.map((point, idx) => (
                      <li key={idx} className="flex gap-3 items-start text-sm">
                        <span className="text-eden-marigold shrink-0 mt-1">{'\u2713'}</span>
                        <span className="text-eden-gray">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-3xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
              How It Works
            </h2>
            <p className="text-sage text-center mb-12">Three simple principles guide everything we do.</p>
          </ScrollReveal>
          <div className="space-y-6">
            {[
              {
                num: '1',
                title: 'Visibility',
                desc: 'Resources that exist in your community become findable. Nonprofits, churches, providers, and volunteers connect families with what they actually need.'
              },
              {
                num: '2',
                title: 'Trust',
                desc: 'Verification and community endorsements build confidence. You know who you are connecting with because your neighbors vouch for them.'
              },
              {
                num: '3',
                title: 'Access',
                desc: 'Free listings for nonprofits. Free searching for families. Premium options for organizations wanting enhanced visibility.'
              }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="eden-glass rounded-xl p-8 flex gap-6 items-start">
                  <span className="font-display text-4xl font-bold text-eden-marigold/30 shrink-0">{item.num}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-eden-orchid mb-2">{item.title}</h3>
                    <p className="text-sm text-eden-gray">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              Common Questions
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {[
              {
                q: 'Is it really free?',
                a: 'Basic listings are free for nonprofits forever. Searching for resources is always free. Premium features available for organizations wanting enhanced visibility.'
              },
              {
                q: 'How do you verify organizations?',
                a: 'Community admins (usually church leaders, agency directors) verify providers before they appear. Each provider builds reputation through real endorsements.'
              },
              {
                q: 'What kinds of resources are listed?',
                a: 'Churches, nonprofits, counseling services, trades, professional services, first responder specialists, emergency resources, and community organizations.'
              },
              {
                q: 'Can I list multiple organizations?',
                a: 'Yes. Each community has its own directory. An organization can appear in multiple communities.'
              },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 75}>
                <details className="eden-glass rounded-xl group">
                  <summary className="flex items-center justify-between cursor-pointer list-none p-6 text-eden-orchid font-semibold text-sm">
                    {faq.q}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-eden-gray group-open:rotate-180 transition-transform shrink-0 ml-4">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <p className="px-6 pb-6 text-sm text-eden-gray">{faq.a}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Ready to Connect?
            </h2>
            <p className="text-sage mb-10 text-lg">
              Choose your path above and get started -- no sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="btn-primary">Search Resources</Link>
              <Link href="/submit" className="btn-secondary">List Organization</Link>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer backLink="/" backLabel="Back to Home" />
    </div>
  )
}
