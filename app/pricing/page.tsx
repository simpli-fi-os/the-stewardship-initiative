import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PricingToggle from './PricingToggle'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for church community directories. Start free, upgrade as your community grows.',
  openGraph: {
    title: 'Pricing | The Stewardship Initiative',
    description: 'Simple, transparent pricing for church community directories.',
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-eden-jungle flex flex-col">
      <div className="px-6 pt-10">
        <Header />
      </div>

      <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-eden-orchid mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-eden-gray text-lg max-w-2xl mx-auto">
            Start free. Upgrade as your community grows. No hidden fees, no surprises.
          </p>
        </div>

        <PricingToggle />

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-eden-orchid text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FaqItem
              question="Can I try it before paying?"
              answer="Absolutely. The Seed tier is free forever with up to 25 member profiles. When you're ready for more, the Growth tier includes a 30-day free trial."
            />
            <FaqItem
              question="What happens if I cancel?"
              answer="Your directory stays live on the Seed tier (up to 25 profiles). You keep all your data. No profiles are deleted."
            />
            <FaqItem
              question="Can I switch plans at any time?"
              answer="Yes. Upgrade, downgrade, or cancel at any time from your admin dashboard. Changes take effect immediately."
            />
            <FaqItem
              question="Do you offer discounts for small churches?"
              answer="The Seed tier is free for churches under 25 members. We also offer annual billing that saves you two months per year."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards through Stripe. All billing is handled securely through Stripe's platform."
            />
          </div>
        </div>
      </main>

      <div className="px-6 pb-10">
        <Footer />
      </div>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="eden-card group" style={{ padding: '1rem 1.5rem' }}>
      <summary className="flex items-center justify-between cursor-pointer list-none text-eden-orchid font-medium">
        {question}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-eden-gray group-open:rotate-180 transition-transform shrink-0 ml-4"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <p className="text-eden-gray text-sm mt-3 leading-relaxed">{answer}</p>
    </details>
  )
}
