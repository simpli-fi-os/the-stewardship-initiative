import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Find Resources',
  description: 'Actively participate in the body of Christ. Connect with the skills and resources within your church family.',
}

export default function FindResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
      <Header />

      <main id="main-content" className="w-full max-w-4xl mx-auto mt-16">
        {/* Hero */}
        <ScrollReveal>
          <section className="text-center mb-20">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-eden-orchid mb-6">
              Actively Participate in the<br />Body of Christ.
            </h1>
            <p className="text-lg sm:text-xl text-eden-gray max-w-3xl mx-auto mb-10">
              Connecting with others is how we live as the body of Christ. This is an
              invitation to engage the skills and resources within our church family,
              strengthening the entire community.
            </p>
            <Link href="/directory/village-church" className="btn-primary text-xl py-4 px-10">
              Access The Village Directory
            </Link>
          </section>
        </ScrollReveal>

        {/* Mission Section */}
        <ScrollReveal>
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-eden-orchid">
                An Opportunity to <span className="text-eden-hibiscus">Love People</span>
              </h2>
              <p className="mt-4 text-lg text-eden-gray">
                At The Village, our mission is to love God, love people, and make disciples.
                Engaging with this directory is a practical way to live out that mission.
              </p>
            </div>
            <div className="eden-card eden-card-interactive">
              <blockquote className="scripture mb-4">
                <p className="text-xl">
                  &ldquo;Bear one another&apos;s burdens, and so fulfill the law of Christ.&rdquo;
                </p>
                <footer className="text-right mt-2 text-eden-marigold">
                  - Galatians 6:2 (ESV)
                </footer>
              </blockquote>
              <p className="text-eden-gray mt-6">
                Your need for a helping hand, a professional skill, or simple advice is
                the very thing that allows another member to be a good steward of the
                gifts God has given them. This is how we build a true gospel-centered
                community.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Stewardship Section */}
        <ScrollReveal>
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-eden-orchid">
                Stewards of God&apos;s <span className="text-eden-tidal">Varied Grace</span>
              </h2>
              <p className="mt-4 text-lg text-eden-gray">
                Every connection made strengthens our church family for God&apos;s glory.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="eden-card eden-card-interactive flex flex-col justify-center">
                <blockquote className="scripture mb-4">
                  <p className="text-xl">
                    &ldquo;As each has received a gift, use it to serve one another,
                    as good stewards of God&apos;s varied grace.&rdquo;
                  </p>
                  <footer className="text-right mt-2 text-eden-marigold">
                    - 1 Peter 4:10 (ESV)
                  </footer>
                </blockquote>
                <p className="mt-4 text-eden-gray">
                  This directory helps uncover the incredible gifts that already
                  exist right here within our church body.
                </p>
              </div>
              <div className="eden-card eden-card-interactive flex flex-col justify-center bg-gray-900/20">
                <h3 className="font-display text-2xl font-bold text-eden-orchid mb-4">
                  From The Village&apos;s Vision:
                </h3>
                <p className="text-eden-gray">
                  &ldquo;We desire to see the gospel not only be proclaimed but also
                  be demonstrated through our lives. We want to be a people who are
                  not only hearers of the Word but also doers of it.&rdquo;
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <section className="text-center my-16 py-16 bg-eden-hibiscus rounded-xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-eden-jungle mb-4">
              Let Your Church Family In.
            </h2>
            <p className="text-lg text-eden-orchid max-w-2xl mx-auto mb-8">
              The skills, talents, and resources of your brothers and sisters at
              The Village are waiting to help. Take the next step to connect.
            </p>
            <Link href="/directory/village-church" className="btn-primary text-xl py-4 px-10">
              Access The Village Directory
            </Link>
          </section>
        </ScrollReveal>
      </main>

      <Footer backLink="/" backLabel="Back to Home" />
    </div>
  )
}
