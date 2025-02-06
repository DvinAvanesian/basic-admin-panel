import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true
  },
  async headers() {
    return [
      {
        source: '/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'false' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true
      }
    ]
  }
}

export default nextConfig
