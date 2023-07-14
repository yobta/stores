/** @type {import('next').NextConfig} */
const childProcess = require('child_process')
/* eslint-disable import/order */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [],
    remarkPlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

let revision
try {
  revision = childProcess
    .execSync('git rev-parse HEAD')
    .toString()
    .trim()
    .substring(0, 5)
} catch {
  revision = (
    process.env.VERCEL_GIT_COMMIT_SHA || 'fallback_revision'
  ).substring(0, 5)
}

const plugins = [withMDX]

const nextConfig = {
  env: {
    NEXT_PUBLIC_REVISION: revision,
  },
  experimental: { esmExternals: true, mdxRs: true },
  generateBuildId: async () => revision,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = () => plugins.reduce((acc, next) => next(acc), nextConfig)
