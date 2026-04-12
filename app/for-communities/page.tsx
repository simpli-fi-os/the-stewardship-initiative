import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollReveal from '@/components/ScrollReveal'
import Footer from '@/components/Footer'
import { Globe, Users, TrendingUp, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Community Organizations',
  description: 'Help your nonprofit, church, or agency get discovered by families who need you. Free to list, always.',
}

export default function ForCommunitiesPage() {
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
              Help Families Find You
            </h1>
            <p className="text-lg text-sage max-w-2xl mx-auto mb-10">
              Churches, nonprofits, agencies, and providers—get discovered by the families in your community who need your help.
            </p>
            <Link href="/submit" className="btn-primary">List Your Organization Free</Link>
          </ScrollReveal>
        </section>

        {/* Why Get Listed */}
        <section className="max-w-5xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              Why Your Organization Should Be on TSI
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Globe,
                title: 'Get Discovered',
                desc: 'Families in your community are actively looking for help. A listing on TSI puts you in front of people who need exactly what you offer.'
              },
              {
                icon: Users,
                title: 'Build Trust',
                desc: 'Real endorsements from community members (church leaders, neighbors, verified users) create credibility you can\'t buy with ads.'
              },
              {
                icon: TrendingUp,
                title: 'Track Impact',
                desc: 'See how many families found you through TSI. Analytics show which services are most needed in your community.'
              },
              {
                icon: Award,
                title: 'Stand Out',
                desc: 'Verification and transparency are built in. Families know your organization is real and trusted before they reach out.'
              }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="eden-glass rounded-2xl p-8">
                    <div className="w-12 h-12 bg-eden-marigold/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-eden-marigold" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-eden-orchid mb-3">{item.title}</h3>
                    <p className="text-sm text-eden-gray">{item.desc}</p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </section>

        {/* Before / After */}
        <section className="max-w-5xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              What Changes When You List
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <div className="eden-glass p-8 rounded-xl">
                <h3 className="font-display text-2xl font-bold text-eden-redwood mb-6">Before</h3>
                <ul className="space-y-4">
                  {[
                    'Families don\'t know your organization exists',
                    'Referrals happen through word-of-mouth only',
                    'Outreach requires expensive advertising',
                    'No way to measure community need or impact',
                    'Volunteers don\'t know where help is most needed',
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
                <h3 className="font-display text-2xl font-bold text-eden-tidal mb-6">After TSI</h3>
                <ul className="space-y-4">
                  {[
                    'Families in your community find you when searching for help',
                    'Credibility builds through verified endorsements',
                    'Free listing means zero marketing cost',
                    'See exactly what your community needs most',
                    'Attract mission-aligned volunteers who see the need',
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

        {/* How It Works */}
        <section className="max-w-3xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
              Get Listed in 5 Minutes
            </h2>
            <p className="text-sage text-center mb-12">Three simple steps to being discoverable.</p>
          </ScrollReveal>
          <div className="space-y-6">
            {[
              {
                num: '1',
                title: 'Fill Out Your Profile',
                desc: 'Organization name, mission, contact info, and the services you offer. Include hours, location, and how families can reach you.'
              },
              {
                num: '2',
                title: 'Community Verification',
                desc: 'A community admin (usually a church leader or agency director) verifies your organization. Usually happens within 24 hours.'
              },
              {
                num: '3',
                title: 'Go Live',
                desc: 'Your listing appears in the community directory. Families searching for your type of service find you immediately.'
              }
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="eden-glass rounded-xl p-6 flex gap-6 items-start">
                  <span className="font-display text-4xl font-bold text-eden-marigold/30 shrink-0">{step.num}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-eden-orchid mb-2">{step.title}</h3>
                    <p className="text-sm text-eden-gray">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Types of Organizations */}
        <section className="max-w-4xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              All Types of Organizations Belong on TSI
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Churches & Faith Communities',
              'Food Pantries & Basic Needs',
              'Counseling & Mental Health',
              'Housing & Homelessness',
              'Legal Aid & Advocacy',
              'Financial Counseling',
              'Job Training & Employment',
              'Childcare & Family Services',
              'Medical & Dental Clinics',
              'Trades & Professional Services',
              'Community Agencies',
              'Volunteer Networks'
            ].map((type, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="eden-glass rounded-xl p-5">
                  <p className="text-sm text-eden-gray text-center">{type}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-3xl mx-auto mb-24">
          <div className="eden-glass rounded-2xl p-10">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">
                Free Listings for Nonprofits. Always.
              </h2>
              <p className="text-sage text-center mb-8">
                Your organization's visibility shouldn't depend on your budget. Basic listings are free forever. Premium features available for organizations wanting enhanced visibility, analytics, and volunteer coordination.
              </p>
              <div className="text-center">
                <Link href="/submit" className="btn-primary">Start Your Free Listing</Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Early Adopter CTA */}
        <section className="max-w-3xl mx-auto mb-24">
          <ScrollReveal>
            <div className="eden-glass p-10 rounded-xl border-l-4 border-eden-hibiscus text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Be One of the First
              </h2>
              <p className="text-eden-gray text-lg leading-relaxed mb-6">
                TSI is building something new for Denton County. Organizations that list early get the most visibility as families start discovering resources through our platform.
              </p>
              <Link href="/submit" className="btn-primary inline-block">List Your Organization Free</Link>
            </div>
          </ScrollReveal>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              Questions
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {[
              {
                q: 'Does it cost anything to list?',
                a: 'No. Basic listings are completely free for nonprofits, churches, and community organizations. We offer optional premium features for enhanced visibility and analytics.'
              },
              {
                q: 'How does verification work?',
                a: 'A community admin (usually a church leader or agency director in your area) verifies that your organization is legitimate. This builds trust with families searching for help.'
              },
              {
                q: 'Can we list multiple locations?',
                a: 'Yes. If your organization has multiple sites, you can create a listing for each location so families find the one nearest them.'
              },
              {
                q: 'What if we want more visibility?',
                a: 'Premium tiers offer featured placement, custom branding, volunteer coordination tools, and detailed analytics. But basic free listings are powerful on their own.'
              },
              {
                q: 'How do we handle requests from families?',
                a: 'That\'s completely up to you. Families see your contact info and reach out directly. You manage inquiries however works best for your organization.'
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
              Your Community Needs What You Offer. Help Them Find You.
            </h2>
            <Link href="/submit" className="btn-primary text-lg" style={{ padding: '1rem 3rem' }}>
              List Your Organization Free
            </Link>
            <p className="text-xs text-sage mt-6">No credit card. No setup fee. No obligation. Cancel anytime.</p>
          </ScrollReveal>
        </section>
      </main>

      <Footer backLink="/" backLabel="Back to Home" />
    </div>
  )
}
