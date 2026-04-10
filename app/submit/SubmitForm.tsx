'use client'

import { useState, useEffect } from 'react'
import { ListingSubmission, SubmissionProgress, CATEGORY_TAXONOMY, COMMON_TAGS } from '@/lib/types/submission'

const STEPS = [
  { id: 1, label: 'Type', description: 'Choose organization type' },
  { id: 2, label: 'Basic Info', description: 'Name, category, description' },
  { id: 3, label: 'Location', description: 'Address and service area' },
  { id: 4, label: 'Contact', description: 'Phone, email, website' },
  { id: 5, label: 'Details', description: 'Tags and additional info' },
  { id: 6, label: 'Review', description: 'Confirm and submit' },
]

interface FormErrors {
  [key: string]: string
}

export default function SubmitForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ListingSubmission>>({})
  const [progress, setProgress] = useState<SubmissionProgress>({
    currentStep: 1,
    completedSteps: [],
    data: {},
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tsi_submission_progress')
    if (saved) {
      const parsed = JSON.parse(saved)
      setProgress(parsed)
      setCurrentStep(parsed.currentStep)
      setFormData(parsed.data)
      if (parsed.data.tags) {
        setSelectedTags(parsed.data.tags)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const newProgress = {
      currentStep,
      completedSteps: progress.completedSteps,
      data: { ...formData, tags: selectedTags },
    }
    setProgress(newProgress)
    localStorage.setItem('tsi_submission_progress', JSON.stringify(newProgress))
  }, [currentStep, formData, selectedTags])

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.type) {
        newErrors.type = 'Please select an organization type'
      }
    } else if (step === 2) {
      if (!formData.name || formData.name.trim() === '') {
        newErrors.name = 'Organization name is required'
      }
      if (!formData.category) {
        newErrors.category = 'Category is required'
      }
      if (!formData.description || formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters'
      }
      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description must be under 500 characters'
      }
    } else if (step === 3) {
      if (!formData.address || formData.address.trim() === '') {
        newErrors.address = 'Address is required'
      }
      if (!formData.city || formData.city.trim() === '') {
        newErrors.city = 'City is required'
      }
      if (!formData.state || formData.state.trim() === '') {
        newErrors.state = 'State is required'
      }
      if (!formData.county || formData.county.trim() === '') {
        newErrors.county = 'County is required'
      }
    } else if (step === 4) {
      if (!formData.phone && !formData.email && !formData.website) {
        newErrors.contact = 'At least one contact method is required'
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
      if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number'
      }
      if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
        newErrors.website = 'Please enter a valid URL starting with http'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!progress.completedSteps.includes(currentStep)) {
        setProgress((prev) => ({
          ...prev,
          completedSteps: [...prev.completedSteps, currentStep],
        }))
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1))
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async () => {
    if (!validateStep(6)) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const submitData = {
        type: formData.type,
        subtype: formData.category,
        name: formData.name,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        county: formData.county,
        address: formData.address,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        description: formData.description,
        tags: selectedTags,
        metadata: formData.additionalData || {},
      }

      const response = await fetch('/api/submit-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit listing')
      }

      const result = await response.json()
      setSubmitStatus('success')
      setSubmitMessage(
        'Your listing has been submitted successfully and is pending review. We will notify you once it has been published.'
      )
      localStorage.removeItem('tsi_submission_progress')
      setFormData({})
      setCurrentStep(1)
      setSelectedTags([])
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(
        error instanceof Error ? error.message : 'An error occurred while submitting your listing'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryOptions =
    formData.type && CATEGORY_TAXONOMY[formData.type as keyof typeof CATEGORY_TAXONOMY]
      ? CATEGORY_TAXONOMY[formData.type as keyof typeof CATEGORY_TAXONOMY].categories
      : []

  const isStepComplete = (step: number) => progress.completedSteps.includes(step)

  return (
    <div className="max-w-2xl mx-auto">
      {submitStatus === 'success' && (
        <div className="mb-8 p-4 bg-eden-tidal/10 border border-eden-tidal rounded-lg">
          <h3 className="font-semibold text-eden-tidal mb-2">Submission Successful</h3>
          <p className="text-eden-gray">{submitMessage}</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-8 p-4 bg-eden-redwood/10 border border-eden-redwood rounded-lg">
          <h3 className="font-semibold text-eden-redwood mb-2">Submission Failed</h3>
          <p className="text-eden-gray">{submitMessage}</p>
        </div>
      )}

      {submitStatus !== 'success' && (
        <>
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1"
                  onClick={() => {
                    if (isStepComplete(step.id) || step.id === 1) {
                      setCurrentStep(step.id)
                    }
                  }}
                >
                  <button
                    disabled={!isStepComplete(step.id) && step.id !== 1 && step.id !== currentStep}
                    className={`w-10 h-10 rounded-full font-semibold text-sm mb-2 transition ${
                      step.id === currentStep
                        ? 'bg-eden-marigold text-white'
                        : isStepComplete(step.id)
                          ? 'bg-eden-tidal text-white cursor-pointer'
                          : 'bg-eden-jungle text-eden-gray cursor-not-allowed'
                    }`}
                  >
                    {step.id}
                  </button>
                  <span className="text-xs font-medium text-center">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-eden-jungle rounded-full overflow-hidden">
              <div
                className="h-full bg-eden-tidal transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-eden-jungle rounded-lg p-8 mb-8 min-h-96">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-eden-marigold mb-2">
                  {STEPS[0].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[0].description}</p>

                <div className="space-y-3">
                  {['resource', 'provider', 'church', 'nonprofit', 'maker'].map((type) => (
                    <label
                      key={type}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                        formData.type === type
                          ? 'border-eden-marigold bg-eden-marigold/10'
                          : 'border-eden-jungle hover:border-eden-orchid'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={formData.type === type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-medium text-eden-orchid capitalize">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.type && <p className="text-eden-redwood text-sm mt-3">{errors.type}</p>}
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-eden-marigold mb-2">
                  {STEPS[1].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[1].description}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                      placeholder="e.g., Community Food Bank"
                    />
                    {errors.name && (
                      <p className="text-eden-redwood text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid focus:outline-none focus:border-eden-marigold"
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-eden-redwood text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Description (20-500 characters)
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold min-h-24 resize-none"
                      placeholder="Tell us about your organization and what you do..."
                    />
                    <p className="text-xs text-eden-gray mt-1">
                      {(formData.description || '').length}/500 characters
                    </p>
                    {errors.description && (
                      <p className="text-eden-redwood text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-eden-marigold mb-2">
                  {STEPS[2].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[2].description}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                      placeholder="Street address"
                    />
                    {errors.address && (
                      <p className="text-eden-redwood text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-eden-orchid mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-eden-redwood text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-eden-orchid mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                        maxLength={2}
                        className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                        placeholder="TX"
                      />
                      {errors.state && (
                        <p className="text-eden-redwood text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-eden-orchid mb-2">
                        ZIP Code (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.zip || ''}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                        className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                        placeholder="75201"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-eden-orchid mb-2">
                        County
                      </label>
                      <input
                        type="text"
                        value={formData.county || ''}
                        onChange={(e) => handleInputChange('county', e.target.value)}
                        className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                        placeholder="Dallas"
                      />
                      {errors.county && (
                        <p className="text-eden-redwood text-sm mt-1">{errors.county}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-eden-marigold mb-2">
                  {STEPS[3].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[3].description}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-eden-redwood text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                      placeholder="info@organization.com"
                    />
                    {errors.email && (
                      <p className="text-eden-redwood text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Website (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
                      placeholder="https://www.organization.com"
                    />
                    {errors.website && (
                      <p className="text-eden-redwood text-sm mt-1">{errors.website}</p>
                    )}
                  </div>

                  {errors.contact && (
                    <p className="text-eden-redwood text-sm">{errors.contact}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-eden-marigold mb-2">
                  {STEPS[4].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[4].description}</p>

                <div>
                  <label className="block text-sm font-medium text-eden-orchid mb-4">
                    Select relevant tags (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          selectedTags.includes(tag)
                            ? 'bg-eden-marigold text-white'
                            : 'bg-eden-jungle border border-eden-marigold/20 text-eden-gray hover:border-eden-marigold'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <h2 className="text-2xl font-bold text-eden-marigold mb-2">
                  {STEPS[5].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[5].description}</p>

                <div className="space-y-4 bg-eden-lush rounded-lg p-6 mb-6">
                  <div>
                    <p className="text-xs text-eden-gray uppercase font-semibold mb-1">Type</p>
                    <p className="text-eden-orchid font-medium capitalize">{formData.type}</p>
                  </div>

                  <div>
                    <p className="text-xs text-eden-gray uppercase font-semibold mb-1">
                      Organization Name
                    </p>
                    <p className="text-eden-orchid font-medium">{formData.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-eden-gray uppercase font-semibold mb-1">
                      Description
                    </p>
                    <p className="text-eden-gray text-sm">{formData.description}</p>
                  </div>

                  <div>
                    <p className="text-xs text-eden-gray uppercase font-semibold mb-1">
                      Location
                    </p>
                    <p className="text-eden-gray text-sm">
                      {formData.address}, {formData.city}, {formData.state} {formData.zip}
                    </p>
                  </div>

                  {(formData.phone || formData.email || formData.website) && (
                    <div>
                      <p className="text-xs text-eden-gray uppercase font-semibold mb-2">
                        Contact
                      </p>
                      <div className="space-y-1">
                        {formData.phone && (
                          <p className="text-eden-gray text-sm">{formData.phone}</p>
                        )}
                        {formData.email && (
                          <p className="text-eden-gray text-sm">{formData.email}</p>
                        )}
                        {formData.website && (
                          <p className="text-eden-gray text-sm">{formData.website}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedTags.length > 0 && (
                    <div>
                      <p className="text-xs text-eden-gray uppercase font-semibold mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-eden-marigold/10 border border-eden-marigold/20 text-eden-marigold text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-3 p-4 bg-eden-lush rounded-lg border border-eden-marigold/20 mb-6">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted || false}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-eden-gray">
                    I confirm that the information provided is accurate and authorize TSI to
                    publish this listing in the directory.
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-eden-redwood text-sm mb-4">{errors.termsAccepted}</p>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                currentStep === 1
                  ? 'bg-eden-jungle text-eden-gray cursor-not-allowed'
                  : 'bg-eden-jungle text-eden-marigold hover:bg-eden-jungle/80'
              }`}
            >
              Previous
            </button>

            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-eden-marigold text-white rounded-lg font-medium hover:bg-eden-marigold/90 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.termsAccepted || isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  !formData.termsAccepted || isSubmitting
                    ? 'bg-eden-jungle text-eden-gray cursor-not-allowed'
                    : 'bg-eden-tidal text-white hover:bg-eden-tidal/90'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Listing'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
