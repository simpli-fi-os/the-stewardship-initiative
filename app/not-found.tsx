import Link from 'next/link'
import Header from '@/components/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-eden-jungle flex flex-col">
      <div className="px-6 pt-10">
        <Header />
      </div>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-6xl font-display font-bold text-eden-marigold mb-4">404</p>
          <h1 className="font-display text-2xl font-bold text-eden-orchid mb-3">
            Page Not Found
          </h1>
          <p className="text-eden-gray mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary text-center text-sm">
              Back to Home
            </Link>
            <Link href="/blog" className="btn-secondary text-center text-sm">
              Read Our Blog
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
