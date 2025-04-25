/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Removed experimental.outputStandalone as it's deprecated
  // Removed i18n configuration as it's not supported in App Router
  
  // Add rewrites to proxy API requests to the backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://148.113.181.101:8000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
