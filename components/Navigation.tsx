'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [findHelpOpen, setFindHelpOpen] = useState(false)
  const [findProviderOpen, setFindProviderOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  const navClasses = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path) ? 'text-eden-marigold' : 'text-eden-orchid hover:text-eden-marigold'
    }`

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-eden-jungle/80 border-b border-eden-marigold/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl font-bold tracking-widest text-eden-marigold hover:text-eden-marigold/80 transition-colors">
              TSI
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/directory-landing" className={navClasses('/directory-landing')}>
              Directory
            </Link>

            <div className="relative group">
              <button className={`${navClasses('/search')} flex items-center gap-1 cursor-pointer`}>
                Find Help
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-eden-lush border border-eden-marigold/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-0 group-hover:pt-2">
                <Link href="/search?type=resources" className="block px-4 py-3 hover:bg-eden-jungle/50 transition-colors">
                  Resource Categories
                </Link>
                <Link href="/search" className="block px-4 py-3 hover:bg-eden-jungle/50 transition-colors">
                  All Resources
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className={`${navClasses('/search')} flex items-center gap-1 cursor-pointer`}>
                Find a Provider
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-eden-lush border border-eden-marigold/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-0 group-hover:pt-2">
                <Link href="/search?type=providers" className="block px-4 py-3 hover:bg-eden-jungle/50 transition-colors">
                  Provider Categories
                </Link>
                <Link href="/search?type=providers" className="block px-4 py-3 hover:bg-eden-jungle/50 transition-colors">
                  All Providers
                </Link>
              </div>
            </div>

            <Link href="/blog" className={navClasses('/blog')}>
              Blog
            </Link>
            <Link href="/for-churches" className={navClasses('/for-churches')}>
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-eden-marigold hover:bg-eden-lush rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* CTA Button */}
          <Link
            href="/submit"
            className="hidden md:inline-block px-4 py-2 bg-eden-hibiscus hover:bg-eden-hibiscus/90 text-white font-medium rounded-lg transition-colors text-sm"
          >
            List Organization
          </Link>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-eden-marigold/20 pt-4 space-y-3">
            <Link
              href="/directory-landing"
              className="block px-4 py-2 rounded hover:bg-eden-lush transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Directory
            </Link>

            <div className="px-4">
              <button
                onClick={() => setFindHelpOpen(!findHelpOpen)}
                className="w-full text-left py-2 flex items-center justify-between font-medium text-eden-orchid hover:text-eden-marigold transition-colors"
              >
                Find Help
                <svg className={`w-4 h-4 transition-transform ${findHelpOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {findHelpOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  <Link
                    href="/search?type=resources"
                    className="block py-1 text-sm text-eden-gray hover:text-eden-marigold transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Resource Categories
                  </Link>
                  <Link
                    href="/search"
                    className="block py-1 text-sm text-eden-gray hover:text-eden-marigold transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    All Resources
                  </Link>
                </div>
              )}
            </div>

            <div className="px-4">
              <button
                onClick={() => setFindProviderOpen(!findProviderOpen)}
                className="w-full text-left py-2 flex items-center justify-between font-medium text-eden-orchid hover:text-eden-marigold transition-colors"
              >
                Find a Provider
                <svg className={`w-4 h-4 transition-transform ${findProviderOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {findProviderOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  <Link
                    href="/search?type=providers"
                    className="block py-1 text-sm text-eden-gray hover:text-eden-marigold transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Provider Categories
                  </Link>
                  <Link
                    href="/search?type=providers"
                    className="block py-1 text-sm text-eden-gray hover:text-eden-marigold transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    All Providers
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="block px-4 py-2 rounded hover:bg-eden-lush transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/for-churches"
              className="block px-4 py-2 rounded hover:bg-eden-lush transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/submit"
              className="block px-4 py-2 bg-eden-hibiscus hover:bg-eden-hibiscus/90 text-white font-medium rounded transition-colors m-4 text-center"
              onClick={() => setMobileOpen(false)}
            >
              List Organization
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
