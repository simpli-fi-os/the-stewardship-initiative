'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ConstellationCanvas from '@/components/ConstellationCanvas'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'
import NewsletterSignup from '@/components/NewsletterSignup'
import ExploreSection from '@/components/ExploreSection'

/* =============================================
   SECTION 1: HERO
   ============================================= */
function HeroSection() {
  const [headlineVisible, setHeadlineVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    const h = setTimeout(() => setHeadlineVisible(true), 800)
    const c = setTimeout(() => setContentVisible(true), 1600)
    return () => { clearTimeout(h); clearTimeout(c) }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      <ConstellationCanvas />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Brand */}
        <div className={`mb-8 transition-all duration-1000 ${headlineVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-eden-marigold font-bold tracking-widest text-sm uppercase mb-6">
            The Stewardship Initiative
          </p>
        </div>

        <h1
          className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 transition-all duration-1000 ${headlineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          The Resources That Connect Your Community Are Already{' '}
          <span className="text-eden-hibiscus animate-heartbeat inline-block">Inside</span>.
        </h1>

        <p
          className={`text-lg md:text-xl text-eden-orchid/80 max-w-2xl mx-auto mb-10 transition-all duration-1000 delay-300 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          When you need help, the answer is closer than you think. TSI makes invisible community resources findable, trustworthy, and actionable.
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 transition-all duration-1000 delay-500 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Link href="/directory/village-church" className="btn-primary w-full sm:w-auto text-center">
            See a Live Directory
          </Link>
          <Link href="/for-churches" className="btn-secondary w-full sm:w-auto text-center">
            For Church Leaders
          </Link>
        </div>

        <p className={`text-sm text-sage transition-all duration-1000 delay-700 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
          Or explore:{' '}
          <Link href="/for-first-responders" className="text-eden-tidal hover:underline">Fire Departments</Link>
          {' · '}
          <Link href="/for-nonprofits" className="text-eden-tidal hover:underline">Nonprofits</Link>
          {' · '}
          <Link href="/for-providers" className="text-eden-tidal hover:underline">Providers</Link>
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
        <p className="text-eden-marigold text-xs tracking-wide mb-2">Scroll to explore</p>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-marigold mx-auto">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Trust bar */}
      <div className={`absolute bottom-24 left-0 right-0 z-10 text-center transition-all duration-1000 delay-1000 ${contentVisible ? 'opacity-60' : 'opacity-0'}`}>
        <p className="text-xs text-eden-gray tracking-wide">
          Trusted by churches, nonprofits, fire departments, and family offices across Texas
        </p>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 2: THE PROBLEM
   ============================================= */
function ProblemSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-eden-hibiscus/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-eden-orchid mb-8">
            Your Community Is Full of Hidden Talent. And Nobody Knows It.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="text-lg text-eden-gray leading-relaxed space-y-6 mb-16">
            <p>
              Every Sunday morning in churches across America. Every shift change at fire stations. Every neighborhood in every city. Somewhere right now, a retired electrician is frustrated because he can&apos;t find meaningful ways to serve. Somewhere, a single mother is paying $800 at a chain shop for work that would cost $200 if she knew the mechanic in her congregation.
            </p>
            <p>
              They never connect. Not because they don&apos;t care — but because there&apos;s no way to know.
            </p>
          </div>
        </ScrollReveal>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ScrollReveal delay={0} direction="left">
            <div className="eden-glass glow-marigold p-8 rounded-xl text-center">
              <p className="font-display text-5xl font-bold text-eden-marigold mb-2">
                <AnimatedCounter target={1} suffix=" in 4" />
              </p>
              <p className="text-sm text-eden-gray">Church members feel disconnected from their congregation</p>
              <p className="text-xs text-sage mt-2">(Barna Group, 2024)</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="eden-glass glow-marigold p-8 rounded-xl text-center">
              <p className="font-display text-5xl font-bold text-eden-marigold mb-2">
                <AnimatedCounter target={76} suffix="%" />
              </p>
              <p className="text-sm text-eden-gray">Of church members say they&apos;d serve more if they knew what was needed</p>
              <p className="text-xs text-sage mt-2">(Gallup Engagement Study)</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="right">
            <div className="eden-glass glow-marigold p-8 rounded-xl text-center">
              <p className="font-display text-5xl font-bold text-eden-marigold mb-2">
                <AnimatedCounter target={2.3} prefix="$" suffix="T" decimals={1} />
              </p>
              <p className="text-sm text-eden-gray">Hidden economic value in untapped community services annually</p>
              <p className="text-xs text-sage mt-2">(CCDA estimate)</p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={300}>
          <p className="text-sage italic text-lg max-w-2xl mx-auto">
            &ldquo;The gap is not caused by apathy. It is caused by <em className="text-eden-orchid not-italic font-medium">invisibility</em>. The skills exist. The needs exist. Nobody has built the bridge — until now.&rdquo;
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 3: THE VISION
   ============================================= */
function VisionSection() {
  return (
    <section className="py-24 md:py-32 px-6" style={{ background: 'linear-gradient(90deg, #022C22 0%, #033F32 100%)' }}>
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid mb-6 text-center">
            What If Every Gift Found Its Purpose?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="text-lg text-eden-gray leading-relaxed max-w-2xl mx-auto text-center mb-16 space-y-4">
            <p>
              Imagine a congregation where asking for help is as natural as offering it. Where the retired teacher mentors the homeschool family. Where the contractor builds the widow&apos;s ramp before she even has to ask. Where skills are visible. Needs are met. And everyone serves.
            </p>
            <p>That&apos;s not a fantasy. It&apos;s what happens when you make the invisible visible.</p>
          </div>
        </ScrollReveal>

        {/* Before / After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="left">
            <div className="eden-glass p-8 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-eden-gray mb-4">The Gap: Hidden Resources</p>
              <div className="relative h-48 mb-6 flex items-center justify-center">
                {/* Scattered disconnected dots */}
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  {[
                    { cx: 45, cy: 30, r: 4, fill: '#D1D5DB' },
                    { cx: 120, cy: 80, r: 3, fill: '#D1D5DB' },
                    { cx: 200, cy: 25, r: 5, fill: '#FDB833', opacity: 0.4 },
                    { cx: 75, cy: 110, r: 4, fill: '#D1D5DB' },
                    { cx: 250, cy: 70, r: 3, fill: '#FDB833', opacity: 0.3 },
                    { cx: 160, cy: 130, r: 4, fill: '#D1D5DB' },
                    { cx: 30, cy: 75, r: 3, fill: '#D1D5DB' },
                    { cx: 270, cy: 120, r: 5, fill: '#D1D5DB' },
                  ].map((dot, i) => (
                    <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} opacity={dot.opacity || 0.4} />
                  ))}
                  <text x="185" y="18" fill="#D1D5DB" fontSize="8" fontFamily="Inter">Plumber (hidden)</text>
                  <text x="55" y="105" fill="#D1D5DB" fontSize="8" fontFamily="Inter">Counselor (unknown)</text>
                </svg>
              </div>
              <p className="text-eden-gray text-sm">Skills exist everywhere. But without visibility, they stay dormant. Needs go unmet.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <div className="eden-glass p-8 rounded-xl border-eden-tidal/20">
              <p className="text-xs uppercase tracking-widest text-eden-tidal mb-4">The Bridge: Activated Network</p>
              <div className="relative h-48 mb-6 flex items-center justify-center">
                {/* Connected dots */}
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  {/* Connections */}
                  {[
                    [45, 30, 120, 80], [120, 80, 200, 25], [200, 25, 250, 70],
                    [75, 110, 120, 80], [120, 80, 160, 130], [250, 70, 270, 120],
                    [45, 30, 75, 110], [30, 75, 75, 110], [160, 130, 270, 120],
                  ].map((line, i) => (
                    <line key={i} x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} stroke="#26A69A" strokeWidth="1" opacity="0.4" />
                  ))}
                  {/* Dots */}
                  {[
                    { cx: 45, cy: 30, r: 5, fill: '#FDB833' },
                    { cx: 120, cy: 80, r: 6, fill: '#FDB833' },
                    { cx: 200, cy: 25, r: 5, fill: '#26A69A' },
                    { cx: 75, cy: 110, r: 5, fill: '#26A69A' },
                    { cx: 250, cy: 70, r: 4, fill: '#FDB833' },
                    { cx: 160, cy: 130, r: 5, fill: '#26A69A' },
                    { cx: 30, cy: 75, r: 4, fill: '#26A69A' },
                    { cx: 270, cy: 120, r: 5, fill: '#FDB833' },
                  ].map((dot, i) => (
                    <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} opacity="0.9" />
                  ))}
                </svg>
              </div>
              <p className="text-eden-orchid text-sm">Same people. Same skills. Now connected. Needs met in hours, not weeks.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 4: HOW IT WORKS
   ============================================= */
function HowItWorksSection() {
  const steps = [
    {
      num: '1',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 40c0-8-4-12-4-16s4-8 4-8" />
          <path d="M20 40c4 0 8-2 8-2" />
          <circle cx="24" cy="12" r="4" />
        </svg>
      ),
      title: 'Set Up Your Directory',
      copy: 'We create your branded directory page in minutes. Your logo, your colors, your community\'s identity. No technical knowledge required.',
    },
    {
      num: '2',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="20" r="6" />
          <circle cx="30" cy="20" r="6" />
          <path d="M24 14v-2M24 28v2M14 20h-2M36 20h-2" />
          <line x1="18" y1="20" x2="30" y2="20" />
        </svg>
      ),
      title: 'Invite Your Members',
      copy: 'Share a simple link via email or your newsletter. Members add their name, photo, and the skills they\'re willing to share. Approval takes 30 seconds.',
    },
    {
      num: '3',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 34s-10-6-10-14a10 10 0 0 1 20 0c0 8-10 14-10 14z" />
          <path d="M20 22l2 2 4-4" />
        </svg>
      ),
      title: 'Watch Connections Happen',
      copy: 'Members search by skill, reach out directly, and start serving each other. You see all activity in your dashboard.',
    },
  ]

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid text-center mb-16">
            Three Steps. One Afternoon. A Connected Community.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-px border-t-2 border-dashed border-eden-tidal/30 z-0" />

          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="relative text-center z-10">
                <div className="relative inline-block mb-6">
                  <span className="absolute -top-4 -left-4 font-display text-6xl text-eden-marigold/20 font-bold">
                    {step.num}
                  </span>
                  <div className="relative z-10">{step.icon}</div>
                </div>
                <h3 className="font-display text-2xl font-bold text-eden-orchid mb-3">{step.title}</h3>
                <p className="text-sm text-sage leading-relaxed">{step.copy}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="text-center mt-16">
            <Link href="/get-started" className="btn-primary text-lg" style={{ padding: '1rem 3rem' }}>
              Start Free — No Credit Card Required
            </Link>
            <p className="text-xs text-sage mt-3">Setup takes 15 minutes. Unlimited members. Cancel anytime.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 5: LIVE PRODUCT PREVIEW
   ============================================= */
function ProductPreviewSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[500px] bg-eden-tidal/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid text-center mb-3">
            See It in Action
          </h2>
          <p className="text-sage text-lg text-center mb-12">
            The Village Church in Denton, Texas launched their directory in one afternoon. This is what it looks like.
          </p>
        </ScrollReveal>

        {/* Mockup */}
        <ScrollReveal direction="up" delay={200}>
          <div className="eden-glass glow-tidal p-6 md:p-8 rounded-2xl">
            {/* Mock header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-display text-xl font-bold text-eden-orchid">Village Church Directory</p>
                <p className="text-xs text-sage">Denton, Texas</p>
              </div>
              <span className="text-xs bg-eden-marigold text-eden-jungle font-bold px-3 py-1 rounded-full">63 Members</span>
            </div>

            {/* Mock search */}
            <div className="bg-eden-jungle/50 rounded-lg px-4 py-3 mb-4 border border-eden-tidal/20">
              <p className="text-sm text-eden-gray/50">Search skills, names, or specialties...</p>
            </div>

            {/* Mock filter pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['All Skills', 'Plumber', 'Counselor', 'Teacher', 'Contractor', 'CPA'].map((skill, i) => (
                <span key={skill} className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${i === 0 ? 'bg-eden-marigold text-eden-jungle' : 'bg-eden-lush/60 text-eden-gray border border-eden-tidal/20'}`}>
                  {skill}
                </span>
              ))}
            </div>

            {/* Mock member grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'Sarah Mitchell', title: 'Licensed Counselor', skills: ['Counseling', 'Family'], featured: true },
                { name: 'James Rodriguez', title: 'Master Plumber', skills: ['Plumbing', 'Repair'], available: true },
                { name: 'Maria Chen', title: 'CPA', skills: ['Accounting', 'Tax Prep'] },
                { name: 'David Thompson', title: 'General Contractor', skills: ['Construction', 'Roofing'], featured: true },
                { name: 'Lisa Park', title: 'Music Teacher', skills: ['Piano', 'Voice'] },
                { name: 'Robert Wilson', title: 'Electrician', skills: ['Electrical', 'Wiring'], available: true },
              ].map((member) => (
                <div key={member.name} className="bg-eden-jungle/40 rounded-xl p-3 border border-eden-tidal/10 hover:border-eden-tidal/30 transition">
                  <div className="w-full h-20 bg-eden-lush/60 rounded-lg mb-2 flex items-center justify-center text-2xl text-eden-marigold/30 font-display font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <p className="font-display text-sm font-bold text-eden-orchid truncate">{member.name}</p>
                  <p className="text-xs text-sage truncate">{member.title}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {member.skills.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-eden-tidal/20 text-eden-tidal">{s}</span>
                    ))}
                  </div>
                  {member.featured && <span className="text-[10px] text-eden-marigold mt-1 block">★ Featured</span>}
                  {member.available && <span className="text-[10px] text-eden-tidal mt-1 block">● Available</span>}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Testimonial */}
        <ScrollReveal delay={300}>
          <div className="eden-glass p-6 md:p-8 rounded-xl mt-8 border-l-4 border-eden-marigold">
            <p className="text-lg text-eden-orchid leading-relaxed italic mb-4">
              &ldquo;We discovered 47 skills we didn&apos;t know existed in our congregation. In the first week alone, three members connected to help each other with real needs. This is what the church is supposed to be.&rdquo;
            </p>
            <p className="text-sm text-sage">
              — <strong className="text-eden-orchid">Pastor David Mitchell</strong>, The Village Church, Denton TX
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="text-center mt-8">
            <Link href="/directory/village-church" className="text-eden-marigold font-medium hover:underline group">
              Explore the Live Directory <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 6: THE TRUST SYSTEM
   ============================================= */
function TrustSection() {
  const tiers = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 8l18 8v16c0 12-18 24-18 24S14 44 14 32V16l18-8z" />
          <polyline points="24 32 30 38 40 28" />
        </svg>
      ),
      title: 'We Verify',
      copy: 'Identity check. Background screening. License verification for professionals. Insurance documentation for service providers. Nobody gets listed without meeting these standards.',
      badge: 'Required for every listing',
      accent: 'eden-tidal',
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#FDB833" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="26" r="8" />
          <path d="M38 50s-6-4-14-4-14 4-14 4" />
          <path d="M36 28l4 4 8-8" />
        </svg>
      ),
      title: 'Your Community Endorses',
      copy: 'Real people from real communities vouch for this person. At least one verified community member has endorsed their skill and character.',
      badge: 'Builds trust signals',
      accent: 'eden-marigold',
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#D90368" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="32,6 39,20 54,22 43,33 46,48 32,40 18,48 21,33 10,22 25,20" />
        </svg>
      ),
      title: 'Specialty Designations (Earned)',
      copy: 'First Responder Specialist. Family Season Advisor. Community Impact Partner. Local Steward. These badges show someone has gone deeper.',
      badge: 'Earned through activity',
      accent: 'eden-hibiscus',
    },
  ]

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid text-center mb-3">
            How TSI Builds Trust
          </h2>
          <p className="text-sage text-lg text-center mb-16">
            Every listing goes through three levels of verification. So leaders can trust what they find.
          </p>
        </ScrollReveal>

        <div className="space-y-6">
          {tiers.map((tier, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="eden-glass p-8 rounded-xl">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="shrink-0">{tier.icon}</div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-eden-orchid mb-2">{tier.title}</h3>
                    <p className="text-sm text-eden-gray leading-relaxed mb-3">{tier.copy}</p>
                    <span className={`text-xs px-3 py-1 rounded-full bg-${tier.accent}/20 text-${tier.accent}`}>
                      {tier.badge}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 7: SEVEN STOREFRONTS
   ============================================= */
function StorefrontsSection() {
  const storefronts = [
    { name: 'Public TSI Platform', desc: 'Anyone can search unfiltered. Professional services, trades, makers, nonprofits — all organized by skill.', color: '#26A69A', tag: 'Community' },
    { name: 'Church Partner Pages', desc: 'Congregation skills + nonprofits. Every church gets their own branded directory page.', color: '#D90368', tag: 'Faith' },
    { name: 'Blue Collar Family Office', desc: 'First responders — firefighters, EMTs, police, military. Specialists who understand the first responder life.', color: '#FDB833', tag: 'Service' },
    { name: 'Opus Familiae Network', desc: 'Family season advisors for life transitions. Guidance when families need it most.', color: '#4A7C6F', tag: 'Family' },
    { name: 'Curate Learning', desc: 'Tutors, mentors, education specialists. Connecting families with trusted educators.', color: '#FDFDFF', tag: 'Education' },
    { name: 'Made Local', desc: 'Artisans, farmers, makers. Verified local producers of goods, crafts, food, and services.', color: '#A44A3F', tag: 'Local' },
  ]

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid text-center mb-3">
            One Engine, Seven Storefronts
          </h2>
          <p className="text-sage text-lg text-center mb-16">
            TSI powers community directories across every kind of organization and every kind of need.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {storefronts.map((sf, i) => (
            <ScrollReveal key={i} delay={i * 100} direction="fade">
              <div className="eden-glass p-6 rounded-xl hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sf.color }} />
                  <span className="text-xs text-eden-gray uppercase tracking-wide">{sf.tag}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-eden-orchid mb-2">{sf.name}</h3>
                <p className="text-sm text-eden-gray leading-relaxed">{sf.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 7th: Municipal */}
        <ScrollReveal delay={600}>
          <div className="eden-glass p-6 rounded-xl mt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-mist" />
              <span className="text-xs text-eden-gray uppercase tracking-wide">Government</span>
            </div>
            <h3 className="font-display text-lg font-bold text-eden-orchid mb-2">Municipal Resource Hub</h3>
            <p className="text-sm text-eden-gray leading-relaxed">City and county community resources. Nonprofits, crisis services, government programs — searchable by category and location.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={700}>
          <p className="text-center text-sm text-sage mt-10 max-w-xl mx-auto">
            Each storefront has different branding and UI, but all run on the same TSI engine. One vetting system. One API. One infrastructure layer.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 8: FOR COMMUNITIES VS PROVIDERS
   ============================================= */
function ValuePropSection() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* For Communities */}
        <ScrollReveal direction="left">
          <div className="eden-glass p-8 rounded-xl h-full">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-eden-orchid mb-2">
              For Church Leaders &amp; Community Organizers
            </h3>
            <p className="text-sage mb-6">Activate the gifts sitting in your pews.</p>
            <ul className="space-y-4 mb-8">
              {[
                ['Discover Hidden Skills', 'See exactly what your members can do. No more guessing.'],
                ['Build Stronger Connections', 'Members find each other and serve naturally.'],
                ['Free to Start', 'No credit card required. No time limit on the free tier.'],
                ['Branded for Your Community', 'Your logo, your name, your colors.'],
                ['Safe & Controlled', 'You approve every member before they appear.'],
                ['Data You Own', 'Your directory, your data. Export anytime.'],
              ].map(([title, desc]) => (
                <li key={title} className="border-l-2 border-eden-marigold pl-4">
                  <p className="text-sm font-bold text-eden-orchid">{title}</p>
                  <p className="text-xs text-eden-gray">{desc}</p>
                </li>
              ))}
            </ul>
            <Link href="/get-started" className="btn-primary text-sm">
              Start Free for Your Community
            </Link>
          </div>
        </ScrollReveal>

        {/* For Providers */}
        <ScrollReveal direction="right" delay={100}>
          <div className="eden-glass p-8 rounded-xl h-full">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-eden-orchid mb-2">
              For Service Providers &amp; Skilled Professionals
            </h3>
            <p className="text-sage mb-6">Get discovered by the communities that trust you.</p>
            <ul className="space-y-4 mb-8">
              {[
                ['Get Found', 'Appear in communities where you already live and work.'],
                ['Earn Endorsements', 'Real people vouching for your work. Real trust.'],
                ['Free Listing', 'No upfront cost to create a profile.'],
                ['Premium Visibility', 'Upgrade to premium to be featured prominently.'],
                ['Lead Tracking', 'See who\'s contacting you and what they need.'],
                ['Three-Layer Opportunity', 'Services → Community Leader → Potential Wealth Client.'],
              ].map(([title, desc]) => (
                <li key={title} className="border-l-2 border-eden-tidal pl-4">
                  <p className="text-sm font-bold text-eden-orchid">{title}</p>
                  <p className="text-xs text-eden-gray">{desc}</p>
                </li>
              ))}
            </ul>
            <Link href="/for-providers" className="btn-secondary text-sm">
              Create a Free Provider Profile
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 9: HORMOZI VALUE STACK
   ============================================= */
function ValueStackSection() {
  const items = [
    { name: 'Branded community directory', value: '$500/yr' },
    { name: 'Unlimited member profiles', value: '$300/yr' },
    { name: 'Skill search & filtering', value: '$200/yr' },
    { name: 'Admin dashboard & analytics', value: '$400/yr' },
    { name: 'Member approval workflow', value: '$200/yr' },
    { name: 'SEO-optimized public listing', value: '$300/yr' },
    { name: 'Email notifications', value: '$100/yr' },
  ]

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-lg mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid mb-12">
            Everything You Need to Connect Your Community
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="eden-glass rounded-xl overflow-hidden glow-marigold">
            <div className="p-6 border-b border-eden-tidal/10">
              <div className="flex justify-between text-xs text-sage uppercase tracking-widest font-bold mb-4">
                <span>What You Get</span>
                <span>Value</span>
              </div>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-eden-orchid">{item.name}</span>
                    <span className="text-eden-gray">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-b border-eden-tidal/10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-eden-marigold">Total Value:</span>
                <span className="text-xl font-bold text-eden-marigold value-strikethrough">$2,000/yr</span>
              </div>
            </div>

            <div className="p-6 border-b border-eden-tidal/10 bg-eden-jungle/30">
              <p className="text-xs text-sage uppercase tracking-wide mb-1">Your Price (Growth Plan)</p>
              <p className="font-display text-4xl font-bold text-eden-marigold">$348<span className="text-lg text-eden-gray font-normal">/yr</span></p>
              <p className="text-sm text-eden-gray mt-1">That&apos;s $29/mo</p>
            </div>

            <div className="p-6">
              <p className="text-xs text-sage uppercase tracking-wide mb-1">Or Start Free</p>
              <p className="font-display text-2xl font-bold text-eden-tidal">$0</p>
              <p className="text-xs text-sage mt-1">No time limit</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-sage italic text-sm mt-8 mb-8 max-w-md mx-auto">
            &ldquo;The free tier has no time limit. Upgrade when you&apos;re ready. No credit card required to start. Cancel your subscription anytime.&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started" className="btn-primary">Start Free</Link>
            <Link href="/pricing" className="btn-secondary">View Full Pricing</Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 10: OBJECTION HANDLING
   ============================================= */
function ObjectionsSection() {
  const objections = [
    {
      q: 'We already have a church directory.',
      a: 'Photo directories show faces. This shows gifts. Knowing someone\'s name is nice. Knowing they\'re a licensed plumber when your baptistry is leaking — that\'s stewardship.',
    },
    {
      q: 'Our members aren\'t tech-savvy.',
      a: 'If they can fill out a Google Form or join a group text, they can join your directory. No app to download. No account to create. Just a name, a photo, and the skills they\'re willing to share.',
    },
    {
      q: 'We\'re a small church — do we really need this?',
      a: 'Small churches benefit most. In a church of 80 members, the odds that someone has exactly the skill another member needs are surprisingly high. Plus, TSI is free to start.',
    },
    {
      q: 'What about privacy?',
      a: 'Members control what they share. Your directory can be public or private. You approve every profile before it goes live. We never share data with third parties.',
    },
    {
      q: 'How is this different from a Facebook group?',
      a: 'Facebook buries posts in an algorithm. Your directory is searchable, organized by skill, always available. It\'s a living resource, not a feed that disappears.',
    },
    {
      q: 'What if someone misrepresents their skills?',
      a: 'That\'s why community endorsements matter. Someone vouching for this person creates accountability. Plus, your admin dashboard shows all activity. You\'re in control.',
    },
  ]

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-bold text-eden-orchid text-center mb-12">
            Real Questions Answered
          </h2>
        </ScrollReveal>

        <div className="space-y-3">
          {objections.map((obj, i) => (
            <ScrollReveal key={i} delay={i * 75} direction="fade">
              <details className="eden-glass rounded-xl group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-5 text-eden-orchid font-display font-bold">
                  &ldquo;{obj.q}&rdquo;
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-eden-gray group-open:rotate-180 transition-transform shrink-0 ml-4">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 border-l-4 border-eden-marigold ml-5">
                  <p className="text-sage text-sm leading-relaxed">{obj.a}</p>
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 11: FINAL CTA
   ============================================= */
function FinalCtaSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-eden-tidal/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-eden-orchid mb-4">
            Your Congregation&apos;s Greatest Resource Is Already Sitting in the Pews.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="text-xl md:text-2xl text-sage mb-10">Help them find each other.</p>
        </ScrollReveal>
        <ScrollReveal delay={400}>
          <Link href="/get-started" className="btn-primary text-lg inline-block" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
            Bring TSI to Your Community — Free
          </Link>
          <p className="text-xs text-sage mt-4">Setup takes 15 minutes. No credit card required.</p>
          <p className="text-xs text-sage mt-2 italic flex items-center justify-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Your data is yours. Always.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* =============================================
   SECTION 12: FOOTER
   ============================================= */
function EnhancedFooter() {
  return (
    <footer className="border-t border-eden-tidal/10 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About */}
          <div>
            <p className="font-display font-bold text-eden-marigold mb-1">The Stewardship Initiative</p>
            <p className="text-sm text-sage mb-2">The Community Trust Engine</p>
            <p className="text-xs text-eden-gray">Making invisible networks visible.</p>
            <p className="text-xs text-sage mt-2">A Simpli-FI Venture</p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-bold text-eden-orchid mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm text-eden-gray">
              <li><Link href="/directory/village-church" className="hover:text-eden-marigold transition">Directory Demo</Link></li>
              <li><Link href="/pricing" className="hover:text-eden-marigold transition">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-eden-marigold transition">Blog</Link></li>
              <li><Link href="/get-started" className="hover:text-eden-marigold transition">Get Started</Link></li>
              <li><Link href="/for-providers" className="hover:text-eden-marigold transition">For Providers</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-sm font-bold text-eden-orchid mb-3">Resources</p>
            <ul className="space-y-2 text-sm text-eden-gray">
              <li><Link href="/for-churches" className="hover:text-eden-marigold transition">For Churches</Link></li>
              <li><Link href="/for-first-responders" className="hover:text-eden-marigold transition">First Responders</Link></li>
              <li><Link href="/for-nonprofits" className="hover:text-eden-marigold transition">For Nonprofits</Link></li>
              <li><Link href="/community-programs" className="hover:text-eden-marigold transition">Programs</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterSignup />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-eden-tidal/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-eden-gray/60">
          <p>&copy; {new Date().getFullYear()} The Stewardship Initiative. All rights reserved.</p>
          <p>Made with conviction in Denton, Texas</p>
          <p>Part of the Simpli-FI Ecosystem</p>
        </div>
      </div>
    </footer>
  )
}

/* =============================================
   HOMEPAGE
   ============================================= */
export default function HomePage() {
  return (
    <div className="bg-eden-jungle text-eden-orchid">
      <HeroSection />
      <ProblemSection />
      <VisionSection />
      <HowItWorksSection />
      <ProductPreviewSection />
      <TrustSection />
      <StorefrontsSection />
      <ValuePropSection />
      <ValueStackSection />
      <ExploreSection />
      <ObjectionsSection />
      <FinalCtaSection />
      <EnhancedFooter />
    </div>
  )
}
