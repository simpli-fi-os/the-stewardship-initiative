import { Metadata } from 'next'
import SubmitForm from './SubmitForm'

export const metadata: Metadata = {
  title: 'Submit a Resource | TSI Directory',
  description: 'Submit a community resource, service provider, or organization to the Stewardship Initiative Directory',
}

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-eden-lush via-eden-jungle to-eden-lush py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-eden-marigold mb-3">
            Submit a Resource
          </h1>
          <p className="text-eden-gray text-lg">
            Help your community discover your organization or service by adding it to our directory.
          </p>
        </div>

        <SubmitForm />
      </div>
    </main>
  )
}
