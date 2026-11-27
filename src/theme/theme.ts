// The site's one color and type source. `bun run theme` (scripts/build-theme.ts) checks the contrast floors below,
// then runs `astryx theme build` to turn `theme` into site.{js,css,d.ts} for core's ThemeProvider. Edit this, never those; rerun the script after.
import { defineTheme } from "@propermade/core/theme";

export const palette = {
  bg: ["#f1efe9", "#0c1514"],
  raised: ["#fbfaf7", "#142120"],
  fg: ["#14201f", "#f1efe9"],
  muted: ["#4a5755", "#aebbb8"],
  link: ["#0b5f5a", "#7fd1c6"],
  signal: ["#468e5c", "#468e5c"],
} as const;

export type Token = keyof typeof palette;

/** [foreground, background, minimum ratio, modes checked (default both)]. 7 is WCAG AAA for body text, 4.5 AA, 3 for large text and UI. */
export const pairs: [Token, Token, number, (0 | 1)[]?][] = [
  ["fg", "bg", 7],
  ["fg", "raised", 7],
  ["muted", "bg", 4.5],
  ["muted", "raised", 4.5],
  ["link", "bg", 4.5],
  ["link", "raised", 4.5],
  // Signal is a UI color (dots, rules, underlines), never a text fill: 3:1 against both surfaces.
  ["signal", "bg", 3],
  ["signal", "raised", 3],
];

const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * lin((n >> 16) / 255) +
    0.7152 * lin(((n >> 8) & 255) / 255) +
    0.0722 * lin((n & 255) / 255)
  );
};
/** WCAG 2.x contrast ratio between two #rrggbb colors. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
export const ratio = (a: Token, b: Token, mode: 0 | 1) =>
  contrast(palette[a][mode], palette[b][mode]);

/** The palette as theme tokens: `--bg` etc. follow the color mode. */
const siteTokens = Object.fromEntries(
  (Object.keys(palette) as Token[]).map((k) => [
    `--${k}`,
    `light-dark(${palette[k][0]}, ${palette[k][1]})`,
  ]),
) as Record<string, string>;

/**
 * Astryx derives its surface colors from the accent, which tints every card, panel, popover and
 * grid a pale cyan. Pin them to the site's own paper tones instead.
 */
const surfaceTokens = Object.fromEntries(
  [
    ["--color-background-surface", "raised"],
    ["--color-background-card", "raised"],
    ["--color-background-popover", "raised"],
    ["--color-background-body", "bg"],
  ].map(([name, token]) => [
    name!,
    `light-dark(${palette[token as Token][0]}, ${palette[token as Token][1]})`,
  ]),
) as Record<string, string>;

/**
 * Control heights that fit the label. Astryx buttons have 8px of vertical padding around a label
 * line, and this theme's 16px base size makes that line 24px, so the 28px and 32px defaults are
 * too short: the label overflows its box and sits low, and more so with larger system text.
 * Heights built from the line height (`1lh`) plus the padding stay centered at any text size.
 */
const sizeTokens = {
  "--size-element-sm": "calc(1lh + var(--spacing-4))",
  "--size-element-md": "calc(1lh + var(--spacing-5))",
  "--size-element-lg": "calc(1lh + var(--spacing-6))",
} as Record<string, string>;

export const theme = defineTheme({
  name: "site",
  color: {
    // [light, dark]. Astryx derives the on-accent colors and tunes both for contrast.
    accent: [palette.link[0], palette.link[1]],
    neutralStyle: "warm",
    contrast: "standard",
  },
  typography: {
    scale: { base: 16, ratio: 1.125 },
    body: { family: "Geist Sans", fallbacks: "system-ui, sans-serif" },
    heading: { weight: "semibold", weights: { 1: "semibold", 2: "semibold" } },
  },
  tokens: { ...siteTokens, ...surfaceTokens, ...sizeTokens },
  radius: { base: 4, multiplier: 1.5 },
});
