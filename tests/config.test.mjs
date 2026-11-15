import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveSiteConfig, normalizeBasePath } from '../lib/config.mjs';

const config = {
  name: 'Test site', domain: '',
  jamstacks: { siteId: '', cdnUrl: 'https://cdn.jamstacks.net' },
};

test('an unconfigured template makes no embed request', () => {
  const site = resolveSiteConfig(config);
  assert.equal(site.embedUrl, '');
  assert.equal(site.basePath, '');
});

test('provisioning variables override the checked-in public configuration', () => {
  const site = resolveSiteConfig(config, {
    JAMSTACKS_SITE: 'site_acme-1',
    NEXT_PUBLIC_JAMSTACKS_CDN_URL: 'https://assets.acme.org/widgets/',
    NEXT_PUBLIC_SITE_DOMAIN: 'ACME.ORG',
    GITHUB_REPOSITORY: 'customer/acme.org',
    PAGES_BASE_PATH: '/acme.org/',
    PRIVATE_PUBLISH_KEY: 'must-not-leak',
  });
  assert.equal(site.embedUrl, 'https://assets.acme.org/widgets/sites/site_acme-1/embed.js');
  assert.equal(site.domain, 'acme.org');
  assert.equal(site.repositoryUrl, 'https://github.com/customer/acme.org');
  assert.equal(site.basePath, '/acme.org');
  assert.ok(!JSON.stringify(site).includes('must-not-leak'));
});

test('empty Actions variables preserve file configuration', () => {
  const site = resolveSiteConfig({ ...config, jamstacks: { ...config.jamstacks, siteId: 'from_file' } }, {
    JAMSTACKS_SITE: '', NEXT_PUBLIC_JAMSTACKS_CDN_URL: ' ',
  });
  assert.equal(site.embedUrl, 'https://cdn.jamstacks.net/sites/from_file/embed.js');
});

test('CDN configuration supports local development without allowing remote HTTP or executable URLs', () => {
  for (const origin of ['http://localhost:4100', 'http://127.0.0.1:4100', 'http://[::1]:4100']) {
    assert.doesNotThrow(() => resolveSiteConfig(config, { NEXT_PUBLIC_JAMSTACKS_CDN_URL: origin }));
  }
  for (const origin of ['http://cdn.example.com', 'javascript:alert(1)', 'https://user:secret@cdn.example.com',
    'https://cdn.example.com/?key=secret', 'https://cdn.example.com/#fragment']) {
    assert.throws(() => resolveSiteConfig(config, { NEXT_PUBLIC_JAMSTACKS_CDN_URL: origin }));
  }
});

test('site IDs cannot escape their CDN path', () => {
  for (const id of ['../another-site', 'a/b', 'site?x=y', 'site#fragment', 'site with spaces']) {
    assert.throws(() => resolveSiteConfig(config, { JAMSTACKS_SITE: id }));
  }
});

test('domains are hostnames rather than URLs or paths', () => {
  for (const domain of ['https://acme.org', 'acme.org/path', 'acme.org:8080', 'acme.org?q=x', 'user@acme.org']) {
    assert.throws(() => resolveSiteConfig(config, { NEXT_PUBLIC_SITE_DOMAIN: domain }));
  }
});

test('Pages paths support root, repository, and nested paths without URL injection', () => {
  assert.equal(normalizeBasePath('/'), '');
  assert.equal(normalizeBasePath('/next-test/'), '/next-test');
  assert.equal(normalizeBasePath('/preview/acme.org'), '/preview/acme.org');
  for (const path of ['https://acme.org', '//acme.org', '/a/../b', '/a?x=y', '/a#b']) {
    assert.throws(() => normalizeBasePath(path));
  }
});
