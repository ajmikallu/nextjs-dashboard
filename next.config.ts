import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
  return [
    {
      source: '/.well-known/:path*',      // ← If browser asks for this...
      destination: '/api/not-found',      // ← Send them here instead
    },
  ];
}
};

export default nextConfig;
