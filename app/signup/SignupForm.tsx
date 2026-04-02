'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'

export default function SignupForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: 'Account created! Check your email to confirm, then sign in.',
      })
    }
    setLoading(false)
  }

  return (
    <div className="eden-card p-8">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full-name" className="block text-sm font-semibold text-eden-gray mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Your full name"
            className="w-full px-4 py-3 bg-eden-jungle border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder:text-eden-gray/50 focus:outline-none focus:ring-2 focus:ring-eden-marigold/50 transition"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-eden-gray mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@yourchurch.org"
            className="w-full px-4 py-3 bg-eden-jungle border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder:text-eden-gray/50 focus:outline-none focus:ring-2 focus:ring-eden-marigold/50 transition"
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
            placeholder="At least 8 characters"
            className="w-full px-4 py-3 bg-eden-jungle border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder:text-eden-gray/50 focus:outline-none focus:ring-2 focus:ring-eden-marigold/50 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-eden-tidal text-white py-3 rounded-lg font-bold hover:bg-eden-tidal/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}
