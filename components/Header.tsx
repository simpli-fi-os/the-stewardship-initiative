import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full max-w-6xl mx-auto" role="banner">
      <Link href="/" className="group">
        <h2 className="text-xl font-bold tracking-wider text-eden-marigold group-hover:text-yellow-300 transition-colors">
          The Stewardship Initiative
        </h2>
      </Link>
      <p className="text-sm text-eden-gray">
        A{' '}
        <a
          href="https://simpli-fi-os.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition-colors"
        >
          Simpli-FI OS
        </a>{' '}
        Initiative
      </p>
    </header>
  )
}
