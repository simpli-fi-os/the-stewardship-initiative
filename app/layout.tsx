import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

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
  description: 'Within every community lies a network of trusted skills and generous hearts. We make them visible, connecting member needs with member gifts.',
  openGraph: {
    title: 'The Stewardship Initiative',
    description: 'Within every community lies a network of trusted skills and generous hearts. We make them visible, connecting member needs with member gifts.',
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
    description: 'Within every community lies a network of trusted skills and generous hearts. We make them visible.',
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
        {children}
      </body>
    </html>
  )
}
