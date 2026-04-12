'use client'

import { useState } from 'react'

interface Props {
  headline?: string
  subtext?: string
  className?: string
  compact?: boolean
  placeholder?: string
}

export default function NewsletterSignup({
  headline = 'Community Updates',
  subtext = 'New resources, provider spotlights, and ways to help. No spam.',
  className = '',
  compact = false,
  placeholder = 'Your email address',
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
        return
      }

      setStatus('success')
      setEmail('')
    } catch {
      setErrorMsg('Could not connect. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={className}>
        <p className="text-eden-tidal font-medium text-sm">
          You are in. Watch for community updates in your inbox.
        </p>
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
          placeholder={placeholder}
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
        <p className="text-eden-redwood text-xs mt-1">{errorMsg}</p>
      )}
    </div>
  )
}
