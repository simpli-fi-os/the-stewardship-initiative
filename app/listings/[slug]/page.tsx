import { redirect } from 'next/navigation'

// Old listings route — redirect to new resources route
export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  redirect(`/resources/${params.slug}`)
}
