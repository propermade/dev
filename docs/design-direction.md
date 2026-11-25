# Design direction: ink, paper, signal

Extends the core theme (`@propermade/core`) with the site's own color, type and motion. Core supplies the
theme provider, mode toggle and Space Grotesk; everything else here is custom CSS in `src/styles/site.css`.

## color

Source of truth: `src/theme/theme.ts`. `scripts/build-theme.ts` (`bun run theme`) writes the CSS custom properties and **fails the
build** when a pair drops below its contrast floor, so the palette enforces its own rules.

| Token    | Light           | Dark          | Use                                                                                           |
| -------- | --------------- | ------------- | --------------------------------------------------------------------------------------------- |
| `bg`     | `#f6f2e8` paper | `#1d252e` ink | Page. The hero is an ink band in both modes.                                                  |
| `raised` | `#fffdf7`       | `#27313c`     | Cards.                                                                                        |
| `fg`     | `#1d252e`       | `#f6f2e8`     | Body text, 13.8:1 (AAA).                                                                      |
| `muted`  | `#4a5560`       | `#b9c2cc`     | Secondary text, 4.5:1 or better.                                                              |
| `link`   | `#0f3fd0`       | `#9db4ff`     | Links, 7.1:1 on paper.                                                                        |
| `signal` | `#f5b92b`       | `#f5b92b`     | Brand yellow. Fill with ink text (8.7:1). As a bare shape only in dark mode (light is 1.6:1). |

Yellow is core's brand color (`--color-brand`). Blue `#3b63ff` appears only as a card stripe and glow, never for text.

## Type

- **Display:** Space Grotesk 700, tight tracking, fluid up to 9rem. It is core's heading face, so the site and the
  system share a voice.
- **Body:** Atkinson Hyperlegible Next, 1.125 to 1.25rem. Chosen for legibility and to match the résumés. Open question: keep it or use Space Grotesk throughout.
- **Labels:** JetBrains Mono, 0.8125rem, uppercase, tracked. Used for section numbers, nav and the token strip.
- Fluid scale with `clamp()`, no breakpoints for type.

## Motion

Rules, from the modern-web guidance: motion is opt-in under `prefers-reduced-motion: no-preference`; every state is
visible and complete without it; only `opacity`, `translate` and `transform` move; nothing loops or flashes;
color transitions stay on for everyone.

| #   | Effect                                                                                                       | Status                  |
| --- | ------------------------------------------------------------------------------------------------------------ | ----------------------- |
| 1   | Hero entrance: name, lead and buttons rise in, staggered                                                     | Built                   |
| 2   | Highlighter sweeps under the three key phrases after the type lands                                          | Built                   |
| 3   | Buttons lift, arrows nudge, cards lift and tilt 0.4deg, token chips slide on hover and focus                 | Built                   |
| 4   | Sections ease in on scroll with `animation-timeline: view()` (CSS only; unsupported browsers just show them) | Built                   |
| 5   | Nav underline grows on hover and marks the current page                                                      | Built                   |
| 6   | Light/dark switch cross-fades with the View Transitions API                                                  | Built, feature-detected |
| 7   | Route changes cross-fade (`defaultViewTransition`)                                                           | Built, feature-detected |
| 8   | Token strip chips copy their value on click, with a short confirmation                                       | Planned                 |
| 9   | `/ui/` page: live token editor that re-themes a component as you drag                                        | Planned                 |
| 10  | `/ai/` page: workflow steps light up in sequence as they scroll into view                                    | Planned                 |
| 11  | Focus routing to `<main>` after a route change                                                               | Planned (needed with 7) |

Not doing: parallax, cursor-following, auto-playing loops. Any future persistent animation needs a visible pause
control (WCAG 2.2.2).

## Accessibility notes

- Focus ring is 3px, `link` color on paper and `signal` on ink.
- `prefers-contrast: more` strengthens borders and muted text; `forced-colors` has explicit fallbacks.
- Highlighter is a background band under the text, not behind it, so it never lowers text contrast.
- Still to do: screen reader pass, contrast of the card stripe and glow in forced colors, keyboard-test the toggle.
