import Link from 'next/link'

interface ListingCardProps {
  id: string
  slug: string
  name: string
  category: string
  location: string
  county: string
  rating: number
  ratingCount: number
  description: string
  tags: string[]
  isPremium: boolean
}

export default function ListingCard({
  slug,
  name,
  category,
  location,
  county,
  rating,
  ratingCount,
  description,
  tags,
  isPremium,
}: ListingCardProps) {
  return (
    <Link href={`/listings/${slug}`}>
      <div className="h-full eden-glass rounded-xl p-6 hover:border-eden-tidal/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden">
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 bg-eden-marigold/0 group-hover:bg-eden-marigold/[0.02] transition-colors duration-500 pointer-events-none rounded-xl" />

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-eden-orchid group-hover:text-eden-marigold transition-colors duration-300 line-clamp-2">
                {name}
              </h3>
            </div>
            {isPremium && (
              <span className="ml-2 flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-eden-hibiscus bg-eden-hibiscus/10 border border-eden-hibiscus/20 rounded-full whitespace-nowrap">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                  <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
                </svg>
                Featured
              </span>
            )}
          </div>

          {/* Category badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1.5 text-xs font-semibold text-eden-jungle bg-eden-marigold rounded-full">
              {category}
            </span>
          </div>

          {/* Location */}
          {(location || county) && (
            <div className="flex items-center gap-1.5 mb-4 text-sm text-eden-gray">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-eden-tidal">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {location}{location && county && ','} {county}
            </div>
          )}

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-eden-marigold text-eden-marigold' : 'text-eden-gray/30'}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-eden-gray">
                {rating.toFixed(1)} ({ratingCount})
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-eden-orchid/80 line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-xs bg-eden-tidal/10 text-eden-tidal rounded-full border border-eden-tidal/10">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2.5 py-1 text-xs text-eden-gray">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
