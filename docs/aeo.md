# Answer-engine optimisation (AEO) notes

What the build does, and what is a judgement call. Everything is generated from `src/content/` and `src/seo.ts`
by `scripts/prerender.ts`, so metadata cannot drift from the pages.

## What ships

| Item                                                                      | Where                       | Why                                                                                                 |
| ------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------- |
| Prerendered HTML per route                                                | `dist/client/**/index.html` | Answer engines and crawlers read the HTML. Content that needs JavaScript to appear is often missed. |
| Unique `<title>` and meta description                                     | `headFor()`                 | Quoted and summarised by search and answer engines.                                                 |
| Canonical URL                                                             | `headFor()`                 | One URL per page, trailing slash.                                                                   |
| Open Graph and Twitter tags                                               | `headFor()`                 | Link previews.                                                                                      |
| JSON-LD (`Person`, `WebSite`, `ProfilePage`, `WebPage`, `BreadcrumbList`) | `jsonLd()`                  | Gives machines the entity: who, what role, where else they appear (`sameAs`). Public facts only.    |
| `sitemap.xml`                                                             | build output                | Discovery.                                                                                          |
| `robots.txt` with named AI crawlers                                       | `crawlers` in `src/seo.ts`  | Explicit per-bot policy, split into retrieval and training.                                         |
| `llms.txt`                                                                | build output                | A plain-text map of the site for LLM tools.                                                         |

## Judgement calls for the owner

1. **Crawler policy.** All AI crawlers are allowed. Retrieval bots (live answers, citations) are the point of AEO.
   Training bots (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) are optional: set `allow: false`
   in `crawlers` to opt out of training and keep answer-engine visibility. `robots.txt` is advisory.
2. **`llms.txt` is a proposal, not a standard.** Major engines have not confirmed they use it. It is cheap and
   generated, so it stays, but do not expect measurable lift from it.
3. **No FAQ schema.** Google limits FAQ rich results, and invented Q&A does not help a personal site.
4. **No `SoftwareSourceCode` schema** until the `ui` and `ai` repos are public. Add it with the repo links then.
5. **Domain.** `siteUrl` assumes `https://propermade.dev`. Change it in `src/seo.ts` if that differs.

## Content practices that matter more than markup

- Answer first: each page opens with a one-sentence statement of what it is, in third person where it is
  quoted (`site.summary`).
- One clear claim per section heading, written as plain statements an engine can lift.
- Facts consistent everywhere: name, title, employers and dates must match the résumé and LinkedIn.
- Only public figures. `bun run check:content` fails the build on the DriveWealth figures the brief rules out.
- Add a visible "last updated" line to each page once real copy lands, and update `dateModified` in the JSON-LD.
- An OG image (1200x630) is not generated yet. Add `public/og.png` and the `og:image` tag once the visual
  direction is approved.

## Checking it

    bun run build
    # view-source on dist/client/ui/index.html, then paste the JSON-LD into
    # https://validator.schema.org and check robots.txt / sitemap.xml by eye
