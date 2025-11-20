/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['example.com', 'cdn.example.com'], // add the domains used in your course thumbnails
  },
  output: 'standalone',
};

export default nextConfig;
