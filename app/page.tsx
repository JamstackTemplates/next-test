import { DarkModeToggle } from 'jamstacks';
import { SupportEmbed } from '../components/support-embed';
import { site } from '../lib/site';

export default function Home() {
  return (
    <div className="page">
      <header className="header">
        <a className="brand" href="#top" aria-label="Jamstacks test home">
          <span className="brand-mark" aria-hidden="true">j.</span>
          <span>jamstacks<span className="muted"> / next-test</span></span>
        </a>
        <div className="header-actions">
          <a className="source-link" href={site.repositoryUrl}>Source repository <span aria-hidden="true">↗</span></a>
          <DarkModeToggle />
        </div>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow"><span className="status-dot" aria-hidden="true" /> Static Next.js · GitHub Pages</p>
          <h1 id="page-title">Your static site<br />is ready.</h1>
          <p className="intro-copy">{site.description} The page is static. The support form loads independently from the Jamstacks CDN.</p>
        </section>

        <div className="test-grid">
          <section className="panel support-panel" aria-labelledby="support-heading">
            <div className="panel-heading">
              <span className="section-number">01</span>
              <div><h2 id="support-heading">Support form</h2><p>The dynamic part of this static website.</p></div>
            </div>
            <SupportEmbed />
          </section>

          <aside className="panel details-panel" aria-labelledby="website-heading">
            <div className="panel-heading">
              <span className="section-number">02</span>
              <div><h2 id="website-heading">This website</h2><p>Public configuration baked into the build.</p></div>
            </div>
            <dl className="details">
              <div><dt>Name</dt><dd>{site.name}</dd></div>
              <div><dt>Domain</dt><dd>{site.domain || 'Using the deployment URL'}</dd></div>
              <div><dt>Site ID</dt><dd><code>{site.siteId || 'Not configured'}</code></dd></div>
              <div><dt>Template</dt><dd><code>next-test</code></dd></div>
            </dl>
            <div className="test-note"><strong>Try the publishing loop</strong><p>Change the form’s text or theme in your Jamstacks portal, publish it, then reload this page. No website rebuild should be needed.</p></div>
          </aside>
        </div>
      </main>

      <footer><span>Static website. Dynamic components.</span><a href="https://jamstacks.net">jamstacks.net <span aria-hidden="true">↗</span></a></footer>
    </div>
  );
}
