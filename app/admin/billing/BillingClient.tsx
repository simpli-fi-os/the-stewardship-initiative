'use client'

import Link from 'next/link'

interface OrgBilling {
  id: string
  name: string
  tier: string
  subscription_status: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
  billing_email: string | null
  memberCount: number
}

const tierLabels: Record<string, string> = {
  seed: 'Seed (Free)',
  growth: 'Growth ($29/mo)',
  whitelabel: 'White-Label ($199/mo)',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  none: { label: 'No subscription', color: 'text-eden-gray' },
  trialing: { label: 'Free trial', color: 'text-eden-tidal' },
  active: { label: 'Active', color: 'text-eden-tidal' },
  past_due: { label: 'Past due', color: 'text-eden-redwood' },
  canceled: { label: 'Canceled', color: 'text-eden-redwood' },
}

const tierLimits: Record<string, number> = {
  seed: 25,
  growth: Infinity,
  whitelabel: Infinity,
}

export default function BillingClient({ org }: { org: OrgBilling }) {
  const status = statusLabels[org.subscription_status] || statusLabels.none
  const memberLimit = tierLimits[org.tier] || 25
  const usagePercent = memberLimit === Infinity ? 0 : Math.min(100, (org.memberCount / memberLimit) * 100)

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="eden-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-eden-orchid">Current Plan</h2>
            <p className="text-eden-gray text-sm mt-1">{org.name}</p>
          </div>
          <span className={`skill-pill ${org.tier === 'growth' ? 'bg-eden-marigold text-eden-jungle' : org.tier === 'whitelabel' ? 'bg-eden-hibiscus/20 text-eden-hibiscus' : 'bg-eden-tidal/20 text-eden-tidal'}`}>
            {tierLabels[org.tier] || org.tier}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-eden-jungle/50 rounded-lg p-4">
            <p className="text-xs text-eden-gray uppercase tracking-wide mb-1">Status</p>
            <p className={`font-semibold ${status.color}`}>{status.label}</p>
          </div>

          <div className="bg-eden-jungle/50 rounded-lg p-4">
            <p className="text-xs text-eden-gray uppercase tracking-wide mb-1">Members</p>
            <p className="font-semibold text-eden-orchid">
              {org.memberCount}
              {memberLimit !== Infinity && <span className="text-eden-gray font-normal"> / {memberLimit}</span>}
            </p>
          </div>

          {org.trial_ends_at && (
            <div className="bg-eden-jungle/50 rounded-lg p-4">
              <p className="text-xs text-eden-gray uppercase tracking-wide mb-1">Trial Ends</p>
              <p className="font-semibold text-eden-orchid">
                {new Date(org.trial_ends_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {/* Usage Bar (Seed tier only) */}
        {memberLimit !== Infinity && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-eden-gray mb-1">
              <span>Member usage</span>
              <span>{org.memberCount} / {memberLimit}</span>
            </div>
            <div className="h-2 bg-eden-jungle/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent > 80 ? 'bg-eden-redwood' : 'bg-eden-tidal'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usagePercent > 80 && (
              <p className="text-xs text-eden-redwood mt-2">
                You&apos;re approaching your member limit. Upgrade to Growth for unlimited profiles.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {org.tier === 'seed' && (
          <Link href="/pricing" className="btn-primary text-center">
            Upgrade Plan
          </Link>
        )}

        {org.stripe_customer_id && (
          <form action="/api/billing/portal" method="POST">
            <button type="submit" className="btn-secondary">
              Manage Billing
            </button>
          </form>
        )}
      </div>

      {/* Billing Email */}
      {org.billing_email && (
        <div className="eden-card" style={{ padding: '1rem 1.5rem' }}>
          <p className="text-xs text-eden-gray uppercase tracking-wide mb-1">Billing Email</p>
          <p className="text-eden-orchid text-sm">{org.billing_email}</p>
        </div>
      )}
    </div>
  )
}
