'use client'

import { useState } from 'react'
import Link from 'next/link'

const STEPS = ['Church Info', 'Admin Account', 'Customize', 'Invite Members']

const SIZE_OPTIONS = [
  { label: 'Under 100', value: '<100' },
  { label: '100 - 250', value: '100-250' },
  { label: '250 - 500', value: '250-500' },
  { label: '500 - 1,000', value: '500-1000' },
  { label: '1,000+', value: '1000+' },
]

const DEFAULT_SKILLS = [
  'Accounting & Finance',
  'Counseling',
  'Education & Tutoring',
  'Home Repair',
  'IT & Technology',
  'Legal',
  'Medical & Health',
  'Music & Arts',
  'Transportation',
]

export default function OnboardingWizard() {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)

  // Step 1: Church Info
  const [churchName, setChurchName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [congregationSize, setCongregationSize] = useState('')

  // Step 2: Admin Account
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  // Step 3: Customize
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set(DEFAULT_SKILLS))
  const [customSkill, setCustomSkill] = useState('')

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      const next = new Set(prev)
      next.has(skill) ? next.delete(skill) : next.add(skill)
      return next
    })
  }

  const addCustomSkill = () => {
    const trimmed = customSkill.trim()
    if (trimmed && !selectedSkills.has(trimmed)) {
      setSelectedSkills(prev => new Set(prev).add(trimmed))
      setCustomSkill('')
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0: return churchName.trim().length > 0
      case 1: return adminName.trim().length > 0 && adminEmail.trim().length > 0 && adminPassword.length >= 6
      case 2: return selectedSkills.size > 0
      default: return true
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          churchName,
          websiteUrl: websiteUrl || undefined,
          city: city || undefined,
          state: state || undefined,
          congregationSize: congregationSize || undefined,
          adminName,
          adminEmail,
          adminPassword,
          skills: Array.from(selectedSkills),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create directory')
      }

      setCreatedSlug(data.slug)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    if (step === 2) {
      handleSubmit()
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              i < step ? 'bg-eden-tidal text-white' :
              i === step ? 'bg-eden-marigold text-eden-jungle' :
              'bg-eden-lush text-eden-gray border border-eden-tidal/20'
            }`}>
              {i < step ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`hidden sm:block w-12 md:w-20 h-0.5 mx-2 ${
                i < step ? 'bg-eden-tidal' : 'bg-eden-lush'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-2">
        <p className="text-xs text-eden-gray uppercase tracking-wide">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      {error && (
        <div className="bg-eden-redwood/10 border border-eden-redwood/30 text-eden-redwood px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {/* Step 1: Church Info */}
      {step === 0 && (
        <div className="eden-card space-y-6">
          <div className="text-center mb-4">
            <h1 className="font-display text-2xl font-bold text-eden-orchid">Tell us about your church</h1>
            <p className="text-eden-gray text-sm mt-1">This helps us set up your directory page.</p>
          </div>

          <div>
            <label htmlFor="churchName" className="block text-sm font-medium text-eden-orchid mb-2">
              Church Name <span className="text-eden-redwood">*</span>
            </label>
            <input
              id="churchName"
              type="text"
              value={churchName}
              onChange={(e) => setChurchName(e.target.value)}
              className="form-input"
              placeholder="e.g., Grace Community Church"
            />
          </div>

          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-eden-orchid mb-2">
              Website URL
            </label>
            <input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="form-input"
              placeholder="https://yourchurch.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-eden-orchid mb-2">City</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-eden-orchid mb-2">State</label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="form-input"
                placeholder="TX"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-eden-orchid mb-2">
              Congregation Size
            </label>
            <select
              id="size"
              value={congregationSize}
              onChange={(e) => setCongregationSize(e.target.value)}
              className="form-input"
            >
              <option value="">Select...</option>
              {SIZE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Admin Account */}
      {step === 1 && (
        <div className="eden-card space-y-6">
          <div className="text-center mb-4">
            <h1 className="font-display text-2xl font-bold text-eden-orchid">Create your admin account</h1>
            <p className="text-eden-gray text-sm mt-1">You&apos;ll use this to manage your directory.</p>
          </div>

          <div>
            <label htmlFor="adminName" className="block text-sm font-medium text-eden-orchid mb-2">
              Full Name <span className="text-eden-redwood">*</span>
            </label>
            <input
              id="adminName"
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-eden-orchid mb-2">
              Email <span className="text-eden-redwood">*</span>
            </label>
            <input
              id="adminEmail"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-eden-orchid mb-2">
              Password <span className="text-eden-redwood">*</span>
            </label>
            <input
              id="adminPassword"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="form-input"
              minLength={6}
            />
            <p className="text-xs text-eden-gray mt-1">Minimum 6 characters</p>
          </div>
        </div>
      )}

      {/* Step 3: Customize */}
      {step === 2 && (
        <div className="eden-card space-y-6">
          <div className="text-center mb-4">
            <h1 className="font-display text-2xl font-bold text-eden-orchid">Customize your directory</h1>
            <p className="text-eden-gray text-sm mt-1">Select the skill categories for your congregation.</p>
          </div>

          <div>
            <p className="text-sm font-medium text-eden-orchid mb-3">Skill Categories</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...DEFAULT_SKILLS, ...Array.from(selectedSkills)])).map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full border transition ${
                    selectedSkills.has(skill)
                      ? 'bg-eden-tidal text-white border-transparent'
                      : 'bg-eden-jungle text-eden-gray border-eden-tidal/20 hover:border-eden-tidal/50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
              className="form-input flex-1"
              placeholder="Add a custom category..."
            />
            <button
              type="button"
              onClick={addCustomSkill}
              className="btn-secondary text-sm"
              style={{ padding: '0.5rem 1rem' }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Invite Members (Success) */}
      {step === 3 && createdSlug && (
        <div className="eden-card text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-eden-tidal/20 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-eden-tidal">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-eden-orchid">Your directory is live!</h1>
            <p className="text-eden-gray text-sm mt-2">
              Share this link with your congregation so they can add their profiles.
            </p>
          </div>

          <div className="bg-eden-jungle/50 rounded-lg p-4">
            <p className="text-xs text-eden-gray uppercase tracking-wide mb-2">Share Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-eden-marigold text-sm break-all">
                thestewardshipinitiative.org/directory/{createdSlug}/join
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://thestewardshipinitiative.org/directory/${createdSlug}/join`)
                }}
                className="btn-secondary text-xs shrink-0"
                style={{ padding: '0.375rem 0.75rem' }}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/directory/${createdSlug}`}
              className="btn-secondary text-center text-sm"
            >
              View Directory
            </Link>
            <Link href="/admin" className="btn-primary text-center text-sm">
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="text-eden-gray hover:text-eden-orchid transition text-sm"
            >
              &larr; Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={next}
            disabled={!canProceed() || submitting}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: '0.625rem 2rem' }}
          >
            {step === 2
              ? submitting ? 'Creating...' : 'Create Directory'
              : 'Continue'}
          </button>
        </div>
      )}
    </div>
  )
}
