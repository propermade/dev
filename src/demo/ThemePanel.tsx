import { Button, SegmentedControl, Text } from "@propermade/core/components";
import { useEffect, useState } from "react";

import {
  ACCENTS,
  accentPair,
  contrast,
  DEFAULTS,
  DENSITIES,
  FONTS,
  onColor,
  parseSettings,
  PRESETS,
  RADIUS_RANGE,
  toCss,
  type Density,
  type FontChoice,
  type ThemeSettings,
} from "./themeEngine";

const STORAGE_KEY = "demo-theme";

/** The settings, saved in this browser. Storage can be unavailable, so every access is guarded. */
export function useThemeSettings(): [ThemeSettings, (next: ThemeSettings) => void] {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseSettings(JSON.parse(saved)) : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);
  return [settings, setSettings];
}

const DENSITY_LABELS: Record<Density, string> = {
  compact: "Compact",
  comfortable: "Default",
  spacious: "Roomy",
};

const same = (a: ThemeSettings, b: ThemeSettings) =>
  a.accent === b.accent && a.radius === b.radius && a.font === b.font && a.density === b.density;

const ratio = (n: number) => `${n.toFixed(1)}:1`;

export function ThemePanel({
  settings,
  onChange,
}: {
  settings: ThemeSettings;
  onChange: (next: ThemeSettings) => void;
}) {
  const [copied, setCopied] = useState(false);
  const set = (patch: Partial<ThemeSettings>) => onChange({ ...settings, ...patch });
  const css = toCss(settings, ".app");

  // How the text on the accent reads, in each color mode.
  const checks = settings.accent
    ? accentPair(settings.accent).map((c) => contrast(onColor(c), c))
    : null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="theme-panel" role="group" aria-label="Theme editor">
      <div className="theme-head">
        <Text weight="semibold">Theme</Text>
        <Text type="supporting">
          Change the design tokens and the app updates as you go. Saved in this browser.
        </Text>
      </div>

      <section className="theme-group" aria-labelledby="th-presets">
        <h3 id="th-presets">Presets</h3>
        <div className="theme-chips">
          {PRESETS.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant={same(settings, p.settings) ? "primary" : "secondary"}
              label={p.label}
              onClick={() => onChange(p.settings)}
            />
          ))}
        </div>
      </section>

      <section className="theme-group" aria-labelledby="th-accent">
        <h3 id="th-accent">Accent</h3>
        <div className="theme-swatches" role="group" aria-label="Accent color">
          <button
            type="button"
            className="swatch swatch-site"
            aria-pressed={settings.accent === null}
            aria-label="Site accent"
            title="Site accent"
            onClick={() => set({ accent: null })}
          />
          {ACCENTS.map((a) => (
            <button
              key={a.value}
              type="button"
              className="swatch"
              style={{ background: a.value }}
              aria-pressed={settings.accent === a.value}
              aria-label={a.label}
              title={a.label}
              onClick={() => set({ accent: a.value })}
            />
          ))}
          <label className="swatch-custom">
            <span className="visually-hidden">Custom accent color</span>
            <input
              type="color"
              value={settings.accent ?? "#006c66"}
              onChange={(e) => set({ accent: e.target.value })}
            />
          </label>
        </div>
        {checks ? (
          <Text type="supporting">
            Text on the accent: {ratio(checks[0]!)} in light, {ratio(checks[1]!)} in dark. The
            accent is adjusted to stay readable on the page.
          </Text>
        ) : null}
      </section>

      <section className="theme-group" aria-labelledby="th-radius">
        <h3 id="th-radius">Corner radius</h3>
        <label className="theme-range">
          <input
            type="range"
            min={RADIUS_RANGE.min}
            max={RADIUS_RANGE.max}
            step={1}
            value={settings.radius}
            onChange={(e) => set({ radius: Number(e.target.value) })}
            aria-label="Corner radius in pixels"
          />
          <output>{settings.radius}px</output>
        </label>
      </section>

      <section className="theme-group" aria-labelledby="th-font">
        <h3 id="th-font">Typeface</h3>
        <div className="theme-chips" role="group" aria-label="Typeface">
          {(Object.keys(FONTS) as FontChoice[]).map((f) => (
            <button
              key={f}
              type="button"
              className="font-chip"
              style={{ fontFamily: FONTS[f].stack }}
              aria-pressed={settings.font === f}
              onClick={() => set({ font: f })}
            >
              {FONTS[f].label}
            </button>
          ))}
        </div>
      </section>

      <section className="theme-group" aria-labelledby="th-density">
        <h3 id="th-density">Control size</h3>
        <SegmentedControl.Root
          value={settings.density}
          onChange={(v) => set({ density: v as Density })}
          label="Control size"
        >
          {(Object.keys(DENSITIES) as Density[]).map((d) => (
            <SegmentedControl.Item key={d} value={d} label={DENSITY_LABELS[d]} />
          ))}
        </SegmentedControl.Root>
      </section>

      <section className="theme-group" aria-labelledby="th-css">
        <div className="theme-css-head">
          <h3 id="th-css">The tokens</h3>
          <Button size="sm" variant="ghost" label={copied ? "Copied" : "Copy CSS"} onClick={copy} />
        </div>
        <pre className="theme-css" tabIndex={0} aria-labelledby="th-css">
          <code>{css}</code>
        </pre>
      </section>

      <Button variant="ghost" label="Reset to the site theme" onClick={() => onChange(DEFAULTS)} />
    </div>
  );
}
