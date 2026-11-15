import { readFileSync } from 'node:fs';
import { resolveSiteConfig } from './lib/config.mjs';

const file = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8'));
const site = resolveSiteConfig(file, process.env);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: site.basePath,
  images: { unoptimized: true },
  // Explicit allow-list: JAMSTACKS_SITE is public even without a NEXT_PUBLIC_ prefix.
  env: {
    NEXT_PUBLIC_SITE_NAME: site.name,
    NEXT_PUBLIC_SITE_DESCRIPTION: site.description,
    NEXT_PUBLIC_SITE_DOMAIN: site.domain,
    JAMSTACKS_SITE: site.siteId,
    NEXT_PUBLIC_JAMSTACKS_EMBED_URL: site.embedUrl,
    NEXT_PUBLIC_REPOSITORY_URL: site.repositoryUrl,
  },
};

export default nextConfig;
