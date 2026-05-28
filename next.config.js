/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@supabase/ssr',
      '@anthropic-ai/sdk',
      'stripe'
    ]
  }
}

module.exports = nextConfig

