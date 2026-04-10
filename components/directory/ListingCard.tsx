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
      <div className="h-full bg-eden-lush border border-eden-marigold/30 rounded-lg p-6 hover:border-eden-marigold/60 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-eden-orchid group-hover:text-eden-marigold transition-colors line-clamp-2">
              {name}
            </h3>
          </div>
          {isPremium && (
            <span className="ml-2 px-2 py-1 text-xs font-bold text-eden-hibiscus bg-eden-hibiscus/10 rounded-full whitespace-nowrap">
              Premium
            </span>
          )}
        </div>

        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-eden-jungle bg-eden-marigold rounded-full">
            {category}
          </span>
        </div>

        <p className="text-sm text-eden-gray mb-2">
          {location}{location && county && ','} {county}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-eden-marigold text-eden-marigold' : 'text-eden-gray'}`}
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

        <p className="text-sm text-eden-orchid/80 line-clamp-2 mb-4">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-eden-jungle/50 text-eden-gray rounded">
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-1 text-xs text-eden-gray">
                +{tags.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
