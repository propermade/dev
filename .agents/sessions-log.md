## 2026-11-25 — Fix dev StyleX error, add GitHub Pages deploy

<!-- session-memory: session=f6949b97-f2c0-48be-8aad-186631e96897 kind=agent at=1795573819 -->

- vite.config.ts: exclude @propermade/core and @astryxdesign/core from optimizeDeps (client + SSR) so the StyleX plugin compiles their uncompiled stylex.create calls; this was the cause of the dev-time runtime error and BABEL size warning.
- Added .github/workflows/pages.yml, public/CNAME (propermade.dev), public/.nojekyll. SSG (prerender) kept as is; `bun run build` passes.
- Not verified: `bun run dev` in a browser (sandbox blocks port binding). Needs Pages source = GitHub Actions and a PACKAGES_TOKEN_TOKEN secret. README still describes the old link:../ui setup.

## 2026-11-25 07:04 UTC — session end (auto) · branch `ci/deploy-env`

<!-- session-memory: session=f6949b97-f2c0-48be-8aad-186631e96897 kind=auto-end at=1795590245 -->

- Changed (2): `.github/workflows/pages.yml`, `.npmrc`
- Commits: `88b7240 ci: remove GITHUB_ prefix from env secret`

## 2026-11-25 — Build /work project list

<!-- session-memory: session=5ba49ec7-aa9b-423d-a5e6-cdfd29b1e4ff kind=agent at=1795625948 -->

- New src/content/work.ts (two projects from ui/ai content, placeholder media) and rewritten src/routes/work.tsx (filter, cards, per-project Screenshots/Recording/Code tabs). /work styles appended to src/styles/site.css, reusing .card/.rows/.sec-head/.btn.
- Header with theme toggle already comes from Root in router.tsx, so no extra header was added.
- Real palette is src/theme/theme.ts (green); src/design/palette.ts is stale (yellow). Don't copy from it.
- Mockup artifact: https://claude.ai/artifact/MNZCCLRi3UdeaUHoiZZeNa. Build, typecheck and content check pass; viewed in browser.
- Pending: real screenshots/recordings/code from user; src/content/ui.ts and ai.ts are now unused (not removed). Nothing committed.

## 2026-11-25 17:53 UTC — in progress, before auto context compaction (auto) · branch `ci/deploy-env`

<!-- session-memory: session=5ba49ec7-aa9b-423d-a5e6-cdfd29b1e4ff kind=auto-precompact at=1795629233 -->

- Changed (8): `.github/workflows/pages.yml`, `.npmrc`, `src/content/home.ts`, `src/content/site.ts`, `src/content/work.ts`, `src/routes/index.tsx`, `src/routes/work.tsx`, `src/styles/site.css`
- Commits: `ced593a content: update contact email`; `f835386 fix(work): keep code bar on one row and raise primary button contrast`; `3f560a2 content(work): retitle work page headline`; `0dee0a2 content: rewrite hero and about copy for a staff-plus audience`; `7d2b2da feat(work): add project list with screenshot, recording and code tabs`; `88b7240 ci: remove GITHUB_ prefix from env secret`

## 2026-11-25 — Leafline demo overhaul (ui repo)

<!-- session-memory: session=5ba49ec7-aa9b-423d-a5e6-cdfd29b1e4ff kind=agent at=1795630000 -->

- ui repo, branch feat/demo-leafline-polish, 3 commits (core vocabulary, optional AppShell toggle, demo rework). Not pushed, no PR.
- Light only; tabbed Dispatches (fixed per-status sources); Device Commands form, Failures row actions, EV Charger controls; chips via Cells.tsx; vocabulary check in demo lint.
- Pending: Pages deploy of the demo (needs router basepath + workflow, not done); finance/employer mentions in .design-sync/NOTES.md, packages/design/docs/DESIGN-WITHOUT-FIGMA.md, planning/specs/agent-auth unreviewed.

## 2026-11-25 21:23 UTC — in progress, before manual context compaction (auto) · branch `ci/deploy-env`

<!-- session-memory: session=5ba49ec7-aa9b-423d-a5e6-cdfd29b1e4ff kind=auto-precompact at=1795641799 -->

- Changed (41): `"docs/canopy/Screen Recording 2026-11-25 at 3.13.37\342\200\257PM.mov"`, `"docs/central/Screen Recording 2026-11-25 at 3.02.38\342\200\257PM.mov"`, `.github/workflows/pages.yml`, `.npmrc`, `docs/canopy/S01_overview_top.jpg`, `docs/canopy/S02_overview_latest_activity.jpg`, `docs/canopy/S04_transactions_top.jpg`, `docs/canopy/S05_transactions_memo_expanded.jpg`, `docs/canopy/S06_funds_top.jpg`, `docs/canopy/S07_funds_active_commitments.jpg` (+31 more)
- Commits: `ced593a content: update contact email`; `f835386 fix(work): keep code bar on one row and raise primary button contrast`; `3f560a2 content(work): retitle work page headline`; `0dee0a2 content: rewrite hero and about copy for a staff-plus audience`; `7d2b2da feat(work): add project list with screenshot, recording and code tabs`; `88b7240 ci: remove GITHUB_ prefix from env secret`

## 2026-11-25 23:17 UTC — session end (auto) · branch `ci/deploy-env`

<!-- session-memory: session=5ba49ec7-aa9b-423d-a5e6-cdfd29b1e4ff kind=auto-end at=1795648648 -->

- Changed (88): `.github/workflows/pages.yml`, `.npmrc`, `.vscode/settings.json`, `bun.lock`, `docs/.DS_Store`, `docs/aeo.md`, `docs/canopy/.DS_Store`, `docs/canopy/S01_overview_top.jpg`, `docs/canopy/S02_overview_latest_activity.jpg`, `docs/canopy/S04_transactions_top.jpg` (+78 more)
- Commits: `3bf8559 docs: media cleanup`; `0f16414 feat: add work content`; `ced593a content: update contact email`; `f835386 fix(work): keep code bar on one row and raise primary button contrast`; `3f560a2 content(work): retitle work page headline`; `0dee0a2 content: rewrite hero and about copy for a staff-plus audience`; `7d2b2da feat(work): add project list with screenshot, recording and code tabs`; `88b7240 ci: remove GITHUB_ prefix from env secret`
