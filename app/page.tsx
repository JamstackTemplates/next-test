import { DarkModeToggle } from 'jamstacks';
import { SupportEmbed } from '../components/support-embed';
import { site } from '../lib/site';

const panel = 'min-w-0 overflow-hidden rounded-2xl border border-line bg-surface';
const panelHeading = 'flex items-start gap-3.5 border-b border-line p-[21px] sm:p-[25px]';
const sectionNumber = 'pt-1 font-mono text-[11px] text-muted';
const panelTitle = 'mb-[7px] text-[17px] font-semibold tracking-[-.3px]';
const panelLede = 'text-xs leading-normal text-muted';

export default function Home() {
  return (
    <div className="mx-auto max-w-[1120px] px-[22px] sm:px-10">
      <header className="flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-line py-[18px] sm:min-h-[100px] sm:flex-nowrap sm:gap-6 sm:py-0">
        <a className="flex shrink-0 items-center gap-[9px] text-sm font-bold tracking-[-.4px] no-underline sm:gap-3 sm:text-base" href="#top" aria-label="Jamstacks test home">
          <span className="grid size-[30px] place-items-center rounded-[9px] bg-ink pb-1 text-[27px] tracking-[-2px] text-on-ink sm:size-[34px]" aria-hidden="true">j.</span>
          <span>jamstacks<span className="font-normal text-muted"> / next-test</span></span>
        </a>
        <div className="ml-auto flex items-center gap-[18px]">
          <a className="text-[11px] whitespace-nowrap no-underline sm:text-[13px]" href={site.repositoryUrl}>
            Source repository <span className="ml-0.5 sm:ml-2" aria-hidden="true">↗</span>
          </a>
          <DarkModeToggle />
        </div>
      </header>

      <main id="top">
        <section className="pt-11 pb-8 sm:pt-[68px] sm:pb-11" aria-labelledby="page-title">
          <p className="mb-6 flex items-center gap-[9px] font-mono text-[11px] tracking-[.5px] text-muted">
            <span className="size-[7px] rounded-full bg-accent shadow-[0_0_0_4px_var(--page-status-halo)]" aria-hidden="true" /> Static Next.js · GitHub Pages
          </p>
          <h1 id="page-title" className="mb-[22px] text-[clamp(42px,6vw,66px)] leading-[1.04] font-medium tracking-[-2px] sm:tracking-[-3px]">
            Your static site<br />is ready.
          </h1>
          <p className="max-w-[550px] text-sm leading-[1.7] text-muted sm:text-base">
            {site.description} The page is static. The support form loads independently from the Jamstacks CDN.
          </p>
        </section>

        <div className="grid items-start gap-[18px] sm:grid-cols-[1.15fr_1fr] sm:gap-[22px]">
          <section className={panel} aria-labelledby="support-heading">
            <div className={panelHeading}>
              <span className={sectionNumber}>01</span>
              <div><h2 id="support-heading" className={panelTitle}>Support form</h2><p className={panelLede}>The dynamic part of this static website.</p></div>
            </div>
            <SupportEmbed />
          </section>

          <aside className={panel} aria-labelledby="website-heading">
            <div className={panelHeading}>
              <span className={sectionNumber}>02</span>
              <div><h2 id="website-heading" className={panelTitle}>This website</h2><p className={panelLede}>Public configuration baked into the build.</p></div>
            </div>
            <dl className="px-[21px] py-[5px] sm:px-[25px]">
              {[
                ['Name', site.name],
                ['Domain', site.domain || 'Using the deployment URL'],
                ['Site ID', <code key="id">{site.siteId || 'Not configured'}</code>],
                ['Template', <code key="t">next-test</code>],
              ].map(([term, value]) => (
                <div key={String(term)} className="grid grid-cols-[74px_minmax(0,1fr)] gap-3.5 border-b border-line py-[15px] text-xs leading-normal last:border-0">
                  <dt className="text-muted">{term}</dt>
                  <dd className="wrap-anywhere">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mx-[25px] mt-[9px] mb-[25px] rounded-[9px] bg-note p-[17px] text-xs leading-[1.65]">
              <strong className="font-semibold">Try the publishing loop</strong>
              <p className="mt-1.5 text-muted">Change the form’s text or theme in your Jamstacks portal, publish it, then reload this page. No website rebuild should be needed.</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-[30px] flex justify-between gap-5 border-t border-line py-7 text-[11px] leading-normal text-muted sm:mt-11">
        <span>Static website. Dynamic components.</span>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-accent hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
      </footer>
    </div>
  );
}
