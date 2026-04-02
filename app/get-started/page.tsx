import { Metadata } from 'next'
import Header from '@/components/Header'
import OnboardingWizard from './OnboardingWizard'

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Set up your church community directory in minutes. Free to start, no credit card required.',
}

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-eden-jungle flex flex-col">
      <div className="px-6 pt-10">
        <Header />
      </div>

      <main id="main-content" className="flex-1 w-full max-w-2xl mx-auto px-6 py-16">
        <OnboardingWizard />
      </main>
    </div>
  )
}
