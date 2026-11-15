// Next.js substitutes these public values at build time. No runtime config API is needed.
export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME!,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION!,
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN!,
  siteId: process.env.JAMSTACKS_SITE!,
  embedUrl: process.env.NEXT_PUBLIC_JAMSTACKS_EMBED_URL!,
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL!,
};
