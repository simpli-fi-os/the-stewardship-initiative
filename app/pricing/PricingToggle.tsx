'use client'

import { useState } from 'react'
import Link from 'next/link'

const tiers = [
  {
    name: 'Seed',
    badge: 'Free',
    badgeColor: 'bg-eden-tidal/20 text-eden-tidal',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for small churches getting started.',
    features: [
      'Up to 25 member profiles',
      'Basic search and filter',
      'Public directory page',
      'TSI branding on directory',
      'Community support',
    ],
    cta: 'Get Started',
    ctaHref: '/onboard',
    highlight: false,
  },
  {
    name: 'Growth',
    badge: 'Most Popular',
    badgeColor: 'bg-eden-marigold text-eden-jungle',
    monthlyPrice: 29,
    annualPrice: 290,
    description: 'For growing congregations ready to connect.',
    features: [
      'Unlimited member profiles',
      'Custom skill categories',
      'Church branding (logo, hero, colors)',
      'Analytics dashboard',
      'SEO-optimized public listing',
      'Priority email support',
      '30-day free trial',
    ],
    cta: 'Start Free Trial',
    ctaHref: '/get-started',
    highlight: true,
  },
  {
    name: 'White-Label',
    badge: 'Enterprise',
    badgeColor: 'bg-eden-hibiscus/20 text-eden-hibiscus',
    monthlyPrice: 199,
    annualPrice: 1990,
    description: 'Full control for large churches.',
    features: [
      'Everything in Growth',
      'Custom subdomain',
      'Full brand removal',
      'API access',
      'Dedicated onboarding call',
      'Monthly analytics report',
    ],
    cta: 'Contact Us',
    ctaHref: 'mailto:hunter.lott@simpli-fi-alpha.com?subject=TSI%20White-Label%20Inquiry',
    highlight: false,
  },
]

export default function PricingToggle() {
  const [annual, setAnnual] = useState(false)

  return (
    <>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm ${!annual ? 'text-eden-orchid font-semibold' : 'text-eden-gray'}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-14 h-7 rounded-full transition ${
            annual ? 'bg-eden-tidal' : 'bg-eden-gray/30'
          }`}
          aria-label="Toggle annual billing"
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
              annual ? 'translate-x-7' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`text-sm ${annual ? 'text-eden-orchid font-semibold' : 'text-eden-gray'}`}>
          Annual
        </span>
        {annual && (
          <span className="text-xs text-eden-tidal font-semibold">Save 2 months</span>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`eden-card flex flex-col ${
              tier.highlight
                ? 'border-eden-marigold/60 shadow-lg shadow-eden-marigold/10'
                : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`skill-pill ${tier.badgeColor}`}>
                {tier.badge}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-eden-orchid">
              {tier.name}
            </h3>
            <p className="text-eden-gray text-sm mt-1 mb-6">
              {tier.description}
            </p>

            <div className="mb-6">
              {tier.monthlyPrice === 0 ? (
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-eden-orchid">Free</span>
                  <span className="text-eden-gray text-sm">forever</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-eden-orchid">
                    ${annual ? Math.round(tier.annualPrice / 12) : tier.monthlyPrice}
                  </span>
                  <span className="text-eden-gray text-sm">/month</span>
                  {annual && (
                    <span className="text-xs text-eden-tidal ml-2">
                      (${tier.annualPrice}/yr)
                    </span>
                  )}
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-eden-tidal shrink-0 mt-0.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-eden-gray">{feature}</span>
                </li>
              ))}
            </ul>

            {tier.ctaHref.startsWith('mailto:') ? (
              <a href={tier.ctaHref} className={tier.highlight ? 'btn-primary text-center' : 'btn-secondary text-center'}>
                {tier.cta}
              </a>
            ) : (
              <Link href={tier.ctaHref} className={tier.highlight ? 'btn-primary text-center' : 'btn-secondary text-center'}>
                {tier.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
