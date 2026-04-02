export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-eden-jungle">
      <div className="px-6 pt-10 max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="h-6 w-48 bg-eden-lush rounded animate-pulse" />
        <div className="h-3 w-32 bg-eden-lush rounded mt-2 animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-10 w-96 bg-eden-lush rounded mx-auto animate-pulse" />
          <div className="h-5 w-64 bg-eden-lush rounded mx-auto mt-4 animate-pulse" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="eden-card animate-pulse">
              <div className="h-4 w-20 bg-eden-jungle/50 rounded-full mb-3" />
              <div className="h-6 w-full bg-eden-jungle/50 rounded mb-2" />
              <div className="h-4 w-3/4 bg-eden-jungle/50 rounded mb-4" />
              <div className="h-3 w-32 bg-eden-jungle/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
