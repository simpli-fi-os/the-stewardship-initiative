export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-eden-lush rounded" />
        <div className="h-4 w-64 bg-eden-lush rounded mt-2" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="eden-card p-6">
            <div className="w-10 h-10 bg-eden-jungle/50 rounded-lg mb-3" />
            <div className="h-8 w-16 bg-eden-jungle/50 rounded" />
            <div className="h-4 w-24 bg-eden-jungle/50 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="eden-card">
        <div className="space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-eden-jungle/50 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-eden-jungle/50 rounded" />
                <div className="h-3 w-24 bg-eden-jungle/50 rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
