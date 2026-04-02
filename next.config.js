/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thevillagechurch.imgix.net' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'ckfhtprqifukudqmfzck.supabase.co' },
      { protocol: 'https', hostname: 'kfwtxtjqpsmxpwcndude.supabase.co' },
    ],
  },
}

module.exports = nextConfig
