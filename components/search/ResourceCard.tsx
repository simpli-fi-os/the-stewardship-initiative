'use client'

import Link from 'next/link'
import { ResourceResult } from '@/lib/search/types'

// Verification badge colors and labels
const VERIFICATION_CONFIG = {
  unverified: { label: '', color: '', show: false },
  self_reported: { label: 'Self-Reported', color: 'bg-eden-gray/20 text-eden-gray', show: true },
  community_verified: { label: 'Community Verified', color: 'bg-eden-tidal/15 text-eden-tidal', show: true },
  officially_verified: { label: 'Verified', color: 'bg-eden-marigold/15 text-eden-marigold', show: true },
}

// Type display names
const TYPE_LABELS: Record<string, string> = {
  resource: 'Resource',
  provider: 'Provider',
  church: 'Church',
  nonprofit: 'Nonprofit',
  maker: 'Maker',
  farm: 'Farm',
  education: 'Education',
  agency: 'Agency',
  government: 'Government',
}

interface ResourceCardProps {
  resource: ResourceResult
  showDistance?: boolean
}

export default function ResourceCard({ resource, showDistance = false }: ResourceCardProps) {
  const verification = VERIFICATION_CONFIG[resource.verificationLevel] || VERIFICATION_CONFIG.unverified

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group block eden-glass rounded-2xl overflow-hidden hover:border-eden-tidal/40 transition-all duration-300 hover:shadow-lg hover:shadow-eden-tidal/5"
    >
      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* Name */}
            <h3 className="font-display text-lg text-eden-orchid font-semibold group-hover:text-eden-marigold transition-colors truncate">
              {resource.name}
            </h3>

            {/* Location + Type */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-eden-gray">
                {resource.city}, {resource.state}
              </span>
              {showDistance && resource.distanceMiles != null && (
                <span className="text-xs text-eden-tidal font-medium">
                  {resource.distanceMiles < 1
                    ? '< 1 mi'
                    : `${resource.distanceMiles} mi`}
                </span>
              )}
              <span className="text-eden-gray/30">|</span>
              <span className="text-xs text-eden-gray/70">
                {TYPE_LABELS[resource.type] || resource.type}
              </span>
            </div>
          </div>

          {/* Rating Badge */}
          {resource.rating > 0 && (
            <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-eden-marigold/10">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-eden-marigold"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-sm font-semibold text-eden-marigold">
                {resource.rating.toFixed(1)}
              </span>
              {resource.reviewCount > 0 && (
                <span className="text-xs text-eden-gray/60">
                  ({resource.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {resource.shortDescription && (
          <p className="text-sm text-eden-gray leading-relaxed line-clamp-2 mb-3">
            {resource.shortDescription}
          </p>
        )}

        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs rounded-full bg-eden-jungle/60 text-eden-gray border border-eden-tidal/10"
              >
                {tag.replace(/-/g, ' ')}
              </span>
            ))}
            {resource.tags.length > 4 && (
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-eden-jungle/40 text-eden-gray/60">
                +{resource.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 border-t border-eden-tidal/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Verification Badge */}
          {verification.show && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${verification.color}`}>
              {resource.verificationLevel === 'officially_verified' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-eden-marigold">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
              {verification.label}
            </span>
          )}

          {/* Featured badge */}
          {resource.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-eden-hibiscus/15 text-eden-hibiscus">
              Featured
            </span>
          )}
        </div>

        {/* Contact quick actions */}
        <div className="flex items-center gap-2">
          {resource.phone && (
            <span className="text-xs text-eden-tidal" title={resource.phone}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
          )}
          {resource.website && (
            <span className="text-xs text-eden-tidal" title="Website">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-eden-gray/40 group-hover:text-eden-tidal transition-colors"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
