'use client'

import { useState, FormEvent } from 'react'

export default function ConnectForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const apiKey = formData.get('notion_api_key') as string
    const databaseId = formData.get('database_id') as string

    if (!apiKey.startsWith('secret_')) {
      setError('API Key must start with "secret_". Please check your Notion integration token.')
      setLoading(false)
      return
    }

    if (databaseId.length < 20) {
      setError('Database ID looks too short. Please double-check the ID from your Notion URL.')
      setLoading(false)
      return
    }

    try {
      // TODO: POST to /api/connect endpoint
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch {
      setError('Something went wrong connecting your directory. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center p-8 bg-eden-lush rounded-xl border border-eden-tidal/30" role="alert">
        <div className="text-4xl mb-4">🌱</div>
        <h2 className="text-2xl font-bold text-eden-orchid mb-2">Directory Connected!</h2>
        <p className="text-eden-gray mb-6">
          Your community directory is being generated. You&apos;ll receive an email
          with your unique directory link shortly.
        </p>
        <a href="/" className="btn-primary">
          Return Home
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* API Key */}
      <div>
        <label htmlFor="notion_api_key" className="block text-lg font-semibold text-eden-orchid mb-2">
          Notion API Key
        </label>
        <p className="text-sm text-eden-gray mb-3" id="api-key-desc">
          This is the &ldquo;Internal Integration Token&rdquo; you copied in Step 2.
          It starts with <code className="bg-eden-jungle px-2 py-1 rounded text-gray-300">secret_</code>.
        </p>
        <input
          type="password"
          id="notion_api_key"
          name="notion_api_key"
          className="form-input"
          placeholder="secret_..."
          required
          aria-describedby="api-key-desc"
          autoComplete="off"
        />
      </div>

      {/* Database ID */}
      <div>
        <label htmlFor="database_id" className="block text-lg font-semibold text-eden-orchid mb-2">
          Notion Database ID
        </label>
        <div className="callout mb-4">
          <h4 className="font-bold text-eden-marigold" id="db-id-desc">How to find your Database ID:</h4>
          <p className="text-sm text-eden-gray mt-2">
            Go to your duplicated Notion template page. Look at the URL in your browser&apos;s
            address bar. The Database ID is the long string of letters and numbers after your
            workspace name and before the question mark (?).
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Example: <code className="text-eden-gray">https://www.notion.so/your-workspace/</code>
            <strong className="text-eden-marigold">21d42ea8d87680cd9bc7c287b5106980</strong>
            <code className="text-eden-gray">?v=...</code>
          </p>
        </div>
        <input
          type="text"
          id="database_id"
          name="database_id"
          className="form-input"
          placeholder="Paste your Database ID here"
          required
          aria-describedby="db-id-desc"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-eden-redwood/20 border border-eden-redwood/40 rounded-lg" role="alert">
          <p className="text-sm text-eden-orchid">{error}</p>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-start gap-3 p-4 bg-eden-lush rounded-lg border border-gray-700/50">
        <svg className="h-6 w-6 text-eden-marigold mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <h4 className="font-bold text-eden-orchid">Your Security is Our Priority</h4>
          <p className="text-sm text-eden-gray mt-1">
            Your API key is encrypted at rest and only used for secure, read-only access
            to your directory. It is never exposed to browsers or third parties.
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Connecting...' : 'Generate My Directory'}
        </button>
      </div>
    </form>
  )
}
