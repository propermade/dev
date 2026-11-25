// Source of truth for the site's own colours, layered on core's theme. [light, dark].
// scripts/gen-palette.ts writes these as CSS custom properties and fails the build when a pair misses its contrast floor.
export const palette = {
  bg: ["#f6f2e8", "#1d252e"],
  raised: ["#fffdf7", "#27313c"],
  fg: ["#1d252e", "#f6f2e8"],
  muted: ["#4a5560", "#b9c2cc"],
  link: ["#0f3fd0", "#9db4ff"],
  signal: ["#f5b92b", "#f5b92b"],
  onSignal: ["#1d252e", "#1d252e"],
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
  ["onSignal", "signal", 7],
  // Yellow is a fill with dark text on light paper (1.6:1 as a bare shape), so only dark mode treats it as a UI colour.
  ["signal", "bg", 3, [1]],
  ["signal", "raised", 3, [1]],
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
/** WCAG 2.x contrast ratio between two #rrggbb colours. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
export const ratio = (a: Token, b: Token, mode: 0 | 1) =>
  contrast(palette[a][mode], palette[b][mode]);
