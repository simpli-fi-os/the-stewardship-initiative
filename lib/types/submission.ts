// Submission and Claim Types for TSI Platform

export type ListingSubmissionType = 'resource' | 'provider' | 'church' | 'nonprofit' | 'maker'

export type SubmissionStep = 'type' | 'basic' | 'location' | 'contact' | 'additional' | 'review'

export interface ListingSubmission {
  // Step 1: Type
  type: ListingSubmissionType
  
  // Step 2: Basic Information
  name: string
  category: string
  subcategory?: string
  description: string
  tags: string[]
  
  // Step 3: Location
  address?: string
  city: string
  state: string
  zip?: string
  county: string
  
  // Step 4: Contact Information
  phone?: string
  email?: string
  website?: string
  contactPersonName?: string
  
  // Step 5: Additional Details (type-specific metadata)
  additionalData?: Record<string, unknown>
  
  // Review & Submit
  termsAccepted: boolean
}

export interface SubmissionProgress {
  currentStep: SubmissionStep
  completedSteps: SubmissionStep[]
  formData: Partial<ListingSubmission>
}

export interface ClaimRequest {
  listingId: string
  name: string
  email: string
  phone: string
  role: string
  verificationMethod: 'email_domain' | 'documentation'
  documentationUrl?: string
  created_at?: string
  status?: 'pending' | 'approved' | 'rejected'
  id?: string
}

export interface SubmissionResponse {
  success: boolean
  listingId?: string
  message: string
  errors?: Record<string, string>
}

// Category taxonomy by submission type
export const CATEGORY_TAXONOMY: Record<ListingSubmissionType, { name: string; subtypes: string[] }[]> = {
  resource: [
    { name: 'Food & Nutrition', subtypes: ['Food Bank', 'Meal Program', 'Nutrition Education'] },
    { name: 'Housing & Shelter', subtypes: ['Emergency Shelter', 'Transitional Housing', 'Home Repair'] },
    { name: 'Financial Assistance', subtypes: ['Emergency Assistance', 'Utility Help', 'Rental Assistance'] },
    { name: 'Healthcare', subtypes: ['Clinic', 'Counseling', 'Dental', 'Mental Health'] },
    { name: 'Job Training', subtypes: ['Skills Training', 'Job Placement', 'Apprenticeship'] },
    { name: 'Legal Services', subtypes: ['Legal Aid', 'Immigration', 'Family Law'] },
    { name: 'Community Programs', subtypes: ['Youth Program', 'Senior Services', 'Recreation'] },
  ],
  provider: [
    { name: 'Plumbing & HVAC', subtypes: ['Plumber', 'HVAC', 'Water Heater'] },
    { name: 'Electrical', subtypes: ['Electrician', 'Solar Installation', 'Generator'] },
    { name: 'Roofing & Siding', subtypes: ['Roofer', 'Siding', 'Gutters'] },
    { name: 'General Contracting', subtypes: ['General Contractor', 'Remodeling', 'New Construction'] },
    { name: 'Landscaping', subtypes: ['Landscaper', 'Lawn Care', 'Tree Service'] },
    { name: 'Professional Services', subtypes: ['Accountant', 'Financial Advisor', 'Attorney'] },
    { name: 'Health & Wellness', subtypes: ['Therapist', 'Chiropractor', 'Personal Trainer'] },
  ],
  church: [
    { name: 'Protestant', subtypes: ['Baptist', 'Methodist', 'Assembly of God', 'Pentecostal', 'Non-denominational'] },
    { name: 'Catholic', subtypes: ['Catholic Church', 'FSSP'] },
    { name: 'Orthodox', subtypes: ['Eastern Orthodox'] },
    { name: 'Other', subtypes: ['Other Christian', 'Jewish', 'Islamic', 'Buddhist'] },
  ],
  nonprofit: [
    { name: 'Education', subtypes: ['Public Schools', 'Private Schools', 'Tutoring', 'Higher Education'] },
    { name: 'Health', subtypes: ['Hospital', 'Health Foundation', 'Medical Research'] },
    { name: 'Human Services', subtypes: ['Child Welfare', 'Family Services', 'Elderly Care'] },
    { name: 'Community Development', subtypes: ['Economic Development', 'Housing', 'Community Center'] },
    { name: 'Arts & Culture', subtypes: ['Museum', 'Theater', 'Arts Education'] },
    { name: 'Environment', subtypes: ['Conservation', 'Parks', 'Green Building'] },
  ],
  maker: [
    { name: 'Handcrafted Goods', subtypes: ['Woodworking', 'Metalwork', 'Ceramics', 'Textiles'] },
    { name: 'Food & Beverage', subtypes: ['Bakery', 'Jam/Preserves', 'Coffee Roaster', 'Craft Beer'] },
    { name: 'Agriculture', subtypes: ['Farm', 'Farmers Market', 'Produce CSA', 'Honey'] },
    { name: 'Artisan Products', subtypes: ['Jewelry', 'Soap/Candles', 'Bath Products', 'Art'] },
  ],
}

// Common tags for filtering
export const COMMON_TAGS = [
  'family-friendly',
  'accepts-new-clients',
  'low-cost',
  'sliding-scale',
  'free',
  'volunteer-opportunities',
  'accepts-donations',
  'bilingual',
  'wheelchair-accessible',
  'evening-hours',
  'weekend-hours',
  'online-services',
  'mobile-services',
  'accepts-snap',
  'women-owned',
  'minority-owned',
  'veteran-owned',
  'lgbtq-friendly',
  'faith-based',
  'secular',
]
