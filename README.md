# propermade.dev

Personal portfolio. Vite 8 + React 19 + TanStack Router, prerendered to static HTML (SSG). Bun.

Needs a sibling `ui` checkout with core built (the site links `@propermade/core` from `../ui/packages/core`,
which needs the `@propermade/core/base` entry from `ui` branch `feat/core-base-entry`):

    cd ../ui && bun install && bun run generate && cd packages/core && bunx tsdown index.ts worker.ts base.ts

Then here:

    bun install
    bun run dev       # Vite dev server
    bun run build     # typecheck, client build, SSR build, prerender -> dist/client
    bun run preview

Routes live in `src/router.tsx`; add the path to `routePaths` and the route tree and the prerender picks it up.
Prerendered output is one `index.html` per route (trailing-slash URLs, as static hosts serve them).

Status: home page mock built on core; other pages are placeholders. SEO/AEO output is generated at build (`docs/aeo.md`).
Previously: scaffold only. Pages are placeholders pending approval of the page list, copy and visual direction
(see the brief, "Approval points"). Not yet done: design system wiring from `propermade/ui`, content, per-route
`<title>` on client navigation, media pipeline, a11y pass.
