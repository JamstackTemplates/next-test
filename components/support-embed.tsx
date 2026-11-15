'use client';

import Script from 'next/script';
import { useState } from 'react';
import { site } from '../lib/site';

export function SupportEmbed() {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className="embed-region">
      {!site.embedUrl ? (
        <div className="embed-message">
          <span className="message-symbol" aria-hidden="true">+</span>
          <h3>Ready to connect</h3>
          <p>Set the public site ID in <code>site.config.json</code> or the <code>JAMSTACKS_SITE</code> environment variable, then rebuild.</p>
          <p className="small-copy">No embed request is made until a site ID is configured.</p>
        </div>
      ) : (
        <>
          <p className={`embed-status ${status === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
            {status === 'loading' && 'Loading the CDN embed…'}
            {status === 'loaded' && 'Embed script loaded. Form rendering and submission are handled by the component.'}
            {status === 'error' && 'The embed script could not be loaded. Check that the site is published and the CDN URL is reachable, then reload.'}
          </p>
          <div className="embed-address"><span>Script source</span><code>{site.embedUrl}</code></div>
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
