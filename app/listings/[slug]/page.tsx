import Link from 'next/link'
import { Star, MapPin, Globe, Mail, Phone, Share2, Flag } from 'lucide-react'

const MOCK_LISTINGS = [
  {
    id: 1,
    slug: 'denton-community-food-bank',
    name: 'Denton Community Food Bank',
    category: 'Food & Nutrition',
    location: 'Denton, TX',
    description: 'Community food bank providing free groceries and nutrition resources to families in need across Denton County. We offer weekend food boxes, nutrition education, and emergency assistance.',
    fullDescription: 'The Denton Community Food Bank is a non-profit organization dedicated to fighting hunger and food insecurity in Denton County. We provide free groceries, pantry boxes, and nutrition education to individuals and families facing food insecurity. Our mission is to ensure that no one in our community goes hungry. We operate multiple distribution centers throughout Denton County and provide both emergency assistance and long-term support programs. Our services include weekend food distribution, monthly nutrition workshops, referrals to job training and benefits programs, and partnership with local schools for student meal support.',
    image: '/images/listings/food-bank.jpg',
    gallery: [
      '/images/listings/food-bank.jpg',
      '/images/listings/food-bank-2.jpg',
      '/images/listings/food-bank-3.jpg',
    ],
    rating: 4.8,
    reviewCount: 124,
    tags: ['Food', 'Families', 'Emergency Assistance', 'Free', 'Weekly Hours'],
    phone: '(940) 555-0123',
    email: 'info@dentonfoodbank.org',
    website: 'www.dentonfoodbank.org',
    hours: 'Monday-Friday 9am-5pm, Saturday 10am-2pm',
    isPremium: true,
  },
  {
    id: 2,
    slug: 'denton-youth-mentorship',
    name: 'Denton Youth Mentorship Network',
    category: 'Youth & Education',
    location: 'Denton, TX',
    description: 'Youth mentorship program connecting at-risk teens with caring adult mentors for academic support, life skills, and career guidance.',
    fullDescription: 'The Denton Youth Mentorship Network pairs at-risk youth (ages 12-18) with trained volunteer mentors who provide one-on-one support in academics, life skills development, and career exploration. Our mentors work with youth to build confidence, set goals, and navigate challenges. We offer structured mentoring relationships, group workshops on topics like resume writing and college prep, and recreational activities that build community and belonging.',
    image: '/images/listings/youth-mentorship.jpg',
    gallery: [
      '/images/listings/youth-mentorship.jpg',
      '/images/listings/youth-mentorship-2.jpg',
    ],
    rating: 4.9,
    reviewCount: 87,
    tags: ['Youth', 'Mentorship', 'Education', 'Career Support', 'Free'],
    phone: '(940) 555-0456',
    email: 'mentors@dentonyouth.org',
    website: 'www.dentonyouth.org',
    hours: 'Monday-Thursday 3pm-7pm, Saturday 10am-2pm',
    isPremium: true,
  },
  {
    id: 3,
    slug: 'dental-access-clinic',
    name: 'Dental Access Clinic',
    category: 'Healthcare',
    location: 'Denton, TX',
    description: 'Sliding-scale dental clinic providing preventive care, cleanings, and basic treatment to uninsured and low-income families.',
    fullDescription: 'The Dental Access Clinic provides comprehensive dental services on a sliding-scale fee basis to individuals and families without dental insurance or with limited financial resources. Services include preventive care, cleanings, X-rays, fillings, extractions, and basic emergency treatment. Our licensed dentists and hygienists are committed to providing compassionate, judgment-free care to every patient regardless of ability to pay.',
    image: '/images/listings/dental-clinic.jpg',
    gallery: [
      '/images/listings/dental-clinic.jpg',
      '/images/listings/dental-clinic-2.jpg',
    ],
    rating: 4.7,
    reviewCount: 156,
    tags: ['Healthcare', 'Dental', 'Sliding Scale', 'Preventive Care', 'Uninsured'],
    phone: '(940) 555-0789',
    email: 'appointments@dentalaccess.org',
    website: 'www.dentalaccess.org',
    hours: 'Monday, Wednesday, Friday 8am-4pm, Tuesday 10am-6pm, Saturday 9am-1pm',
    isPremium: false,
  },
]

function getListingBySlug(slug: string) {
  return MOCK_LISTINGS.find(listing => listing.slug === slug)
}

function getRelatedListings(currentId: number, category: string, limit: number = 3) {
  return MOCK_LISTINGS
    .filter(listing => listing.id !== currentId && listing.category === category)
    .slice(0, limit)
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const listing = getListingBySlug(params.slug)
  
  return {
    title: listing ? `${listing.name} | Directory` : 'Listing Not Found',
    description: listing?.description || 'View this community resource on The Stewardship Initiative directory.',
  }
}

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  const listing = getListingBySlug(params.slug)
  const related = listing ? getRelatedListings(listing.id, listing.category) : []

  if (!listing) {
    return (
      <div className="min-h-screen bg-eden-jungle text-eden-orchid flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Listing Not Found</h1>
          <p className="mb-6">We couldn't find that listing.</p>
          <Link href="/directory-landing" className="text-eden-marigold hover:text-yellow-300 underline">
            Back to Directory
          </Link>
        </div>
      </div>
    )
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: listing.fullDescription,
    telephone: listing.phone,
    email: listing.email,
    url: listing.website,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.location,
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: listing.rating,
      reviewCount: listing.reviewCount,
    },
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
          <Link href="/directory-landing" className="text-eden-tidal hover:text-eden-marigold">
            Directory
          </Link>
          <span className="text-eden-gray">/</span>
          <Link href={`/categories/${listing.category.toLowerCase().replace(/ /g, '-')}`} className="text-eden-tidal hover:text-eden-marigold">
            {listing.category}
          </Link>
          <span className="text-eden-gray">/</span>
          <span className="text-eden-orchid">{listing.name}</span>
        </div>
      </div>

      {/* Hero Section with Gallery */}
      <div className="bg-eden-jungle">
        <div className="max-w-6xl mx-auto">
          {/* Main Image */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 bg-eden-lush/50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-eden-gray">
              <div className="text-center">
                <div className="w-16 h-16 bg-eden-tidal/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📸</span>
                </div>
                <p>{listing.name}</p>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="px-4 py-4 flex gap-2 overflow-x-auto">
            {listing.gallery.map((_, index) => (
              <div
                key={index}
                className="w-20 h-20 flex-shrink-0 bg-eden-lush/50 rounded border border-eden-tidal/30 cursor-pointer hover:border-eden-tidal transition-colors flex items-center justify-center"
              >
                <span className="text-sm">📷</span>
              </div>
            ))}
          </div>
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
                <div className="flex items-center gap-2 mb-2">
                  {listing.isPremium && (
                    <span className="inline-block px-2 py-1 bg-eden-hibiscus/20 border border-eden-hibiscus text-eden-hibiscus text-xs font-semibold rounded">
                      Premium Partner
                    </span>
                  )}
                  <span className="inline-block px-2 py-1 bg-eden-tidal/20 border border-eden-tidal text-eden-tidal text-xs font-semibold rounded">
                    {listing.category}
                  </span>
                </div>
                <h1 className="text-4xl font-bold font-display text-eden-marigold mb-2">
                  {listing.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(listing.rating) ? 'fill-eden-marigold text-eden-marigold' : 'text-eden-gray'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-eden-gray">
                    {listing.rating} ({listing.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded border border-eden-tidal text-eden-tidal hover:bg-eden-tidal/10 transition-colors">
                  <Share2 size={20} />
                </button>
                <button className="p-2 rounded border border-eden-tidal text-eden-tidal hover:bg-eden-tidal/10 transition-colors">
                  <Flag size={20} />
                </button>
              </div>
            </div>

            <p className="text-eden-gray flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-eden-tidal" />
              {listing.location}
            </p>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-eden-marigold">About</h2>
            <p className="text-eden-gray leading-relaxed">
              {listing.fullDescription}
            </p>
          </div>

          {/* Hours Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-eden-marigold">Hours</h2>
            <p className="text-eden-gray leading-relaxed whitespace-pre-line">
              {listing.hours}
            </p>
          </div>

          {/* Tags/Services */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-eden-marigold">Services & Focus Areas</h2>
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-eden-tidal/20 border border-eden-tidal text-eden-tidal text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Claim Section */}
          <div className="border border-eden-hibiscus/30 bg-eden-hibiscus/5 rounded-lg p-6">
            <h3 className="font-bold text-eden-hibiscus mb-2">Is this your organization?</h3>
            <p className="text-eden-gray text-sm mb-4">
              Claim this listing to update information, respond to reviews, and manage your profile.
            </p>
            <button className="px-4 py-2 bg-eden-hibiscus hover:bg-eden-hibiscus/90 text-white font-semibold rounded transition-colors">
              Claim This Listing
            </button>
          </div>

          {/* Related Listings */}
          {related.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-eden-tidal/20">
              <h2 className="text-2xl font-bold font-display text-eden-marigold">Similar Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(item => (
                  <Link
                    key={item.id}
                    href={`/listings/${item.slug}`}
                    className="p-4 border border-eden-tidal/20 rounded-lg hover:border-eden-tidal hover:bg-eden-lush/10 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-eden-marigold group-hover:text-yellow-300 line-clamp-2 flex-1">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xs text-eden-tidal mb-2">{item.category}</p>
                    <p className="text-sm text-eden-gray line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < Math.floor(item.rating) ? 'fill-eden-marigold text-eden-marigold' : 'text-eden-gray'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-eden-gray">{item.rating}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Contact & CTA */}
        <div className="md:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Contact Card */}
            <div className="border border-eden-tidal/20 rounded-lg p-6 bg-eden-lush/20">
              <h3 className="font-bold text-eden-marigold mb-4">Contact Info</h3>
              <div className="space-y-4">
                {listing.phone && (
                  <a
                    href={`tel:${listing.phone}`}
                    className="flex items-center gap-3 text-eden-gray hover:text-eden-tidal transition-colors"
                  >
                    <Phone size={18} className="text-eden-tidal flex-shrink-0" />
                    <span className="text-sm">{listing.phone}</span>
                  </a>
                )}
                {listing.email && (
                  <a
                    href={`mailto:${listing.email}`}
                    className="flex items-center gap-3 text-eden-gray hover:text-eden-tidal transition-colors"
                  >
                    <Mail size={18} className="text-eden-tidal flex-shrink-0" />
                    <span className="text-sm break-all">{listing.email}</span>
                  </a>
                )}
                {listing.website && (
                  <a
                    href={`https://${listing.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-eden-gray hover:text-eden-tidal transition-colors"
                  >
                    <Globe size={18} className="text-eden-tidal flex-shrink-0" />
                    <span className="text-sm truncate">{listing.website}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Directory CTA */}
            <div className="border border-eden-marigold/30 rounded-lg p-6 bg-eden-marigold/5">
              <h3 className="font-bold text-eden-marigold mb-3">Explore More</h3>
              <p className="text-sm text-eden-gray mb-4">
                Discover more resources and providers in our community directory.
              </p>
              <Link
                href="/directory-landing"
                className="block text-center px-4 py-2 bg-eden-marigold hover:bg-yellow-400 text-eden-jungle font-semibold rounded transition-colors"
              >
                Back to Directory
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
