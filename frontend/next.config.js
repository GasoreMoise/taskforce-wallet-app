/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
      domains: ['localhost'],
      // Add any other image domains you'll use
    },
    // Enable edge runtime for API routes
    experimental: {
      serverActions: {
        allowedOrigins: ['localhost:3000']
      },
    },
    // Custom webpack configuration
    webpack: (config, { dev, isServer }) => {
      // Add any custom webpack configurations
      if (!dev && !isServer) {
        Object.assign(config.resolve.alias, {
          'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
          react: 'preact/compat',
          'react-dom/test-utils': 'preact/test-utils',
          'react-dom': 'preact/compat',
        });
      }
      return config;
    },
    // Environment variables that should be available to the client
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    // Headers for security
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains'
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            }
          ]
        }
      ];
    }
  };
  
  module.exports = nextConfig; 