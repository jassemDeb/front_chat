/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Removed experimental.outputStandalone as it's deprecated
  // Removed i18n configuration as it's not supported in App Router
}

module.exports = nextConfig
