/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    // This will allow Next.js to create a standalone directory
    outputStandalone: true,
  },
  i18n: {
    // Support for internationalization based on the memories
    locales: ['en', 'ar'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
