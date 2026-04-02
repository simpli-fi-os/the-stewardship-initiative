import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Stewardship Initiative community.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-eden-jungle flex flex-col">
      {/* Top Banner */}
      <div className="bg-eden-lush text-eden-orchid text-center py-3 px-4 border-b border-eden-marigold/20">
        <a href="/" className="text-sm font-semibold tracking-wider hover:text-eden-marigold transition">
          The Stewardship Initiative
        </a>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-eden-marigold/10 border border-eden-marigold/30 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-marigold">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-eden-orchid">Welcome Back</h1>
            <p className="mt-2 text-eden-gray text-sm">
              Sign in to manage your community directory
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-eden-gray">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-eden-marigold hover:text-eden-marigold/80 font-semibold transition">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
