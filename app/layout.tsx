import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://thestewardshipinitiative.org'),
  title: {
    default: 'The Stewardship Initiative',
    template: '%s | The Stewardship Initiative',
  },
  description: 'When you need help, the answer is closer than you think. TSI makes invisible community resources findable, trustworthy, and actionable.',
  openGraph: {
    title: 'The Stewardship Initiative',
    description: 'When you need help, the answer is closer than you think. TSI makes invisible community resources findable, trustworthy, and actionable.',
    url: 'https://thestewardshipinitiative.org',
    siteName: 'The Stewardship Initiative',
    images: [{ url: '/images/preview-card.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Hunter_Lott_',
    title: 'The Stewardship Initiative',
    description: 'When you need help, the answer is closer than you think. TSI makes invisible community resources findable and actionable.',
    images: ['/images/preview-card.png'],
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-eden-jungle text-eden-orchid antialiased">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
