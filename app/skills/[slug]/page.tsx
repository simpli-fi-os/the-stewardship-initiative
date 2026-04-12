import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const SKILLS: Record<string, { title: string; headline: string; description: string; related: string[] }> = {
  plumber: {
    title: 'Plumber',
    headline: 'Find a Plumber in Your Community',
    description: 'Licensed plumbers who are trusted members of your congregation. From leaky faucets to full renovations, connect with someone your community knows and trusts.',
    related: ['electrician', 'hvac-technician', 'contractor', 'handyman'],
  },
  electrician: {
    title: 'Electrician',
    headline: 'Find an Electrician in Your Community',
    description: 'Certified electricians serving their communities. Panel upgrades, wiring, lighting, and safety inspections from people your congregation already trusts.',
    related: ['plumber', 'hvac-technician', 'contractor', 'carpenter'],
  },
  'hvac-technician': {
    title: 'HVAC Technician',
    headline: 'Find an HVAC Technician in Your Community',
    description: 'Heating and cooling professionals who serve in your community. AC repair, furnace maintenance, and system installations from trusted members.',
    related: ['electrician', 'plumber', 'contractor'],
  },
  contractor: {
    title: 'General Contractor',
    headline: 'Find a Contractor in Your Community',
    description: 'General contractors who build and renovate with integrity. Kitchen remodels, room additions, and home improvements from people your community trusts.',
    related: ['carpenter', 'plumber', 'electrician', 'painter'],
  },
  carpenter: {
    title: 'Carpenter',
    headline: 'Find a Carpenter in Your Community',
    description: 'Skilled carpenters for custom woodwork, cabinetry, framing, and finish carpentry. Craftsmanship from community members who care about their work.',
    related: ['contractor', 'painter', 'handyman'],
  },
  cpa: {
    title: 'CPA / Accountant',
    headline: 'Find an Accountant in Your Community',
    description: 'Certified public accountants and bookkeepers who serve their communities. Tax preparation, financial planning, and business accounting from people you trust.',
    related: ['financial-advisor', 'tax-professional', 'insurance-broker'],
  },
  'tax-professional': {
    title: 'Tax Professional',
    headline: 'Find a Tax Professional in Your Community',
    description: 'Tax preparation specialists who understand your needs. Individual and business tax filing from trusted community members.',
    related: ['cpa', 'financial-advisor'],
  },
  'financial-advisor': {
    title: 'Financial Advisor',
    headline: 'Find a Financial Advisor in Your Community',
    description: 'Financial advisors who serve with stewardship in mind. Retirement planning, investment advice, and wealth management from people your community trusts.',
    related: ['cpa', 'insurance-broker', 'tax-professional'],
  },
  counselor: {
    title: 'Counselor / Therapist',
    headline: 'Find a Counselor in Your Community',
    description: 'Licensed counselors and therapists providing mental health support. Marriage counseling, family therapy, and individual support from community members.',
    related: ['teacher', 'mentor'],
  },
  teacher: {
    title: 'Teacher / Tutor',
    headline: 'Find a Teacher or Tutor in Your Community',
    description: 'Educators offering tutoring, mentorship, and academic support. Math, reading, test prep, and homeschool help from the teachers in your congregation.',
    related: ['counselor', 'mentor'],
  },
  mechanic: {
    title: 'Mechanic',
    headline: 'Find a Mechanic in Your Community',
    description: 'ASE-certified mechanics and auto repair specialists. Oil changes, brake jobs, and engine work from the mechanic in your congregation.',
    related: ['contractor', 'handyman'],
  },
  landscaper: {
    title: 'Landscaper',
    headline: 'Find a Landscaper in Your Community',
    description: 'Landscaping and lawn care professionals in your community. Mowing, garden design, tree trimming, and outdoor maintenance from people you trust.',
    related: ['contractor', 'handyman', 'painter'],
  },
  painter: {
    title: 'Painter',
    headline: 'Find a Painter in Your Community',
    description: 'Interior and exterior painters in your community. Residential and commercial painting from trusted skilled professionals.',
    related: ['contractor', 'carpenter', 'handyman'],
  },
  'insurance-broker': {
    title: 'Insurance Broker',
    headline: 'Find an Insurance Broker in Your Community',
    description: 'Insurance professionals who help your family get the right coverage. Auto, home, life, and health insurance from community members who care.',
    related: ['financial-advisor', 'cpa'],
  },
  handyman: {
    title: 'Handyman',
    headline: 'Find a Handyman in Your Community',
    description: 'Reliable handymen for odd jobs, repairs, and general maintenance. From fixing a leaky faucet to hanging shelves — community members who show up.',
    related: ['plumber', 'electrician', 'carpenter', 'painter'],
  },
  mentor: {
    title: 'Mentor',
    headline: 'Find a Mentor in Your Community',
    description: 'Experienced leaders willing to mentor, guide, and invest in others. Business mentoring, career coaching, and life guidance from community members.',
    related: ['counselor', 'teacher'],
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const skill = SKILLS[slug]
  if (!skill) return { title: 'Skill Not Found' }
  return {
    title: `Find a ${skill.title} in Your Church | TSI`,
    description: skill.description,
  }
}

export function generateStaticParams() {
  return Object.keys(SKILLS).map((slug) => ({ slug }))
}

export default async function SkillPage({ params }: Props) {
  const { slug } = await params
  const skill = SKILLS[slug]
  if (!skill) notFound()

  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid flex flex-col">
      <div className="px-6 pt-10"><Header /></div>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs text-sage uppercase tracking-widest mb-4">Community Skills</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">{skill.headline}</h1>
        <p className="text-lg text-eden-gray leading-relaxed mb-10">{skill.description}</p>

        <div className="eden-glass p-8 rounded-xl text-center mb-10">
          <h2 className="font-display text-xl font-bold text-eden-orchid mb-3">
            Search for a {skill.title} in Your Community
          </h2>
          <p className="text-sm text-sage mb-6">
            TSI helps communities discover the hidden skills sitting right beside them.
          </p>
          <Link href="/search" className="btn-primary text-sm">
            Search the Directory
          </Link>
        </div>

        {skill.related.length > 0 && (
          <div>
            <p className="text-sm text-sage mb-3">Also searching for:</p>
            <div className="flex flex-wrap gap-2">
              {skill.related.map((r) => {
                const relatedSkill = SKILLS[r]
                if (!relatedSkill) return null
                return (
                  <Link
                    key={r}
                    href={`/skills/${r}`}
                    className="text-sm px-3 py-1.5 rounded-full bg-eden-lush text-eden-gray border border-eden-tidal/20 hover:text-eden-orchid hover:border-eden-tidal/40 transition"
                  >
                    {relatedSkill.title}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <div className="px-6 pb-10"><Footer /></div>
    </div>
  )
}
