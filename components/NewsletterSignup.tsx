'use client'

import { useState } from 'react'

interface Props {
  headline?: string
  subtext?: string
  className?: string
  compact?: boolean
}

export default function NewsletterSignup({
  headline = 'Church Leadership Insights Weekly',
  subtext = 'No spam. Unsubscribe anytime.',
  className = '',
  compact = false,
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      // TODO: Wire to MailerLite when API key configured
      console.log('[Newsletter] Subscribe:', email)
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={className}>
        <p className="text-eden-tidal font-medium text-sm">You&apos;re in. Watch for insights in your inbox.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {!compact && (
        <>
          <p className="text-eden-orchid font-display font-bold text-sm mb-1">{headline}</p>
          {subtext && <p className="text-eden-gray text-xs mb-3">{subtext}</p>}
        </>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your church email"
          required
          className="form-input flex-1 text-sm"
          style={{ padding: '0.5rem 0.75rem' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary text-sm shrink-0 disabled:opacity-50"
          style={{ padding: '0.5rem 1rem' }}
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-eden-redwood text-xs mt-1">Something went wrong. Try again.</p>
      )}
    </div>
  )
}
