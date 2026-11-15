# next-test

This is the internal static Next.js integration template for Jamstacks. Keep it small.

- Work directly in this local repository on the current branch. Do not create another workspace, worktree, or branch unless requested.
- Leave changes uncommitted and do not push unless explicitly asked.
- Production is a static export in `out/`, deployed using GitHub Pages Actions. No server routes, Server Actions, authentication, database, or Next.js production server.
- The only dynamic integration is a CDN-delivered Jamstacks support-form embed. Do not implement or fake the SaaS backend here.
- `site.config.json`, `JAMSTACKS_SITE`, and `NEXT_PUBLIC_*` values are public. Use `JAMSTACKS_SITE` for the public site identifier in local configuration and Actions variables. Never place provider tokens or publishing secrets in them.
- Preserve both project URL (`/repo/`) and custom-domain (`/`) deployment support.
- Keep the CDN embed contract documented in README.md. It is provisional until implemented by jamstacks.net.
- Shared component CSS variables use the `--jamstacks-` prefix. Host-page styles use `--page-`.
- Read the relevant installed Next.js guides in `node_modules/next/dist/docs/` before changing framework behavior.
- Validate with `npm test`, `npm run typecheck`, and `npm run build`. Changes to deployment paths also need a build with `PAGES_BASE_PATH=/next-test`.
