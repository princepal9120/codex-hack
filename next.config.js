/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // node:sqlite is experimental and needs --experimental-sqlite in Node 22.
  // Tell Next.js not to bundle it so the native module is resolved at runtime.
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
