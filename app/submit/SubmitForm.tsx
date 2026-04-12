'use client'

import { useState, useEffect } from 'react'
import { DIRECTORY_CATEGORIES } from '@/lib/data/categories'

const STEPS = [
  { id: 1, label: 'Basics', description: 'Name & description' },
  { id: 2, label: 'Location', description: 'Where you are' },
  { id: 3, label: 'Contact', description: 'How to reach you' },
  { id: 4, label: 'Categories', description: 'What you offer' },
  { id: 5, label: 'Review', description: 'Confirm details' },
]

interface FormErrors {
  [key: string]: string
}

interface ResourceSubmission {
  name: string
  slug?: string
  type: string
  description: string
  short_description: string
  address?: string
  city: string
  state: string
  zip?: string
  county?: string
  phone?: string
  email?: string
  website?: string
  hours?: Record<string, string>
  tags?: string[]
  category_ids?: number[]
  termsAccepted: boolean
}

export default function SubmitForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ResourceSubmission>>({
    state: 'TX',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [customTags, setCustomTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tsi_resource_submission')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFormData(parsed.formData || {})
        setSelectedCategories(parsed.selectedCategories || [])
        setCustomTags(parsed.customTags || [])
        setCompletedSteps(parsed.completedSteps || [])
        setCurrentStep(parsed.currentStep || 1)
      } catch (e) {
        console.warn('Failed to load saved progress')
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const toSave = {
      currentStep,
      completedSteps,
      formData,
      selectedCategories,
      customTags,
    }
    localStorage.setItem('tsi_resource_submission', JSON.stringify(toSave))
  }, [currentStep, completedSteps, formData, selectedCategories, customTags])

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.type) {
        newErrors.type = 'Please select a resource type'
      }
      if (!formData.name || formData.name.trim() === '') {
        newErrors.name = 'Resource name is required'
      }
      if (!formData.short_description || formData.short_description.trim() === '') {
        newErrors.short_description = 'Short description is required'
      }
      if (!formData.description || formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters'
      }
      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description must be under 500 characters'
      }
      if (!formData.short_description || formData.short_description.length > 150) {
        newErrors.short_description = 'Short description must be under 150 characters'
      }
    } else if (step === 2) {
      if (!formData.city || formData.city.trim() === '') {
        newErrors.city = 'City is required'
      }
      if (!formData.county || formData.county.trim() === '') {
        newErrors.county = 'County is required'
      }
    } else if (step === 3) {
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
    } else if (step === 4) {
      if (selectedCategories.length === 0) {
        newErrors.categories = 'Please select at least one category'
      }
    } else if (step === 5) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms to submit'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
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

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !customTags.includes(trimmed)) {
      setCustomTags([...customTags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setCustomTags(customTags.filter((t) => t !== tag))
  }

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const submitData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        short_description: formData.short_description,
        address: formData.address || null,
        city: formData.city,
        state: formData.state || 'TX',
        zip: formData.zip || null,
        county: formData.county || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        hours: formData.hours || null,
        tags: customTags.length > 0 ? customTags : null,
        category_ids: selectedCategories,
      }

      const response = await fetch('/api/submit-resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit resource')
      }

      const result = await response.json()
      setSubmitStatus('success')
      setSubmitMessage(
        'Your resource has been submitted successfully and is pending review. Our team will verify and publish it within 48 hours.'
      )
      localStorage.removeItem('tsi_resource_submission')
      setFormData({ state: 'TX' })
      setCurrentStep(1)
      setSelectedCategories([])
      setCustomTags([])
      setCompletedSteps([])
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(
        error instanceof Error ? error.message : 'An error occurred while submitting your resource'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepComplete = (step: number) => completedSteps.includes(step)

  const resourceTypes = [
    { value: 'resource', label: 'Community Resource' },
    { value: 'provider', label: 'Service Provider' },
    { value: 'church', label: 'Church' },
    { value: 'nonprofit', label: 'Nonprofit Organization' },
    { value: 'agency', label: 'Government Agency' },
    { value: 'government', label: 'Government Office' },
    { value: 'education', label: 'Educational Institution' },
    { value: 'maker', label: 'Maker/Artisan' },
    { value: 'farm', label: 'Farm' },
  ]

  const resourceCategories = DIRECTORY_CATEGORIES.map((cat, idx) => ({
    id: idx,
    slug: cat.slug,
    name: cat.name,
    group: cat.parentGroup,
  }))

  const resourceCategories_Resources = resourceCategories.filter((c) => c.group === 'resources')
  const resourceCategories_FamilyOffice = resourceCategories.filter((c) => c.group === 'family-office')

  const shortDescCharCount = (formData.short_description || '').length
  const descCharCount = (formData.description || '').length

  return (
    <div className="max-w-3xl mx-auto">
      {submitStatus === 'success' && (
        <div className="mb-8 p-4 bg-eden-tidal/10 border border-eden-tidal rounded-lg">
          <h3 className="font-semibold text-eden-tidal mb-2">Submission Successful</h3>
          <p className="text-eden-gray">{submitMessage}</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-8 p-4 bg-eden-hibiscus/10 border border-eden-hibiscus rounded-lg">
          <h3 className="font-semibold text-eden-hibiscus mb-2">Submission Failed</h3>
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
          <div className="bg-eden-jungle rounded-lg p-8 mb-8 min-h-screen md:min-h-96">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-eden-marigold mb-2">
                  {STEPS[0].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[0].description}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-3">
                      Resource Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resourceTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                            formData.type === type.value
                              ? 'border-eden-marigold bg-eden-marigold/10'
                              : 'border-eden-lush/20 hover:border-eden-orchid/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={formData.type === type.value}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="mr-3"
                          />
                          <span className="font-medium text-eden-orchid text-sm">{type.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.type && <p className="text-eden-hibiscus text-sm mt-3">{errors.type}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Resource Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                      placeholder="e.g., Denton Community Food Bank"
                    />
                    {errors.name && (
                      <p className="text-eden-hibiscus text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Short Description (max 150 characters)
                    </label>
                    <input
                      type="text"
                      value={formData.short_description || ''}
                      onChange={(e) =>
                        handleInputChange('short_description', e.target.value.slice(0, 150))
                      }
                      className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                      placeholder="A one-line summary of what you offer..."
                      maxLength={150}
                    />
                    <p className="text-xs text-eden-gray mt-1">
                      {shortDescCharCount}/150 characters
                    </p>
                    {errors.short_description && (
                      <p className="text-eden-hibiscus text-sm mt-1">
                        {errors.short_description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Full Description (20-500 characters)
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20 min-h-24 resize-none"
                      placeholder="Tell us more about what you do and who you serve..."
                    />
                    <p className="text-xs text-eden-gray mt-1">
                      {descCharCount}/500 characters
                    </p>
                    {errors.description && (
                      <p className="text-eden-hibiscus text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-eden-marigold mb-2">
                  {STEPS[1].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[1].description}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Address (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                      placeholder="Street address"
                    />
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
                        className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                        placeholder="Denton"
                      />
                      {errors.city && (
                        <p className="text-eden-hibiscus text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-eden-orchid mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state || 'TX'}
                        onChange={(e) =>
                          handleInputChange('state', e.target.value.toUpperCase().slice(0, 2))
                        }
                        maxLength={2}
                        className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                        placeholder="TX"
                      />
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
                        className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                        placeholder="76201"
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
                        className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                        placeholder="Denton"
                      />
                      {errors.county && (
                        <p className="text-eden-hibiscus text-sm mt-1">{errors.county}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-eden-marigold mb-2">
                  {STEPS[2].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[2].description}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-eden-orchid mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                      placeholder="(940) 555-1234"
                    />
                    {errors.phone && (
                      <p className="text-eden-hibiscus text-sm mt-1">{errors.phone}</p>
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
                      className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                      placeholder="info@resource.com"
                    />
                    {errors.email && (
                      <p className="text-eden-hibiscus text-sm mt-1">{errors.email}</p>
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
                      className="w-full px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                      placeholder="https://www.resource.com"
                    />
                    {errors.website && (
                      <p className="text-eden-hibiscus text-sm mt-1">{errors.website}</p>
                    )}
                  </div>

                  {errors.contact && (
                    <p className="text-eden-hibiscus text-sm">{errors.contact}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-eden-marigold mb-2">
                  {STEPS[3].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[3].description}</p>

                <div className="space-y-8">
                  {/* Community Resources */}
                  <div>
                    <h3 className="text-lg font-semibold text-eden-marigold mb-4">
                      Community Resources & Aid
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resourceCategories_Resources.map((cat) => (
                        <label
                          key={cat.id}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                            selectedCategories.includes(cat.id)
                              ? 'border-eden-marigold bg-eden-marigold/10'
                              : 'border-eden-lush/20 hover:border-eden-orchid/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => handleCategoryToggle(cat.id)}
                            className="mt-1 mr-3"
                          />
                          <span className="font-medium text-eden-orchid text-sm">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Family Office */}
                  <div>
                    <h3 className="text-lg font-semibold text-eden-marigold mb-4">
                      Family Office Service Providers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resourceCategories_FamilyOffice.map((cat) => (
                        <label
                          key={cat.id}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                            selectedCategories.includes(cat.id)
                              ? 'border-eden-marigold bg-eden-marigold/10'
                              : 'border-eden-lush/20 hover:border-eden-orchid/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => handleCategoryToggle(cat.id)}
                            className="mt-1 mr-3"
                          />
                          <span className="font-medium text-eden-orchid text-sm">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {errors.categories && (
                    <p className="text-eden-hibiscus text-sm">{errors.categories}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="mt-8 pt-8 border-t border-eden-tidal/20">
                  <label className="block text-sm font-medium text-eden-orchid mb-3">
                    Add Tags (optional)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag(tagInput)
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-eden-lush/80 border border-eden-tidal/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-tidal/50 focus:ring-2 focus:ring-eden-tidal/20"
                      placeholder="Type a tag and press Enter..."
                    />
                    <button
                      onClick={() => handleAddTag(tagInput)}
                      className="px-4 py-2 bg-eden-marigold text-white rounded-lg font-medium hover:bg-eden-marigold/90 transition"
                    >
                      Add
                    </button>
                  </div>
                  {customTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-eden-marigold/20 border border-eden-marigold/40 text-eden-marigold text-sm rounded-full"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-eden-hibiscus transition"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-eden-marigold mb-2">
                  {STEPS[4].label}
                </h2>
                <p className="text-eden-gray mb-6">{STEPS[4].description}</p>

                <div className="space-y-4 bg-eden-lush/40 rounded-lg p-6 mb-6 border border-eden-tidal/20">
                  <div>
                    <p className="text-xs text-eden-gray uppercase font-semibold mb-1">Type</p>
                    <p className="text-eden-orchid font-medium">
                      {resourceTypes.find((t) => t.value === formData.type)?.label}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-eden-gray uppercase font-semibold mb-1">Name</p>
                    <p className="text-eden-orchid font-medium">{formData.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-eden-gray uppercase font-semibold mb-1">
                      Short Description
                    </p>
                    <p className="text-eden-gray text-sm">{formData.short_description}</p>
                  </div>

                  <div>
                    <p className="text-xs text-eden-gray uppercase font-semibold mb-1">
                      Full Description
                    </p>
                    <p className="text-eden-gray text-sm">{formData.description}</p>
                  </div>

                  {(formData.address || formData.city) && (
                    <div>
                      <p className="text-xs text-eden-gray uppercase font-semibold mb-1">
                        Location
                      </p>
                      <p className="text-eden-gray text-sm">
                        {formData.address && `${formData.address}, `}
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                    </div>
                  )}

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

                  {selectedCategories.length > 0 && (
                    <div>
                      <p className="text-xs text-eden-gray uppercase font-semibold mb-2">
                        Categories
                      </p>
                      <div className="space-y-1">
                        {selectedCategories.map((id) => {
                          const cat = resourceCategories.find((c) => c.id === id)
                          return (
                            <p key={id} className="text-eden-gray text-sm">
                              {cat?.name}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {customTags.length > 0 && (
                    <div>
                      <p className="text-xs text-eden-gray uppercase font-semibold mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {customTags.map((tag) => (
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

                <label className="flex items-start gap-3 p-4 bg-eden-lush/40 rounded-lg border border-eden-tidal/20 mb-6">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted || false}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-eden-gray">
                    I confirm that the information provided is accurate and authorize TSI to
                    verify and publish this resource in the directory.
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-eden-hibiscus text-sm mb-4">{errors.termsAccepted}</p>
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

            {currentStep < 5 ? (
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
                {isSubmitting ? 'Submitting...' : 'Submit Resource'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
