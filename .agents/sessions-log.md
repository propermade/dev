
## 2026-11-25 — Fix dev StyleX error, add GitHub Pages deploy
<!-- session-memory: session=f6949b97-f2c0-48be-8aad-186631e96897 kind=agent at=1795573819 -->
- vite.config.ts: exclude @propermade/core and @astryxdesign/core from optimizeDeps (client + SSR) so the StyleX plugin compiles their uncompiled stylex.create calls; this was the cause of the dev-time runtime error and BABEL size warning.
- Added .github/workflows/pages.yml, public/CNAME (propermade.dev), public/.nojekyll. SSG (prerender) kept as is; `bun run build` passes.
- Not verified: `bun run dev` in a browser (sandbox blocks port binding). Needs Pages source = GitHub Actions and a GITHUB_PACKAGES_TOKEN secret. README still describes the old link:../ui setup.
