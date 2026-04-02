'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'

type AuthMode = 'magic-link' | 'password'

export default function LoginForm() {
  const [mode, setMode] = useState<AuthMode>('magic-link')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for a magic link to sign in.' })
    }
    setLoading(false)
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      // Redirect to admin on successful login
      window.location.href = '/admin'
    }
    setLoading(false)
  }

  return (
    <div className="eden-card p-8">
      {/* Mode Toggle */}
      <div className="flex rounded-lg bg-eden-jungle/50 p-1 mb-6">
        <button
          type="button"
          onClick={() => setMode('magic-link')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
            mode === 'magic-link'
              ? 'bg-eden-marigold text-eden-jungle'
              : 'text-eden-gray hover:text-eden-orchid'
          }`}
        >
          Magic Link
        </button>
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition ${
            mode === 'password'
              ? 'bg-eden-marigold text-eden-jungle'
              : 'text-eden-gray hover:text-eden-orchid'
          }`}
        >
          Password
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-md text-sm mb-4 ${
            message.type === 'success'
              ? 'bg-eden-tidal/10 border border-eden-tidal/30 text-eden-tidal'
              : 'bg-eden-redwood/10 border border-eden-redwood/30 text-eden-redwood'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Magic Link Form */}
      {mode === 'magic-link' && (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email-magic" className="block text-sm font-semibold text-eden-gray mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email-magic"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@yourchurch.org"
              className="w-full px-4 py-3 bg-eden-jungle border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder:text-eden-gray/50 focus:outline-none focus:ring-2 focus:ring-eden-marigold/50 focus:border-eden-marigold/50 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
          <p className="text-xs text-eden-gray/70 text-center">
            We&apos;ll email you a secure link to sign in — no password needed.
          </p>
        </form>
      )}

      {/* Password Form */}
      {mode === 'password' && (
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label htmlFor="email-pass" className="block text-sm font-semibold text-eden-gray mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email-pass"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@yourchurch.org"
              className="w-full px-4 py-3 bg-eden-jungle border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder:text-eden-gray/50 focus:outline-none focus:ring-2 focus:ring-eden-marigold/50 focus:border-eden-marigold/50 transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-eden-gray mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-eden-jungle border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder:text-eden-gray/50 focus:outline-none focus:ring-2 focus:ring-eden-marigold/50 focus:border-eden-marigold/50 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      )}
    </div>
  )
}
