import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'

export const metadata: Metadata = {
  title: 'For Churches',
  description: 'The skills directory your church has been missing. Join churches transforming their congregation with TSI.',
}

export default function ForChurchesPage() {
  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid">
      <div className="px-6 pt-10">
        <Header />
      </div>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The Skills Directory Your Church Has Been Missing
          </h1>
          <p className="text-lg text-sage max-w-2xl mx-auto mb-10">
            Join churches transforming their congregation in one afternoon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started" className="btn-primary">Start Free Now</Link>
            <Link href="/directory/village-church" className="btn-secondary">See Demo</Link>
          </div>
        </div>
      </section>

      {/* Video Placeholder */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold text-center mb-6">See It in Action</h2>
            <div className="aspect-video eden-glass rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-eden-marigold/20 flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-eden-marigold ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="text-sm text-sage">Watch how The Village Church set up their directory in 15 minutes</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
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

      {/* Testimonial / Case Study */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold mb-10">Real Results from Real Churches</h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <blockquote className="eden-glass p-8 rounded-xl border-l-4 border-eden-hibiscus text-left mb-10">
              <p className="font-display text-xl text-eden-orchid italic leading-relaxed mb-4">
                &ldquo;We discovered 47 skills we didn&apos;t know existed. Three members connected to help each other in the first week. This is what the church is supposed to be.&rdquo;
              </p>
              <p className="text-sm text-sage">— Pastor David Mitchell, The Village Church</p>
            </blockquote>
          </ScrollReveal>
          <div className="grid grid-cols-3 gap-6">
            {[
              { num: 47, suffix: ' skills', label: 'Discovered' },
              { num: 3, suffix: '', label: 'Connections in week 1' },
              { num: 100, suffix: '%', label: 'Adoption rate' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-eden-marigold">
                    <AnimatedCounter target={stat.num} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-sage mt-1">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Your Church Already Has Everything It Needs. It Just Needs to Be Seen.
          </h2>
          <Link href="/get-started" className="btn-primary text-lg mt-8 inline-block" style={{ padding: '1rem 3rem' }}>
            Start Your Church Directory Free
          </Link>
          <p className="text-xs text-sage mt-4">No credit card. No setup fee. Unlimited members. Cancel anytime.</p>
        </div>
      </section>
    </div>
  )
}
