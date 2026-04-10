import SearchClient from './SearchClient'

export const metadata = {
  title: 'Search Directory',
  description: 'Search for resources and providers in the Stewardship Initiative community directory.',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid">
      <SearchClient />
    </div>
  )
}
