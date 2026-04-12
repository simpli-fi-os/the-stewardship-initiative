/**
 * Directory Layout — ensures community directory pages render with their
 * own light background, overriding the root layout's eden-jungle body.
 * DirectoryView has its own navigation banner, so the main site nav
 * still appears above but the content area is properly backgrounded.
 */
export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white min-h-screen">
      {children}
    </div>
  )
}
