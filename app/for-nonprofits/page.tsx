import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'For Nonprofits',
  description: 'Making invisible resources visible for those who need them most. Free listings for all nonprofits.',
}

export default function ForNonprofitsPage() {
  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid">
      <div className="px-6 pt-10"><Header /></div>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Making Invisible Resources Visible for Those Who Need Them Most
          </h1>
          <p className="text-lg text-sage max-w-2xl mx-auto mb-10">
            TSI connects people in crisis with vetted community resources — free, fast, and without the runaround.
          </p>
          <Link href="/get-started" className="btn-primary">List Your Organization Free</Link>
        </div>
      </section>

      {/* Problems */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-center mb-10">Problems Nonprofits Face</h2>
          </ScrollReveal>
          <div className="space-y-4">
            {[
              'People in crisis don\'t know about available services',
              'Services are listed across multiple platforms, outdated databases',
              'Volunteers don\'t know where help is most needed',
              'Hard to track what services are being used',
              'Development programs lack visibility in their communities',
              'Community housing projects struggle to reach the families they exist to serve',
            ].map((problem, i) => (
              <ScrollReveal key={i} delay={i * 75}>
                <div className="eden-glass p-5 rounded-xl flex gap-3 items-start">
                  <span className="text-eden-redwood shrink-0 mt-0.5">●</span>
                  <p className="text-sm text-eden-gray">{problem}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-center mb-10">How TSI Helps</h2>
          </ScrollReveal>
          <div className="space-y-4">
            {[
              'Searchable nonprofit directory (food pantries, counseling, housing, development programs)',
              'Public + private listing options',
              'Volunteer coordination tools',
              'Analytics on usage and impact',
              'Free listings for all nonprofits (always)',
              'Integration with church partner pages so congregations can surface relevant nonprofits',
            ].map((solution, i) => (
              <ScrollReveal key={i} delay={i * 75}>
                <div className="eden-glass p-5 rounded-xl flex gap-3 items-start">
                  <span className="text-eden-tidal shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-eden-orchid">{solution}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center eden-glass p-10 rounded-2xl glow-tidal">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold mb-4">Nonprofit Listings Are Always Free</h2>
            <p className="text-sage mb-6">
              Premium analytics and custom branding available on the Growth tier. But basic listings? Free. Forever. Because visibility shouldn&apos;t be gated by budget.
            </p>
            <Link href="/get-started" className="btn-primary">Get Started Free</Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
