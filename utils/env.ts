// Environment configuration
const env = {
  // API configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://148.113.181.101:8000',
  
  // Other environment variables can be added here
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default env;
