/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: Fix pre-existing type errors in categories, submit, admin pages
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thevillagechurch.imgix.net' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'kfwtxtjqpsmxpwcndude.supabase.co' },
    ],
  },
}

module.exports = nextConfig
