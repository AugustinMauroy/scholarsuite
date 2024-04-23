/** @type {import('next').NextConfig} */
const nextConfig = {
  // need to be test on CI but not on building of the app
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
