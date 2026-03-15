'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ConstellationCanvas from '@/components/ConstellationCanvas'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [headlineVisible, setHeadlineVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    // Reduced from 5s/7s to 2.5s/4s per audit recommendation
    const headlineTimer = setTimeout(() => setHeadlineVisible(true), 2500)
    const contentTimer = setTimeout(() => setContentVisible(true), 4000)
    return () => {
      clearTimeout(headlineTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <>
      <ConstellationCanvas />

      <div className="relative z-10 flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <div className={`stagger-item ${contentVisible ? 'visible' : ''}`}>
          <Header />
        </div>

        <main id="main-content" className="flex-grow flex items-center justify-center text-center">
          <div className="w-full max-w-4xl mx-auto">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 stagger-item ${headlineVisible ? 'visible' : ''}`}
            >
              Discover the{' '}
              <span className="font-bold text-eden-hibiscus animate-heartbeat inline-block">
                Heart
              </span>{' '}
              <br className="hidden sm:block" />
              of Your Community.
            </h1>

            <p
              className={`text-base sm:text-lg md:text-xl text-eden-orchid max-w-2xl mx-auto mb-10 stagger-item ${contentVisible ? 'visible' : ''}`}
            >
              Within every community lies a network of trusted skills and generous
              hearts. We make them visible, connecting member needs with member
              gifts, and strengthening the entire fellowship from within.
            </p>

            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 stagger-item ${contentVisible ? 'visible' : ''}`}
            >
              <Link href="/find-resources" className="btn-secondary w-full sm:w-auto text-center">
                Find Resources
              </Link>
              <Link href="/connect" className="btn-secondary w-full sm:w-auto text-center">
                Share Your Gifts
              </Link>
            </div>
          </div>
        </main>

        <div className={`stagger-item ${contentVisible ? 'visible' : ''}`}>
          <Footer />
        </div>
      </div>
    </>
  )
}
