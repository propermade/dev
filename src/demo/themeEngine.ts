// The demo's live theme engine: a few settings in, a block of design-token overrides out. The
// overrides are CSS custom properties applied to the demo app's wrapper, so every core component
// inside re-themes at once and nothing outside it changes. Pure functions only, no DOM.

export type FontChoice = "geist" | "space-grotesk" | "system" | "serif";
export type Density = "compact" | "comfortable" | "spacious";

const grow = (spacing: string) => `calc(1lh + var(${spacing}))`;

export interface ThemeSettings {
  /** A color for primary actions, selection and links; null keeps the site theme's. */
  accent: string | null;
  /** The corner radius of controls in px; cards, panels and pages scale from it. */
  radius: number;
  font: FontChoice;
  density: Density;
}

/** The site theme's own values, which the app shows until something is changed. */
export const DEFAULTS: ThemeSettings = {
  accent: null,
  radius: 12,
  font: "geist",
  density: "comfortable",
};

export const FONTS: Record<FontChoice, { label: string; stack: string }> = {
  geist: { label: "Geist", stack: '"Geist Sans", system-ui, sans-serif' },
  "space-grotesk": { label: "Grotesk", stack: '"Space Grotesk", system-ui, sans-serif' },
  system: { label: "System", stack: "system-ui, -apple-system, sans-serif" },
  serif: { label: "Serif", stack: 'Georgia, "Times New Roman", serif' },
};

/**
 * Control heights: small, medium, large, each the label's line height plus a spacing token, so a
 * control always fits its label and stays centered at any text size. Comfortable is the site
 * theme's own (src/theme/theme.ts).
 */
export const DENSITIES: Record<Density, [string, string, string]> = {
  compact: ["--spacing-4", "--spacing-4", "--spacing-5"].map(grow) as [string, string, string],
  comfortable: ["--spacing-4", "--spacing-5", "--spacing-6"].map(grow) as [string, string, string],
  spacious: ["--spacing-5", "--spacing-6", "--spacing-7"].map(grow) as [string, string, string],
};

export const RADIUS_RANGE = { min: 0, max: 24 } as const;

export const ACCENTS = [
  { label: "Blue", value: "#1d4ed8" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Rose", value: "#be123c" },
  { label: "Orange", value: "#c2410c" },
  { label: "Amber", value: "#b45309" },
  { label: "Green", value: "#15803d" },
  { label: "Slate", value: "#334155" },
] as const;

export const PRESETS: { id: string; label: string; settings: ThemeSettings }[] = [
  { id: "site", label: "Site default", settings: DEFAULTS },
  {
    id: "ocean",
    label: "Ocean",
    settings: { accent: "#1d4ed8", radius: 8, font: "geist", density: "comfortable" },
  },
  {
    id: "ember",
    label: "Ember",
    settings: { accent: "#c2410c", radius: 16, font: "space-grotesk", density: "comfortable" },
  },
  {
    id: "sharp",
    label: "Sharp",
    settings: { accent: "#334155", radius: 0, font: "system", density: "compact" },
  },
  {
    id: "soft",
    label: "Soft",
    settings: { accent: "#7c3aed", radius: 22, font: "serif", density: "spacious" },
  },
];

// ── Color ─────────────────────────────────────────────────────────────────────────────────────

/** The surfaces accent text sits on (the site's raised surface, light and dark). */
const SURFACE = { light: "#fbfaf7", dark: "#142120" } as const;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1]!;
  if (h.length === 3) h = h.replace(/./g, "$&$&");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toHex = ([r, g, b]: [number, number, number]) =>
  "#" + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("");

function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === rn
      ? (gn - bn) / d + (gn < bn ? 6 : 0)
      : max === gn
        ? (bn - rn) / d + 2
        : (rn - gn) / d + 4;
  return [h * 60, s, l];
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

function luminance(hex: string): number {
  const rgb = parseHex(hex) ?? [0, 0, 0];
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two #rgb or #rrggbb colors. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Moves a color's lightness toward lighter or darker until it reads on `against` at `min`:1. */
export function ensureContrast(
  hex: string,
  against: string,
  direction: "lighten" | "darken",
  min = 4.5,
): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  let [h, s, l] = rgbToHsl(rgb);
  let out = toHex(hslToRgb([h, s, l]));
  for (let i = 0; i < 50 && contrast(out, against) < min; i++) {
    l = clamp(l + (direction === "lighten" ? 0.02 : -0.02), 0, 1);
    out = toHex(hslToRgb([h, s, l]));
  }
  return out;
}

/** White or near-black, whichever reads better on `hex`. */
export function onColor(hex: string): string {
  return contrast("#ffffff", hex) >= contrast("#0a1211", hex) ? "#ffffff" : "#0a1211";
}

/** An accent adjusted to read as text on the site's surfaces: [light mode, dark mode]. */
export function accentPair(accent: string): [string, string] {
  return [
    ensureContrast(accent, SURFACE.light, "darken"),
    ensureContrast(accent, SURFACE.dark, "lighten"),
  ];
}

// ── Settings to tokens ────────────────────────────────────────────────────────────────────────

export const isDefault = (s: ThemeSettings) =>
  s.accent === null &&
  s.radius === DEFAULTS.radius &&
  s.font === DEFAULTS.font &&
  s.density === DEFAULTS.density;

/** The design-token overrides for some settings; empty for the defaults. */
export function themeVars(s: ThemeSettings): Record<string, string> {
  const vars: Record<string, string> = {};
  if (s.accent && parseHex(s.accent)) {
    const [light, dark] = accentPair(s.accent);
    const accent = `light-dark(${light}, ${dark})`;
    vars["--color-accent"] = accent;
    vars["--color-text-accent"] = accent;
    vars["--color-icon-accent"] = accent;
    vars["--color-on-accent"] = `light-dark(${onColor(light)}, ${onColor(dark)})`;
    vars["--color-accent-muted"] =
      "light-dark(color-mix(in oklab, var(--color-accent) 14%, transparent), color-mix(in oklab, var(--color-accent) 28%, transparent))";
  }
  if (s.radius !== DEFAULTS.radius) {
    const r = clamp(s.radius, RADIUS_RANGE.min, RADIUS_RANGE.max);
    vars["--radius-inner"] = `${+(r / 2).toFixed(2)}px`;
    vars["--radius-element"] = `${r}px`;
    vars["--radius-container"] = `${+(r * 1.5).toFixed(2)}px`;
    vars["--radius-page"] = `${+(r * 3.5).toFixed(2)}px`;
  }
  if (s.font !== DEFAULTS.font) {
    const stack = FONTS[s.font].stack;
    vars["--font-family-body"] = stack;
    vars["--font-family-heading"] = stack;
    vars["--font-body"] = stack;
  }
  if (s.density !== DEFAULTS.density) {
    const [sm, md, lg] = DENSITIES[s.density];
    vars["--size-element-sm"] = sm;
    vars["--size-element-md"] = md;
    vars["--size-element-lg"] = lg;
  }
  return vars;
}

/** The overrides as a CSS block, to copy into a theme. */
export function toCss(s: ThemeSettings, selector = ":root"): string {
  const vars = themeVars(s);
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return lines.length
    ? `${selector} {\n${lines.join("\n")}\n}`
    : `/* The site theme: no overrides. */`;
}

/** Settings from untrusted storage: anything invalid falls back to the default for that field. */
export function parseSettings(raw: unknown): ThemeSettings {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const accent = typeof o.accent === "string" && parseHex(o.accent) ? o.accent : null;
  const radius =
    typeof o.radius === "number" && Number.isFinite(o.radius)
      ? clamp(Math.round(o.radius), RADIUS_RANGE.min, RADIUS_RANGE.max)
      : DEFAULTS.radius;
  const font =
    typeof o.font === "string" && o.font in FONTS ? (o.font as FontChoice) : DEFAULTS.font;
  const density =
    typeof o.density === "string" && o.density in DENSITIES
      ? (o.density as Density)
      : DEFAULTS.density;
  return { accent, radius, font, density };
}
