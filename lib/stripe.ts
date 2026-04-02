import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    _stripe = new Stripe(key, { apiVersion: '2024-06-20' })
  }
  return _stripe
}

// Tier → Stripe Price ID mapping
// Replace with real price IDs from Stripe Dashboard
export const PRICE_IDS = {
  growth_monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID || '',
  growth_annual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID || '',
  whitelabel_monthly: process.env.STRIPE_WHITELABEL_MONTHLY_PRICE_ID || '',
  whitelabel_annual: process.env.STRIPE_WHITELABEL_ANNUAL_PRICE_ID || '',
} as const

export async function createCheckoutSession(
  orgId: string,
  orgName: string,
  billingEmail: string,
  priceId: string,
  returnUrl: string
): Promise<string> {
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: billingEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 30,
      metadata: { org_id: orgId },
    },
    metadata: { org_id: orgId, org_name: orgName },
    success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: returnUrl,
    allow_promotion_codes: true,
  })

  return session.url || returnUrl
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const stripe = getStripe()

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session.url
}

export type SubscriptionStatus = 'none' | 'trialing' | 'active' | 'past_due' | 'canceled'

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'trialing': return 'trialing'
    case 'active': return 'active'
    case 'past_due': return 'past_due'
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return 'canceled'
    default:
      return 'none'
  }
}

function tierFromPriceId(priceId: string): 'seed' | 'growth' | 'whitelabel' {
  if (priceId === PRICE_IDS.whitelabel_monthly || priceId === PRICE_IDS.whitelabel_annual) {
    return 'whitelabel'
  }
  if (priceId === PRICE_IDS.growth_monthly || priceId === PRICE_IDS.growth_annual) {
    return 'growth'
  }
  return 'seed'
}

export async function handleWebhookEvent(event: Stripe.Event) {
  const { createServerClient } = await import('@/lib/supabase')
  const supabase = createServerClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const orgId = session.metadata?.org_id
      if (!orgId) break

      const subscriptionId = session.subscription as string
      const customerId = session.customer as string

      // Get subscription details for tier mapping
      const stripe = getStripe()
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id || ''
      const tier = tierFromPriceId(priceId)

      await supabase
        .from('organizations')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: mapStripeStatus(subscription.status),
          tier,
          billing_email: session.customer_email,
          trial_ends_at: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
        })
        .eq('id', orgId)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const orgId = subscription.metadata?.org_id
      if (!orgId) break

      const priceId = subscription.items.data[0]?.price.id || ''
      const tier = tierFromPriceId(priceId)

      await supabase
        .from('organizations')
        .update({
          subscription_status: mapStripeStatus(subscription.status),
          tier,
          trial_ends_at: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
        })
        .eq('id', orgId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const orgId = subscription.metadata?.org_id
      if (!orgId) break

      await supabase
        .from('organizations')
        .update({
          subscription_status: 'canceled',
          tier: 'seed',
          stripe_subscription_id: null,
        })
        .eq('id', orgId)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription as string
      if (!subscriptionId) break

      await supabase
        .from('organizations')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_subscription_id', subscriptionId)
      break
    }
  }
}
