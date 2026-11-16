# next-test

An internal Next.js template for testing Jamstacks repository provisioning, GitHub Pages deployment, and CDN-delivered components. It has one static page and one support-form mount point. It is not a customer-facing template.

## Local development

Use Node.js 24 or newer (the Pages workflow uses Node 24):

```sh
npm ci
npm run dev
```

Open http://localhost:3000. With no site ID configured, the page shows **Ready to connect** and makes no CDN embed request. No backend or credentials are needed to build or run the static website.

## Appearance

The header uses `DarkModeToggle` from the published `jamstacks` React package. It follows the device initially, then saves an explicit light/dark choice in this origin's `color-scheme` localStorage key and synchronizes other tabs. `ThemeProvider` shares the state; `ThemeScript` in the root layout applies the saved choice before the first paint. No component stylesheet is required.

Styling uses Tailwind CSS v4: the page uses utility classes such as `bg-surface text-ink`, built from the `--page-*` colour tokens; Tailwind's default palette is switched off. The page palette and inherited support-form fallback colours stay in `app/tailwind.input.css`; published component themes may override those fallbacks. The media-query fallback still follows the device without JavaScript. To resume following the device, remove the `color-scheme` localStorage key and reload.

`jamstacks/config.json` is the Jamstacks gallery manifest. Its screenshot theme strategy uses the same `prefers-color-scheme` media preference.

## Public website configuration

Edit `site.config.json`, or copy `.env.example` to `.env.local` and supply public environment overrides. Empty environment variables fall back to the file values.

```json
{
  "name": "Acme test website",
  "description": "Testing a Jamstacks support form.",
  "domain": "acme.org",
  "jamstacks": {
    "siteId": "YOUR_PUBLIC_SITE_ID",
    "cdnUrl": "https://cdn.jamstacks.net"
  }
}
```

| File setting | Local/build environment | GitHub Actions repository variable |
| --- | --- | --- |
| `name`, `description` | Edit the file | Edit the file |
| `domain` | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| `jamstacks.siteId` | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| `jamstacks.cdnUrl` | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |

All of these values are public and compiled into the website. `JAMSTACKS_SITE` is explicitly exposed by `next.config.mjs`; it does not need a `NEXT_PUBLIC_` prefix. There is no secret publishing key in this template. Future authenticated publishing jobs must use a separate GitHub Actions secret, never browser configuration. GitHub builds automatically link to the generated repository using `GITHUB_REPOSITORY`.

Configuration changes above require a website rebuild. Component appearance, labels, and behavior published to the CDN by the Jamstacks portal do **not** require a website rebuild; reload after the CDN cache interval to see them.

## CDN embed contract

This is the proposed integration boundary for the new Jamstacks service, not an already implemented backend:

```html
<div id="jamstacks-support-form" data-jamstacks-component="support-form"></div>
<script async src="https://cdn.jamstacks.net/sites/YOUR_PUBLIC_SITE_ID/embed.js"></script>
```

The template uses `next/script` to load this script after hydration, once the mount element exists. The script owns that element's contents and is responsible for loading published configuration, rendering the form, and sending submissions to the Jamstacks API. The template never fabricates a successful submission or implements a separate form.

The page reports script loading and network errors. **Script loaded** only confirms that the script was fetched and executed; it does not confirm a working form, API, or accepted submission. A non-empty site ID will attempt to fetch the embed, so until the CDN service is available, leave it empty or use a local test server with `NEXT_PUBLIC_JAMSTACKS_CDN_URL=http://localhost:4100`.

Example shared CSS tokens are declared in `app/tailwind.input.css`: `--jamstacks-font-family`, `--jamstacks-color-primary`, `--jamstacks-color-background`, `--jamstacks-color-text`, and `--jamstacks-border-radius`. The embed should honor these through inheritance (including on a shadow host) and may publish its own values. Component-specific tokens can extend these later. No React library is required on the embed side.

## GitHub Pages

1. Create a repository from this template. The Jamstacks portal will eventually perform this step and name the repository after the supplied domain, e.g. `customer/acme.org`.
2. Under **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Provisioning must enable this through GitHub's Pages API before dispatching the workflow; the ordinary workflow token does not enable Pages itself.
3. Optionally add the repository variables listed above under **Settings → Secrets and variables → Actions → Variables**.
4. Push to `main`, or run **Build and deploy to GitHub Pages** manually from Actions. Pull requests run validation and build without deploying.

The workflow reads `base_path` from `actions/configure-pages`, so assets work both at `https://OWNER.github.io/REPOSITORY/` and at a configured custom domain. No hardcoded repository name or manual asset prefix is needed. Template generation may not trigger a first deployment automatically: provisioning should configure Pages and variables, then explicitly dispatch the workflow. If you rename the default branch from `main`, update its push and pull-request filters.

For a custom domain, configure it in **Settings → Pages → Custom domain**, then create the DNS records GitHub specifies. Jamstacks provisioning should configure the Pages domain through the GitHub API; `SITE_DOMAIN` alone only sets the website's public display value. Custom Actions deployments use the Pages domain setting, not a `CNAME` file. Once GitHub issues the certificate, enable HTTPS enforcement.

References: [Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Validation

```sh
npm test
npm run typecheck
npm run build
```

`out/` is the deployable website; there is no production Node.js server. Serve it locally using any static HTTP server, for example:

```sh
python3 -m http.server 3000 --directory out
```

To check a project path locally, build with `PAGES_BASE_PATH=/next-test npm run build`, then serve `out/` mounted at `/next-test/` (not at the server root).

## End-to-end acceptance checks

- Generate two repositories from the template, with distinct site IDs.
- Confirm each deployment loads its own `/sites/{siteId}/embed.js` from the CDN.
- Submit a support request and confirm it appears only in the correct website's portal inbox.
- Publish form text/theme changes in the portal and confirm they appear without a new repository commit or Pages build.
- Block the CDN script and confirm the page reports a load failure while the static website remains available.

The last three integration checks require the Jamstacks component service, which is developed separately. This repository contains only the static host template.

## Jamstacks provisioning correlation

The Pages workflow accepts optional `provisioning_id` and names the run `Jamstacks <id>`. Jamstacks dispatches only after reviewing the generated workflow, configuring Pages and publishing the initial component. The mount includes `data-jamstacks-site` so independent sites can coexist safely on one page. The shared support runtime now exists in the Jamstacks application; local fixture and remote GitHub/R2 acceptance remain separate verification lanes. These workflow changes must be reviewed and explicitly published before real template generation can use them.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed.
Normal `npm test`, type checking, builds and the Pages workflow do not depend on it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
