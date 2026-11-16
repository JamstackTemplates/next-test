'use client';

import Script from 'next/script';
import { useState } from 'react';
import { site } from '../lib/site';

export function SupportEmbed() {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className="min-h-[290px] p-[21px] sm:p-[25px]">
      {!site.embedUrl ? (
        <div className="rounded-[10px] border border-dashed border-line bg-inset p-6">
          <span className="mb-[18px] grid size-[30px] place-items-center rounded-lg border border-line bg-surface text-[21px] text-accent" aria-hidden="true">+</span>
          <h3 className="mb-2.5 text-base font-medium">Ready to connect</h3>
          <p className="text-[13px] leading-[1.7] text-muted">Set the public site ID in <code>site.config.json</code> or the <code>JAMSTACKS_SITE</code> environment variable, then rebuild.</p>
          <p className="mt-3.5 text-[11px] leading-[1.7] text-muted">No embed request is made until a site ID is configured.</p>
        </div>
      ) : (
        <>
          <p className={`mb-4 text-[13px] leading-[1.6] ${status === 'error' ? 'text-danger' : 'text-accent'}`} role="status" aria-live="polite">
            {status === 'loading' && 'Loading the CDN embed…'}
            {status === 'loaded' && 'Embed script loaded. Form rendering and submission are handled by the component.'}
            {status === 'error' && 'The embed script could not be loaded. Check that the site is published and the CDN URL is reachable, then reload.'}
          </p>
          <div className="mb-6 text-xs leading-[1.7]"><span className="block text-muted">Script source</span><code>{site.embedUrl}</code></div>
        </>
      )}

      {/* The CDN script owns the contents of this element. Keep React children out of it. */}
      <div id="jamstacks-support-form" data-jamstacks-component="support-form" data-jamstacks-site={site.siteId} />

      {site.embedUrl && (
        <Script
          id="jamstacks-embed"
          src={site.embedUrl}
          strategy="afterInteractive"
          onReady={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  );
}
