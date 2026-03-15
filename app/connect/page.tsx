import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConnectForm from './ConnectForm'

export const metadata: Metadata = {
  title: 'Connect Your Directory',
  description: 'Connect your Notion database to generate your private, searchable community directory.',
}

export default function ConnectPage() {
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
      <Header />

      <main id="main-content" className="w-full max-w-xl mx-auto mt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-eden-orchid mb-4">The Final Step</h1>
          <p className="text-lg sm:text-xl text-eden-gray">
            Connect your directory to generate your private, beautiful, and searchable community page.
          </p>
        </div>

        <ConnectForm />
      </main>

      <Footer backLink="/setup-guide" backLabel="Back to Setup Guide" />
    </div>
  )
}
