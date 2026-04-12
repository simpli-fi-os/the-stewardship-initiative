import { redirect } from 'next/navigation'

// Category pages now route through the search engine with category pre-filter
export default function CategoryPage({ params }: { params: { slug: string } }) {
  redirect(`/search?category=${params.slug}`)
}
