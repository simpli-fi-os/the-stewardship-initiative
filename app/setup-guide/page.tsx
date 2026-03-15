import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Setup Guide',
  description: 'Set up the Notion backend for your private church directory in about 5-7 minutes.',
}

const steps = [
  {
    number: '1',
    title: 'Duplicate the Master Template',
    content: (
      <>
        <p className="text-eden-gray mb-6">
          This is the heart of your directory. Click the button below to open our pre-built
          template in a new tab. Once it loads, click the <strong>&ldquo;Duplicate&rdquo;</strong> button
          in the top-right corner of the Notion page to copy it into your own private workspace.
        </p>
        <a
          href="https://simpli-fi.notion.site/21d42ea8d87680cd9bc7c287b5106980?v=21d42ea8d87681ad8bb7000c54a9ad50"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Open Notion Template
        </a>
      </>
    ),
  },
  {
    number: '2',
    title: 'Create an Integration & Get Your API Key',
    content: (
      <>
        <p className="text-eden-gray mb-4">
          Next, you&apos;ll create a private &ldquo;integration&rdquo; to allow our secure web app
          to read your directory data.
        </p>
        <ol className="list-decimal list-inside text-eden-gray space-y-3 mb-6">
          <li>
            Go to{' '}
            <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-eden-marigold underline">
              Notion&apos;s &ldquo;My Integrations&rdquo; page
            </a>.
          </li>
          <li>Click the <strong>&ldquo;+ New integration&rdquo;</strong> button.</li>
          <li>Give it a memorable name, like <code className="bg-eden-jungle px-2 py-1 rounded text-gray-300">TSI Church Directory</code>.</li>
          <li>Select the correct Notion Workspace where you duplicated the template.</li>
          <li>Under &ldquo;Capabilities,&rdquo; ensure <strong>&ldquo;Read content&rdquo;</strong> is selected.</li>
          <li>Click <strong>&ldquo;Submit&rdquo;</strong>.</li>
        </ol>
        <div className="callout">
          <h3 className="font-bold text-eden-orchid mb-2">CRITICAL: Your API Key (Secret Token)</h3>
          <p className="text-eden-gray">
            Notion will show a secret token that starts with <code className="bg-eden-jungle px-2 py-1 rounded text-gray-300">secret_...</code>.
            This is your API Key. <strong>Treat this key like a password.</strong> Click &ldquo;Show&rdquo;
            and then &ldquo;Copy&rdquo;. You will need this key to connect your directory.
          </p>
        </div>
      </>
    ),
  },
  {
    number: '3',
    title: 'Connect Your New Database',
    content: (
      <>
        <p className="text-eden-gray mb-4">
          The final step is to give your new integration permission to access the directory you just duplicated.
        </p>
        <ol className="list-decimal list-inside text-eden-gray space-y-3 mb-6">
          <li>Go back to the duplicated <strong>&ldquo;TSI Master Directory&rdquo;</strong> page in your Notion workspace.</li>
          <li>Click the three-dots menu (<code className="bg-eden-jungle px-2 py-1 rounded text-gray-300">...</code>) in the top-right corner.</li>
          <li>Near the bottom, click <strong>&ldquo;+ Add connections&rdquo;</strong>.</li>
          <li>Find and select the integration you just created.</li>
          <li>Click <strong>&ldquo;Confirm&rdquo;</strong>.</li>
        </ol>
        <div className="callout">
          <h3 className="font-bold text-eden-orchid mb-2">Pro-Tip: Use a Notion Form for Submissions</h3>
          <p className="text-eden-gray">
            Instead of giving every member access to the full database, create a{' '}
            <a href="https://www.notion.so/help/forms" target="_blank" className="text-eden-marigold underline">
              Notion Form
            </a>{' '}
            from your database view. Members can submit their information easily, and it will
            automatically populate your directory.
          </p>
        </div>
      </>
    ),
  },
]

export default function SetupGuidePage() {
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
      <Header />

      <main id="main-content" className="w-full max-w-3xl mx-auto mt-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-eden-orchid mb-4">
            Let&apos;s Connect Your Community
          </h1>
          <p className="text-lg sm:text-xl text-eden-gray max-w-2xl mx-auto">
            Follow these steps to set up the Notion backend for your private directory.
            It should only take about 5-7 minutes.
          </p>
        </div>

        {/* Steps */}
        {steps.map((step) => (
          <div key={step.number} className="eden-card mb-8">
            <div className="flex items-start gap-6">
              <div className="text-eden-marigold font-extrabold text-3xl leading-none flex-shrink-0">
                {step.number}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-eden-orchid mb-4">{step.title}</h2>
                {step.content}
              </div>
            </div>
          </div>
        ))}

        {/* Completion CTA */}
        <div className="text-center my-16 p-8 bg-eden-lush rounded-xl border border-eden-marigold/20">
          <h2 className="text-3xl font-bold text-eden-orchid mb-4">Setup Complete! What&apos;s Next?</h2>
          <p className="text-lg text-eden-gray max-w-3xl mx-auto mb-6">
            Your directory backend is now ready. The next step is to connect it by providing
            your API Key. This will generate a beautiful, private, and searchable directory
            page exclusively for your community.
          </p>
          <Link href="/connect" className="btn-primary">
            Connect Your API Key &amp; Launch Your Directory
          </Link>
        </div>
      </main>

      <Footer backLink="/" backLabel="Back to Home" />
    </div>
  )
}
