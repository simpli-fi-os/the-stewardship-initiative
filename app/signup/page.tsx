import type { Metadata } from 'next'
import SignupForm from './SignupForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join your community on The Stewardship Initiative.',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-eden-jungle flex flex-col">
      {/* Top Banner */}
      <div className="bg-eden-lush text-eden-orchid text-center py-3 px-4 border-b border-eden-marigold/20">
        <a href="/" className="text-sm font-semibold tracking-wider hover:text-eden-marigold transition">
          The Stewardship Initiative
        </a>
      </div>

      {/* Signup Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-eden-tidal/10 border border-eden-tidal/30 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="19" y1="8" x2="19" y2="14" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="22" y1="11" x2="16" y2="11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-eden-orchid">Join Your Community</h1>
            <p className="mt-2 text-eden-gray text-sm">
              Create an account to manage your directory profile and connect with others.
            </p>
          </div>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-eden-gray">
            Already have an account?{' '}
            <a href="/login" className="text-eden-marigold hover:text-eden-marigold/80 font-semibold transition">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
