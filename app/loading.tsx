export default function RootLoading() {
  return (
    <div className="min-h-screen bg-eden-jungle flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-eden-marigold/30 border-t-eden-marigold rounded-full animate-spin" />
        <p className="text-eden-gray text-sm mt-4">Loading...</p>
      </div>
    </div>
  )
}
