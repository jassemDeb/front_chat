/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Removed experimental.outputStandalone as it's deprecated
  // Removed i18n configuration as it's not supported in App Router
  
  // Use environment variable for API URL
  async rewrites() {
    // Load API base URL from environment variable with fallback
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://148.113.181.101:8000';
    console.log('Using API base URL:', apiBaseUrl);
    
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${apiBaseUrl}/api/:path*`,
        },
      ],
    };
  },
}

module.exports = nextConfig
