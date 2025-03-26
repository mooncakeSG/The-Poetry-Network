const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: "poetry-network",
  project: "poetry-network",
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions); 