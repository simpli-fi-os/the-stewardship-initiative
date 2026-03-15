import Link from 'next/link'

export default function Footer({ backLink, backLabel }: { backLink?: string; backLabel?: string }) {
  return (
    <footer className="w-full max-w-6xl mx-auto text-center py-6 mt-auto" role="contentinfo">
      <div className="pt-6 border-t border-gray-700/50">
        {backLink ? (
          <Link
            href={backLink}
            className="text-eden-orchid font-semibold hover:text-eden-marigold underline underline-offset-4 transition-colors"
          >
            &larr; {backLabel || 'Back to Home'}
          </Link>
        ) : (
          <div className="space-y-2">
            <p className="text-eden-gray">Is your church or organization ready to connect?</p>
            <Link
              href="/onboard"
              className="text-eden-orchid font-semibold hover:text-eden-marigold underline underline-offset-4 transition-colors"
            >
              Learn More &amp; Onboard Your Community
            </Link>
          </div>
        )}
        <p className="text-eden-gray/60 text-xs mt-4">
          &copy; {new Date().getFullYear()} The Stewardship Initiative by Simpli-FI OS. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
