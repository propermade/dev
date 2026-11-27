import { describe, expect, it } from "bun:test";

import {
  accentPair,
  contrast,
  DEFAULTS,
  ensureContrast,
  isDefault,
  onColor,
  parseHex,
  parseSettings,
  themeVars,
  toCss,
} from "./themeEngine.ts";

describe("color", () => {
  it("parses short and long hex, and rejects the rest", () => {
    expect(parseHex("#fff")).toEqual([255, 255, 255]);
    expect(parseHex("1d4ed8")).toEqual([29, 78, 216]);
    expect(parseHex("blue")).toBeNull();
    expect(parseHex("#12")).toBeNull();
  });

  it("measures WCAG contrast", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrast("#777777", "#777777")).toBeCloseTo(1, 5);
  });

  it("picks white or near-black text for an accent", () => {
    expect(onColor("#1d4ed8")).toBe("#ffffff");
    expect(onColor("#fde047")).toBe("#0a1211");
  });

  it("darkens or lightens an accent until it reads as text", () => {
    const [light, dark] = accentPair("#fde047");
    expect(contrast(light, "#fbfaf7")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark, "#142120")).toBeGreaterThanOrEqual(4.5);
    // A color that already passes is left alone.
    expect(ensureContrast("#1d4ed8", "#fbfaf7", "darken")).toBe("#1d4ed8");
  });
});

describe("themeVars", () => {
  it("emits nothing for the defaults", () => {
    expect(isDefault(DEFAULTS)).toBe(true);
    expect(themeVars(DEFAULTS)).toEqual({});
    expect(toCss(DEFAULTS)).toContain("no overrides");
  });

  it("scales every radius from the element radius", () => {
    const vars = themeVars({ ...DEFAULTS, radius: 8 });
    expect(vars["--radius-element"]).toBe("8px");
    expect(vars["--radius-inner"]).toBe("4px");
    expect(vars["--radius-container"]).toBe("12px");
    expect(vars["--radius-page"]).toBe("28px");
    expect(Object.keys(vars)).toHaveLength(4);
  });

  it("sets the accent for text, icons and the text on it, in both modes", () => {
    const vars = themeVars({ ...DEFAULTS, accent: "#1d4ed8" });
    expect(vars["--color-accent"]).toMatch(/^light-dark\(#[0-9a-f]{6}, #[0-9a-f]{6}\)$/);
    expect(vars["--color-text-accent"]).toBe(vars["--color-accent"]!);
    expect(vars["--color-on-accent"]).toMatch(/^light-dark\(/);
  });

  it("sets a font and a density only when they differ", () => {
    expect(themeVars({ ...DEFAULTS, font: "serif" })["--font-family-body"]).toContain("Georgia");
    expect(themeVars({ ...DEFAULTS, density: "compact" })["--size-element-md"]).toBe(
      "calc(1lh + var(--spacing-4))",
    );
    expect(themeVars({ ...DEFAULTS, font: "geist" })["--font-family-body"]).toBeUndefined();
  });

  it("prints the overrides as a CSS block", () => {
    expect(toCss({ ...DEFAULTS, radius: 0 }, ".app")).toBe(
      ".app {\n  --radius-inner: 0px;\n  --radius-element: 0px;\n  --radius-container: 0px;\n  --radius-page: 0px;\n}",
    );
  });
});

describe("parseSettings", () => {
  it("falls back to the defaults for anything invalid", () => {
    expect(parseSettings(null)).toEqual(DEFAULTS);
    expect(parseSettings({ accent: "nope", radius: "big", font: "comic", density: 3 })).toEqual(
      DEFAULTS,
    );
  });

  it("keeps valid values and clamps the radius", () => {
    expect(
      parseSettings({ accent: "#1d4ed8", radius: 99, font: "serif", density: "compact" }),
    ).toEqual({
      accent: "#1d4ed8",
      radius: 24,
      font: "serif",
      density: "compact",
    });
  });
});
