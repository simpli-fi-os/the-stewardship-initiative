import Link from 'next/link'
import { Metadata } from 'next'
import { 
  Star, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Share2, 
  Flag,
  Clock,
  Shield,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { createServerComponentClient } from '@/lib/supabase-server'

interface ResourceRow {
  id: string
  name: string
  slug: string
  description: string
  full_description: string | null
  category_id: string
  location_city: string
  location_state: string
  phone: string | null
  email: string | null
  website: string | null
  rating: number | null
  review_count: number
  tags: string[] | null
  hours: Record<string, string> | null
  verified_status: 'officially_verified' | 'community_verified' | 'self_reported' | 'unverified'
  trust_score: number | null
  published: boolean
  photo_urls: string[] | null
  resource_categories?: Array<{
    category_id: string
    categories: {
      id: string
      name: string
      slug: string
    }
  }>
}

interface Resource extends ResourceRow {
  resource_categories: Array<{
    category_id: string
    categories: {
      id: string
      name: string
      slug: string
    }
  }>
}

async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const supabase = await createServerComponentClient()
  
  const { data, error } = await supabase
    .from('resources')
    .select('*, resource_categories(category_id, categories(id, name, slug))')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  if (error || !data) return null
  return data as Resource
}

async function getRelatedResources(categoryId: string, currentId: string, limit: number = 3) {
  const supabase = await createServerComponentClient()
  
  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      name,
      slug,
      description,
      location_city,
      location_state,
      rating,
      review_count,
      tags,
      verified_status,
      photo_urls,
      resource_categories(category_id, categories(id, name, slug))
    `)
    .eq('published', true)
    .neq('id', currentId)
    .order('rating', { ascending: false })
    .limit(limit)
  
  if (error || !data) return []
  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resource = await getResourceBySlug(params.slug)
  
  if (!resource) {
    return {
      title: 'Resource Not Found',
      description: 'The resource you are looking for could not be found.',
    }
  }

  return {
    title: `${resource.name} | The Stewardship Initiative Resources`,
    description: resource.description || `Discover ${resource.name} on The Stewardship Initiative resource directory.`,
    openGraph: {
      title: resource.name,
      description: resource.description || undefined,
      type: 'website',
      url: `/resources/${resource.slug}`,
    },
  }
}

function getVerificationBadgeColor(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'officially_verified':
      return { bg: 'bg-eden-tidal/20', text: 'text-eden-tidal', border: 'border-eden-tidal' }
    case 'community_verified':
      return { bg: 'bg-eden-marigold/20', text: 'text-eden-marigold', border: 'border-eden-marigold' }
    case 'self_reported':
      return { bg: 'bg-eden-gray/20', text: 'text-eden-gray', border: 'border-eden-gray' }
    default:
      return { bg: 'bg-transparent', text: 'text-eden-gray', border: 'border-eden-gray' }
  }
}

function getVerificationLabel(status: string): string {
  switch (status) {
    case 'officially_verified':
      return 'Officially Verified'
    case 'community_verified':
      return 'Community Verified'
    case 'self_reported':
      return 'Self Reported'
    default:
      return 'Unverified'
  }
}

function formatHours(hours: Record<string, string> | null | undefined): string {
  if (!hours) return 'Hours not available'
  
  return Object.entries(hours)
    .map(([day, time]) => `${day}: ${time}`)
    .join('\n')
}

export default async function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const resource = await getResourceBySlug(params.slug)
  const related = resource ? await getRelatedResources(
    resource.resource_categories?.[0]?.category_id || '',
    resource.id
  ) : []

  if (!resource) {
    return (
      <div className="min-h-screen bg-eden-jungle text-eden-orchid flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold font-display text-eden-marigold mb-4">
            Resource Not Found
          </h1>
          <p className="text-eden-gray mb-8">
            We couldn't find that resource in our directory.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-eden-marigold hover:bg-yellow-400 text-eden-jungle font-semibold rounded transition-colors"
          >
            Search More Resources
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    )
  }

  const category = resource.resource_categories?.[0]?.categories
  const verificationColor = getVerificationBadgeColor(resource.verified_status)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: resource.name,
    description: resource.full_description || resource.description,
    telephone: resource.phone,
    email: resource.email,
    url: resource.website,
    address: {
      '@type': 'PostalAddress',
      addressLocality: resource.location_city,
      addressRegion: resource.location_state,
      addressCountry: 'US',
    },
    ...(resource.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: resource.rating,
        reviewCount: resource.review_count || 0,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      <div className="bg-eden-lush/50 border-b border-eden-tidal/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link href="/search" className="text-eden-tidal hover:text-eden-marigold transition-colors">
            Search
          </Link>
          <span className="text-eden-gray">/</span>
          {category && (
            <>
              <Link
                href={`/search?category=${category.slug}`}
                className="text-eden-tidal hover:text-eden-marigold transition-colors"
              >
                {category.name}
              </Link>
              <span className="text-eden-gray">/</span>
            </>
          )}
          <span className="text-eden-orchid">{resource.name}</span>
        </div>
      </div>

      {/* Hero Section with Image */}
      <div className="bg-eden-jungle">
        <div className="max-w-6xl mx-auto">
          {/* Main Image */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 bg-eden-lush/50 overflow-hidden">
            {resource.photo_urls && resource.photo_urls.length > 0 ? (
              <img
                src={resource.photo_urls[0]}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-eden-tidal/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🌿</span>
                  </div>
                  <p className="text-eden-gray">{resource.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {resource.photo_urls && resource.photo_urls.length > 1 && (
            <div className="px-4 py-4 flex gap-2 overflow-x-auto">
              {resource.photo_urls.map((url, index) => (
                <div
                  key={index}
                  className="w-20 h-20 flex-shrink-0 rounded border border-eden-tidal/30 cursor-pointer hover:border-eden-tidal transition-colors overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`${resource.name} gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="md:col-span-2 space-y-8">
          {/* Header with Actions */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {category && (
                    <span className="inline-block px-3 py-1 bg-eden-tidal/20 border border-eden-tidal text-eden-tidal text-xs font-semibold rounded-full">
                      {category.name}
                    </span>
                  )}
                  {resource.verified_status !== 'unverified' && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 ${verificationColor.bg} border ${verificationColor.border} text-xs font-semibold rounded-full`}>
                      <CheckCircle size={14} />
                      {getVerificationLabel(resource.verified_status)}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold font-display text-eden-marigold mb-3">
                  {resource.name}
                </h1>
                {(resource.rating || resource.review_count) && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            resource.rating && i < Math.floor(resource.rating)
                              ? 'fill-eden-marigold text-eden-marigold'
                              : 'text-eden-gray'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-eden-gray">
                      {resource.rating?.toFixed(1)} ({resource.review_count} reviews)
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 rounded border border-eden-tidal text-eden-tidal hover:bg-eden-tidal/10 transition-colors"
                  title="Share this resource"
                >
                  <Share2 size={20} />
                </button>
                <button
                  className="p-2 rounded border border-eden-tidal text-eden-tidal hover:bg-eden-tidal/10 transition-colors"
                  title="Report this resource"
                >
                  <Flag size={20} />
                </button>
              </div>
            </div>

            {resource.location_city && resource.location_state && (
              <p className="text-eden-gray flex items-center gap-2">
                <MapPin size={16} className="text-eden-tidal flex-shrink-0" />
                {resource.location_city}, {resource.location_state}
              </p>
            )}
          </div>

          {/* Description Section */}
          {resource.description && (
            <div className="space-y-4">
              <p className="text-eden-gray leading-relaxed">
                {resource.full_description || resource.description}
              </p>
            </div>
          )}

          {/* Hours Section */}
          {resource.hours && (
            <div className="space-y-4 border-t border-eden-tidal/20 pt-6">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-eden-tidal" />
                <h2 className="text-2xl font-bold font-display text-eden-marigold">Hours</h2>
              </div>
              <div className="bg-eden-lush/20 border border-eden-tidal/20 rounded-lg p-4">
                <p className="text-eden-gray whitespace-pre-line leading-relaxed">
                  {formatHours(resource.hours)}
                </p>
              </div>
            </div>
          )}

          {/* Tags/Services */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="space-y-4 border-t border-eden-tidal/20 pt-6">
              <h2 className="text-2xl font-bold font-display text-eden-marigold">
                Services & Focus Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-eden-tidal/20 border border-eden-tidal text-eden-tidal text-sm rounded-full hover:bg-eden-tidal/30 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Claim Section */}
          <div className="border border-eden-hibiscus/30 bg-eden-hibiscus/5 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Flag size={20} className="text-eden-hibiscus flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-eden-hibiscus mb-2">Is this your organization?</h3>
                <p className="text-eden-gray text-sm mb-4">
                  Claim this listing to update information, respond to reviews, and manage your profile.
                </p>
                <button className="px-4 py-2 bg-eden-hibiscus hover:bg-eden-hibiscus/90 text-white font-semibold rounded transition-colors">
                  Claim This Resource
                </button>
              </div>
            </div>
          </div>

          {/* Related Resources */}
          {related.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-eden-tidal/20">
              <h2 className="text-2xl font-bold font-display text-eden-marigold">
                Similar Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(item => (
                  <Link
                    key={item.id}
                    href={`/resources/${item.slug}`}
                    className="group p-4 border border-eden-tidal/20 rounded-lg hover:border-eden-tidal hover:bg-eden-lush/10 transition-all"
                  >
                    {/* Resource Image */}
                    {item.photo_urls && item.photo_urls.length > 0 && (
                      <div className="w-full h-32 mb-3 rounded bg-eden-lush/50 overflow-hidden">
                        <img
                          src={item.photo_urls[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-eden-marigold group-hover:text-yellow-300 line-clamp-2 flex-1">
                        {item.name}
                      </h3>
                    </div>
                    {item.resource_categories?.[0]?.categories && (
                      <p className="text-xs text-eden-tidal mb-2">
                        {item.resource_categories[0].categories.name}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-eden-gray line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-eden-tidal/10">
                      {item.rating ? (
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < Math.floor(item.rating || 0)
                                  ? 'fill-eden-marigold text-eden-marigold'
                                  : 'text-eden-gray'
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-eden-gray">No ratings yet</span>
                      )}
                      <span className="text-xs text-eden-gray">
                        {item.review_count} {item.review_count === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Contact & Trust Info */}
        <div className="md:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Contact Card */}
            <div className="border border-eden-tidal/20 rounded-lg p-6 bg-eden-lush/20">
              <h3 className="font-bold text-eden-marigold mb-4 flex items-center gap-2">
                <Phone size={18} />
                Contact Info
              </h3>
              <div className="space-y-4">
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone}`}
                    className="flex items-center gap-3 text-eden-gray hover:text-eden-tidal transition-colors group"
                  >
                    <Phone size={18} className="text-eden-tidal flex-shrink-0" />
                    <span className="text-sm group-hover:underline">{resource.phone}</span>
                  </a>
                )}
                {resource.email && (
                  <a
                    href={`mailto:${resource.email}`}
                    className="flex items-center gap-3 text-eden-gray hover:text-eden-tidal transition-colors group"
                  >
                    <Mail size={18} className="text-eden-tidal flex-shrink-0" />
                    <span className="text-sm break-all group-hover:underline">{resource.email}</span>
                  </a>
                )}
                {resource.website && (
                  <a
                    href={resource.website.startsWith('http') ? resource.website : `https://${resource.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-eden-gray hover:text-eden-tidal transition-colors group"
                  >
                    <Globe size={18} className="text-eden-tidal flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate group-hover:underline">{resource.website}</p>
                    </div>
                    <ExternalLink size={14} className="flex-shrink-0" />
                  </a>
                )}
                {!resource.phone && !resource.email && !resource.website && (
                  <p className="text-sm text-eden-gray italic">Contact information not available</p>
                )}
              </div>
            </div>

            {/* Trust & Verification Card */}
            <div className="border border-eden-tidal/20 rounded-lg p-6 bg-eden-lush/20">
              <h3 className="font-bold text-eden-marigold mb-4 flex items-center gap-2">
                <Shield size={18} />
                Trust & Verification
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-eden-gray mb-2">Verification Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-2 ${verificationColor.bg} border ${verificationColor.border} text-sm font-semibold rounded`}
                  >
                    <CheckCircle size={16} />
                    {getVerificationLabel(resource.verified_status)}
                  </span>
                </div>
                {resource.trust_score && (
                  <div>
                    <p className="text-xs text-eden-gray mb-2">Trust Score</p>
                    <div className="w-full bg-eden-lush/50 rounded-full h-2">
                      <div
                        className="bg-eden-tidal rounded-full h-2 transition-all"
                        style={{ width: `${(resource.trust_score / 100) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-eden-tidal mt-1">{resource.trust_score.toFixed(0)}%</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-eden-gray mb-1">Reviews</p>
                  <p className="text-sm font-semibold text-eden-marigold">{resource.review_count} reviews</p>
                </div>
              </div>
            </div>

            {/* Search More CTA */}
            <div className="border border-eden-marigold/30 rounded-lg p-6 bg-eden-marigold/5">
              <h3 className="font-bold text-eden-marigold mb-3">Find More</h3>
              <p className="text-sm text-eden-gray mb-4">
                Discover more resources and providers in our directory.
              </p>
              <Link
                href="/search"
                className="block text-center px-4 py-2 bg-eden-marigold hover:bg-yellow-400 text-eden-jungle font-semibold rounded transition-colors"
              >
                Search Resources
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-8" />
    </div>
  )
}
