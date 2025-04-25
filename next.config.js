/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Removed experimental.outputStandalone as it's deprecated
  // Removed i18n configuration as it's not supported in App Router
  
  // Simplified proxy configuration
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: 'http://148.113.181.101:8000/api/:path*',
        },
      ],
    };
  },
}

module.exports = nextConfig
