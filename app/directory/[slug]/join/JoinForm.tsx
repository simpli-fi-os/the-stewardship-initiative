'use client'

import { useState, useRef } from 'react'

interface Skill {
  id: string
  name: string
  color: string
  icon: string | null
}

interface Props {
  slug: string
  skills: Skill[]
}

export default function JoinForm({ slug, skills }: Props) {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5MB')
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add selected skills
    selectedSkills.forEach(id => formData.append('skillIds', id))

    try {
      const res = await fetch(`/api/directory/${slug}/members`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-5xl mb-4">&#10003;</div>
        <h2 className="font-display text-2xl font-bold text-[#333]">Profile Submitted!</h2>
        <p className="mt-2 text-gray-500">
          Your profile has been submitted for review. Once approved by an administrator,
          you&apos;ll appear in the directory.
        </p>
        <a
          href={`/directory/${slug}`}
          className="inline-block mt-6 bg-[#007398] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#007398]/80 transition"
        >
          Back to Directory
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-500 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007398]"
        />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-500 mb-1">
          Title / Role
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="e.g., Accountant, Plumber, Youth Leader"
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007398]"
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-500 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007398]"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-500 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007398]"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-semibold text-gray-500 mb-1">
          About You
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          placeholder="Tell us a bit about yourself..."
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007398]"
        />
      </div>

      {/* Description / Services */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-500 mb-1">
          Services / How You Can Help
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="What skills or services can you offer to the community?"
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007398]"
        />
      </div>

      {/* Skills */}
      <div>
        <p className="block text-sm font-semibold text-gray-500 mb-2">Skills & Giftings</p>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <button
              key={skill.id}
              type="button"
              onClick={() => toggleSkill(skill.id)}
              className={`text-sm font-medium px-3 py-1.5 rounded-full border transition ${
                selectedSkills.has(skill.id)
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
              style={selectedSkills.has(skill.id) ? { backgroundColor: skill.color } : undefined}
            >
              {skill.name}
            </button>
          ))}
        </div>
      </div>

      {/* Photo */}
      <div>
        <p className="block text-sm font-semibold text-gray-500 mb-2">Photo</p>
        <div className="flex items-center gap-4">
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm text-[#007398] font-semibold hover:underline"
          >
            {photoPreview ? 'Change Photo' : 'Upload Photo'}
          </button>
          <input
            ref={fileRef}
            type="file"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Max 5MB. JPG, PNG, or WebP.</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#007398] text-white font-bold py-3 px-6 rounded-md hover:bg-[#007398]/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Profile'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Your profile will be reviewed by an administrator before appearing in the directory.
      </p>
    </form>
  )
}
