import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Onboard Your Community',
  description: 'Launch your church skills directory in minutes. Connect your congregation with the talents already sitting in the pews.',
}

export default function OnboardPage() {
  return (
    <div className="bg-white text-gray-900 antialiased min-h-screen">
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            The Stewardship Initiative
          </Link>
          <a href="#setup" className="bg-gray-800 text-white font-semibold py-2 px-5 rounded-lg shadow-sm hover:bg-gray-700 transition-colors">
            Get Started
          </a>
        </nav>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="py-24 px-4 bg-white text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 font-body">
              Your Community&apos;s Greatest Resource is Already Here.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600">
              Within your church, there&apos;s a wealth of talent, wisdom, and professional skill.
              Lawyers, doctors, accountants, tradespeople, and counselors sit in your pews every week.
              The Stewardship Initiative is the bridge to connect them.
            </p>
            <a href="#setup" className="mt-8 inline-block bg-gray-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
              Onboard Your Community
            </a>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              The Connection Gap: Unlocking Hidden Potential
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Even in the most vibrant communities, there&apos;s a natural gap between those with
              skills and those with needs. Good intentions get lost in the noise of daily life.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { stat: '76%', desc: 'of people believe it\'s important to volunteer their skills.', source: 'Deloitte Volunteerism Survey' },
                { stat: '1 in 4', desc: 'churchgoers feel disconnected from their community.', source: 'Barna Group Study' },
                { stat: '90%', desc: 'of requests for help happen through informal, word-of-mouth networks.', source: '' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                  <p className="text-5xl font-extrabold text-gray-800">{item.stat}</p>
                  <p className="mt-2 font-semibold text-gray-700">{item.desc}</p>
                  {item.source && (
                    <p className="mt-2 text-sm text-gray-500">(Source: {item.source})</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What / Why / How */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              The Bridge: A Beautifully Simple Directory
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              TSI provides an elegant solution: a sophisticated frontend application powered by
              a simple-to-manage backend, creating a private, searchable directory for your church community.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { title: 'WHAT', body: 'A clean, private web directory where members can list their professional skills, trades, and willingness to help. Members can easily search for services they need, all within their trusted community.' },
                { title: 'WHY', body: 'To make the invisible visible. TSI empowers members to serve one another effectively, strengthens community bonds, and ensures the wealth of talent within your congregation is stewarded for the good of all.' },
                { title: 'HOW', body: 'Your church administrator manages a simple database. Members access the directory through our beautiful web app, ensuring data privacy and security for your entire congregation.' },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 Steps */}
        <section id="setup" className="py-24 px-4 bg-gray-50">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Get Started in Three Simple Steps
            </h2>
            <p className="mt-4 text-lg text-gray-600">Launch your community&apos;s directory in minutes.</p>
            <div className="mt-12 space-y-12">
              {[
                { num: '1', title: 'We Set Up Your Directory', body: 'We create a beautiful, branded directory page for your church. You own your data completely.' },
                { num: '2', title: 'Your Members Submit Profiles', body: 'Members fill out a simple form listing their skills, services, and willingness to help. No technical knowledge required.' },
                { num: '3', title: 'Your Community Connects', body: 'Share a unique link with your church members. They can browse, search, and connect, unlocking the collective power of your community.' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center text-left">
                  <div className="bg-gray-800 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {step.num}
                  </div>
                  <div className="md:ml-8 mt-4 md:mt-0">
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-gray-600">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="mailto:hunter@simpli-fi-os.com?subject=TSI%20-%20Onboard%20My%20Community"
              className="mt-16 inline-block bg-gray-800 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started — Contact Us
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto max-w-7xl py-12 px-4 text-center">
          <p>&copy; {new Date().getFullYear()} The Stewardship Initiative by Simpli-FI OS. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
