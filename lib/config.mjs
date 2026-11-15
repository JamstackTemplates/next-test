// This module runs at build time and in the Node tests, never in the browser.
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function setting(envValue, fallback) {
  return text(envValue) || text(fallback);
}

export function normalizeBasePath(value = '') {
  const path = text(value).replace(/\/+$/, '');
  if (!path) return '';
  if (!/^\/(?:[A-Za-z0-9._~-]+\/)*[A-Za-z0-9._~-]+$/.test(path) ||
      path.split('/').some(segment => segment === '.' || segment === '..')) {
    throw new Error('PAGES_BASE_PATH must be a URL path such as /next-test, not an origin or query string.');
  }
  return path;
}

export function resolveSiteConfig(config, env = {}) {
  const siteId = setting(env.JAMSTACKS_SITE, config.jamstacks?.siteId);
  if (siteId && !/^[A-Za-z0-9_-]+$/.test(siteId)) {
    throw new Error('The Jamstacks site ID must contain only letters, numbers, underscores, or hyphens.');
  }

  const cdn = new URL(setting(env.NEXT_PUBLIC_JAMSTACKS_CDN_URL, config.jamstacks?.cdnUrl) || 'https://cdn.jamstacks.net');
  const localHttp = cdn.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(cdn.hostname);
  if ((cdn.protocol !== 'https:' && !localHttp) || cdn.username || cdn.password || cdn.search || cdn.hash) {
    throw new Error('The CDN URL must use HTTPS (or HTTP on localhost), with no credentials, query, or fragment.');
  }
  const cdnUrl = cdn.toString().replace(/\/+$/, '');

  const domain = setting(env.NEXT_PUBLIC_SITE_DOMAIN, config.domain).toLowerCase();
  if (domain) {
    const parsed = new URL(`https://${domain}`);
    if (!domain.includes('.') || parsed.host !== domain || parsed.pathname !== '/' ||
        parsed.search || parsed.hash || parsed.username || parsed.password || parsed.port) {
      throw new Error('The site domain must be a hostname such as acme.org, without a scheme, port, or path.');
    }
  }

  const repository = text(env.GITHUB_REPOSITORY) || 'JamstackTemplates/next-test';
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error('GITHUB_REPOSITORY must have the form owner/repository.');
  }

  return {
    name: text(config.name) || 'Jamstacks test website',
    description: text(config.description) || 'A static Next.js website for testing Jamstacks components.',
    domain,
    siteId,
    cdnUrl,
    embedUrl: siteId ? `${cdnUrl}/sites/${siteId}/embed.js` : '',
    repositoryUrl: `https://github.com/${repository}`,
    basePath: normalizeBasePath(env.PAGES_BASE_PATH),
  };
}
