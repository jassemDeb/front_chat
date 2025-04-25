/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Removed experimental.outputStandalone as it's deprecated
  // Removed i18n configuration as it's not supported in App Router
  
  // Update proxy configuration to avoid redirect loops
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://148.113.181.101:8000/api/:path*',
          basePath: false,
        },
      ],
    };
  },
}

module.exports = nextConfig
