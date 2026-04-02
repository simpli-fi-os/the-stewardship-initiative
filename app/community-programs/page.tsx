import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Community Programs',
  description: 'Beyond the directory: TSI builds what\'s missing. Adult development, youth programs, community housing, and more.',
}

const programs = [
  {
    title: 'Adult Development Programs',
    desc: 'Workforce readiness, financial literacy, mentorship matching, and life skills for adults rebuilding or starting over. Partnering with local employers and churches to create real pathways.',
    status: 'In Development',
    statusColor: 'bg-eden-marigold/20 text-eden-marigold',
  },
  {
    title: 'Youth Development Programs',
    desc: 'Character formation, career exploration, fitness and discipline, and mentorship for young people ages 12-18. Built on the conviction that every young person deserves adults who invest in them.',
    status: 'In Development',
    statusColor: 'bg-eden-marigold/20 text-eden-marigold',
  },
  {
    title: 'Community Housing Projects',
    desc: 'Connecting families with affordable housing resources, habitat builds, transitional housing, and community land trusts. Making safe housing visible and accessible.',
    status: 'Research Phase',
    statusColor: 'bg-eden-tidal/20 text-eden-tidal',
  },
  {
    title: 'Children\'s Boarding School',
    desc: 'A long-term vision for a residential academy where children from difficult circumstances receive education, mentorship, and a stable foundation. Inspired by faith, built on stewardship.',
    status: 'Vision Stage',
    statusColor: 'bg-sage/20 text-sage',
  },
  {
    title: 'First Responder Agency Index',
    desc: 'The most comprehensive database of fire, police, and EMS agencies in the country — starting with Texas. Salary data, benefits, hiring status, and honest city guides.',
    status: 'Active — Building Now',
    statusColor: 'bg-eden-tidal/20 text-eden-tidal',
  },
  {
    title: 'Local Makers & Growers Network',
    desc: 'Connecting communities with local artisans, farmers, and small-batch producers. Supporting the people who make things with their hands and grow food from the ground.',
    status: 'Active — Building Now',
    statusColor: 'bg-eden-tidal/20 text-eden-tidal',
  },
]

export default function CommunityProgramsPage() {
  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid">
      <div className="px-6 pt-10"><Header /></div>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0">
            <div className="w-[400px] h-[300px] bg-eden-marigold/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Beyond the Directory: Building What&apos;s Missing
            </h1>
            <p className="text-lg text-sage max-w-2xl mx-auto">
              Some communities don&apos;t just need a better directory. They need resources that don&apos;t exist yet. TSI builds them.
            </p>
          </div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <ScrollReveal key={i} delay={i * 100} direction="fade">
              <div className="eden-glass p-6 rounded-xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${program.statusColor}`}>
                    {program.status}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-eden-orchid mb-3">{program.title}</h3>
                <p className="text-sm text-eden-gray leading-relaxed flex-1">{program.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Closing Statement */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-lg text-sage italic leading-relaxed mb-10">
              &ldquo;TSI exists because some of the most important resources in a community are the ones nobody can see. Our job is to make them visible. And when they don&apos;t exist yet — to build them.&rdquo;
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started" className="btn-primary">Partner With Us</Link>
              <Link href="/directory/village-church" className="btn-secondary">View the Directory</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
