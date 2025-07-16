// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["yourdomain.com"], // Add image CDN domains here if needed
  },
};

module.exports = nextConfig;
