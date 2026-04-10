// Directory category taxonomy for TSI platform
// Two focus areas: Community Resources & Aid + Blue Collar Family Office Service Providers

import { DirectoryCategory } from '@/lib/types/directory'

export const DIRECTORY_CATEGORIES: DirectoryCategory[] = [
  // ============================================================
  // Focus 1: Community Resources & Aid (Denton County)
  // ============================================================

  {
    slug: 'food-assistance',
    name: 'Food Assistance',
    description: 'Food banks, food pantries, meal programs, and nutrition services for families in need',
    icon: 'Apple',
    parentGroup: 'resources',
    color: '#E8B442',
  },
  {
    slug: 'housing-shelter',
    name: 'Housing & Shelter',
    description: 'Emergency shelter, transitional housing, affordable housing assistance, and homelessness prevention',
    icon: 'Home',
    parentGroup: 'resources',
    color: '#D4A574',
  },
  {
    slug: 'medical-health',
    name: 'Medical & Health',
    description: 'Free clinics, health screenings, medical equipment, prescription assistance, and healthcare access',
    icon: 'Stethoscope',
    parentGroup: 'resources',
    color: '#E74C3C',
  },
  {
    slug: 'mental-health',
    name: 'Mental Health & Counseling',
    description: 'Counseling services, crisis support, substance abuse treatment, and mental health resources',
    icon: 'Heart',
    parentGroup: 'resources',
    color: '#9B59B6',
  },
  {
    slug: 'legal-aid',
    name: 'Legal Aid',
    description: 'Free legal services, immigration support, family law assistance, and tenant advocacy',
    icon: 'Scale',
    parentGroup: 'resources',
    color: '#3498DB',
  },
  {
    slug: 'financial-assistance',
    name: 'Financial Assistance',
    description: 'Emergency financial aid, utility assistance, rent/mortgage help, and debt counseling',
    icon: 'DollarSign',
    parentGroup: 'resources',
    color: '#27AE60',
  },
  {
    slug: 'clothing-household',
    name: 'Clothing & Household',
    description: 'Clothing banks, household goods, furniture, and personal care item assistance',
    icon: 'ShoppingBag',
    parentGroup: 'resources',
    color: '#E67E22',
  },
  {
    slug: 'childcare-youth',
    name: 'Childcare & Youth',
    description: 'Childcare assistance, youth programs, after-school services, and camp scholarships',
    icon: 'Users',
    parentGroup: 'resources',
    color: '#F39C12',
  },
  {
    slug: 'senior-services',
    name: 'Senior Services',
    description: 'Senior centers, meal programs, in-home care, transportation, and aging services',
    icon: 'Users2',
    parentGroup: 'resources',
    color: '#95A5A6',
  },
  {
    slug: 'disability-services',
    name: 'Disability Services',
    description: 'Disability support, accessibility services, assistive equipment, and advocacy organizations',
    icon: 'Accessibility',
    parentGroup: 'resources',
    color: '#1ABC9C',
  },
  {
    slug: 'veteran-services',
    name: 'Veteran Services',
    description: 'Military support organizations, veteran benefits, employment, and transition assistance',
    icon: 'Shield',
    parentGroup: 'resources',
    color: '#34495E',
  },
  {
    slug: 'employment-training',
    name: 'Employment & Job Training',
    description: 'Job training programs, workforce development, resume assistance, and employment coaching',
    icon: 'Briefcase',
    parentGroup: 'resources',
    color: '#16A085',
  },
  {
    slug: 'education-tutoring',
    name: 'Education & Tutoring',
    description: 'Tutoring services, homework help, academic programs, and educational scholarships',
    icon: 'BookOpen',
    parentGroup: 'resources',
    color: '#2980B9',
  },
  {
    slug: 'transportation',
    name: 'Transportation',
    description: 'Public transit assistance, medical transportation, ride services, and vehicle repair help',
    icon: 'Car',
    parentGroup: 'resources',
    color: '#8E44AD',
  },
  {
    slug: 'utilities-assistance',
    name: 'Utilities Assistance',
    description: 'Electric, gas, water, and internet assistance programs for low-income families',
    icon: 'Zap',
    parentGroup: 'resources',
    color: '#F1C40F',
  },
  {
    slug: 'crisis-emergency',
    name: 'Crisis & Emergency',
    description: 'Crisis hotlines, emergency response, disaster relief, and urgent assistance services',
    icon: 'AlertTriangle',
    parentGroup: 'resources',
    color: '#C0392B',
  },
  {
    slug: 'substance-recovery',
    name: 'Substance Recovery',
    description: 'Addiction treatment, recovery programs, support groups, and rehabilitation services',
    icon: 'Leaf',
    parentGroup: 'resources',
    color: '#16A085',
  },
  {
    slug: 'domestic-violence',
    name: 'Domestic Violence Support',
    description: 'Domestic violence shelters, counseling, legal advocacy, and safety planning services',
    icon: 'Heart',
    parentGroup: 'resources',
    color: '#E74C3C',
  },
  {
    slug: 'immigration-services',
    name: 'Immigration Services',
    description: 'Immigration legal services, citizenship support, translation, and immigration counseling',
    icon: 'Globe',
    parentGroup: 'resources',
    color: '#3498DB',
  },
  {
    slug: 'faith-based-services',
    name: 'Faith-Based Services',
    description: 'Churches, faith organizations, spiritual counseling, and faith-based community support',
    icon: 'Church',
    parentGroup: 'resources',
    color: '#8E44AD',
  },

  // ============================================================
  // Focus 2: Blue Collar Family Office Service Providers
  // ============================================================

  {
    slug: 'financial-advisors',
    name: 'Financial Advisors',
    description: 'Fee-only financial planning, investment management, and wealth advisory for families',
    icon: 'TrendingUp',
    parentGroup: 'family-office',
    color: '#27AE60',
  },
  {
    slug: 'tax-professionals',
    name: 'Tax Professionals',
    description: 'CPA firms, tax preparation, business tax planning, and tax strategy services',
    icon: 'Receipt',
    parentGroup: 'family-office',
    color: '#2980B9',
  },
  {
    slug: 'insurance-agents',
    name: 'Insurance Agents',
    description: 'Life insurance, health insurance, property and casualty, and specialty insurance',
    icon: 'Shield',
    parentGroup: 'family-office',
    color: '#E74C3C',
  },
  {
    slug: 'estate-planning',
    name: 'Estate Planning Attorneys',
    description: 'Wills, trusts, probate, asset protection, and estate tax planning',
    icon: 'FileText',
    parentGroup: 'family-office',
    color: '#34495E',
  },
  {
    slug: 'family-law',
    name: 'Family Law Attorneys',
    description: 'Divorce, custody, prenuptials, and family legal matters',
    icon: 'Users',
    parentGroup: 'family-office',
    color: '#9B59B6',
  },
  {
    slug: 'real-estate-agents',
    name: 'Real Estate Agents',
    description: 'Residential real estate sales, purchases, and investment property guidance',
    icon: 'Home',
    parentGroup: 'family-office',
    color: '#D4A574',
  },
  {
    slug: 'mortgage-brokers',
    name: 'Mortgage Brokers',
    description: 'Mortgage origination, refinancing, and home loan advisory services',
    icon: 'DollarSign',
    parentGroup: 'family-office',
    color: '#F39C12',
  },
  {
    slug: 'bookkeepers-accountants',
    name: 'Bookkeepers & Accountants',
    description: 'Small business accounting, bookkeeping, payroll, and financial record management',
    icon: 'BarChart3',
    parentGroup: 'family-office',
    color: '#16A085',
  },
  {
    slug: 'business-coaches',
    name: 'Business Coaches',
    description: 'Business strategy, growth coaching, sales training, and operational consulting',
    icon: 'Briefcase',
    parentGroup: 'family-office',
    color: '#3498DB',
  },
  {
    slug: 'life-coaches',
    name: 'Life Coaches',
    description: 'Personal development, goal setting, leadership coaching, and life strategy',
    icon: 'Target',
    parentGroup: 'family-office',
    color: '#E67E22',
  },
  {
    slug: 'mental-health-therapists',
    name: 'Mental Health Therapists',
    description: 'Therapy, counseling, coaching, and mental health support for individuals and families',
    icon: 'Heart',
    parentGroup: 'family-office',
    color: '#9B59B6',
  },
  {
    slug: 'marriage-counselors',
    name: 'Marriage & Family Counselors',
    description: 'Marriage counseling, family therapy, and relationship coaching',
    icon: 'Heart',
    parentGroup: 'family-office',
    color: '#E74C3C',
  },
  {
    slug: 'pediatricians',
    name: 'Pediatricians',
    description: 'Pediatric healthcare, child wellness, immunizations, and family health services',
    icon: 'Baby',
    parentGroup: 'family-office',
    color: '#F39C12',
  },
  {
    slug: 'dentists',
    name: 'Dentists',
    description: 'Dental services, orthodontics, family dentistry, and oral health care',
    icon: 'Smile',
    parentGroup: 'family-office',
    color: '#95A5A6',
  },
  {
    slug: 'veterinarians',
    name: 'Veterinarians',
    description: 'Pet healthcare, animal wellness, veterinary services, and pet care',
    icon: 'Paw',
    parentGroup: 'family-office',
    color: '#8E44AD',
  },
  {
    slug: 'auto-mechanics',
    name: 'Auto Mechanics',
    description: 'Vehicle repair, maintenance, inspections, and automotive services',
    icon: 'Wrench',
    parentGroup: 'family-office',
    color: '#34495E',
  },
  {
    slug: 'home-repair-contractors',
    name: 'Home Repair & Contractors',
    description: 'General contracting, renovations, repairs, and home improvement services',
    icon: 'Hammer',
    parentGroup: 'family-office',
    color: '#D4A574',
  },
  {
    slug: 'landscapers',
    name: 'Landscapers',
    description: 'Landscaping, yard maintenance, tree services, and outdoor property care',
    icon: 'Leaf',
    parentGroup: 'family-office',
    color: '#27AE60',
  },
  {
    slug: 'tutors-education',
    name: 'Tutors & Education',
    description: 'Private tutoring, academic coaching, test prep, and educational support',
    icon: 'BookOpen',
    parentGroup: 'family-office',
    color: '#2980B9',
  },
  {
    slug: 'fitness-wellness',
    name: 'Fitness & Wellness',
    description: 'Personal training, fitness coaching, wellness programs, and health services',
    icon: 'Activity',
    parentGroup: 'family-office',
    color: '#1ABC9C',
  },
]

// Utility: Get categories by parent group
export function getCategoriesByGroup(group: 'resources' | 'family-office'): DirectoryCategory[] {
  return DIRECTORY_CATEGORIES.filter(cat => cat.parentGroup === group)
}

// Utility: Get category by slug
export function getCategoryBySlug(slug: string): DirectoryCategory | undefined {
  return DIRECTORY_CATEGORIES.find(cat => cat.slug === slug)
}

// Utility: Get all category slugs
export function getAllCategorySlugs(): string[] {
  return DIRECTORY_CATEGORIES.map(cat => cat.slug)
}
