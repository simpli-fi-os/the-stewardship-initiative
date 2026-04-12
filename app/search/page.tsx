import { Metadata } from 'next'
import Footer from '@/components/Footer'
import SearchEngine from '@/components/search/SearchEngine'

export const metadata: Metadata = {
  title: 'Find Resources | The Stewardship Initiative',
  description: 'Discover trusted resources and providers in the TSI community. Search by category, location, and rating with our three-layer hybrid search engine.',
  openGraph: {
    title: 'Find Resources | The Stewardship Initiative',
    description: 'Discover trusted resources and providers in the TSI community directory.',
  },
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-eden-jungle flex flex-col">
      <main id="main-content" className="flex-1">
        <SearchEngine />
      </main>
      <Footer />
    </div>
  )
}
