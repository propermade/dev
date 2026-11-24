import type { PageContent } from "./types";

export const ui: PageContent = {
  title: "ui: a design system that enforces its own rules",
  summary: "One token source feeding code, Storybook and Claude Design.",
  sections: [
    {
      id: "what",
      heading: "What it is and why",
      blocks: [
        { kind: "p", text: "A shared React package of accessible components and a theme, built from one set of design tokens. Product teams import UI from a single package, and the rules that keep it consistent are checked by tooling rather than by review comments." },
        { kind: "p", text: "Core wraps its underlying component library one file per component, so defaults and constraints are set in one place and the implementation can change without touching every consumer." },
      ],
    },
    {
      id: "tokens",
      heading: "Tokens",
      blocks: [
        { kind: "p", text: "Every colour, space and radius lives in one W3C Design Tokens file. Each token names its CSS variable, and a token that differs in dark mode lists both values. Light and dark CSS, the theme and the reference docs are generated from it, never edited by hand." },
        { kind: "code", lang: "json", title: "A token, as defined", code: `"element": {
  "$type": "dimension",
  "$value": "8px",
  "$extensions": { "com.propermade": { "css": "--radius-element" } }
}` },
        { kind: "p", text: "Drag the radius or pick an accent below. The components next to it re-theme from the variable, scoped to this block." },
      ],
    },
    { id: "components", heading: "Components, live", blocks: [{ kind: "p", text: "These are the real @propermade/core components, rendered on this page." }] },
    {
      id: "api",
      heading: "A component's API in use",
      blocks: [
        { kind: "p", text: "Components with parts are namespaces; the rest are flat. The example uses mock data." },
        { kind: "code", lang: "tsx", title: "Segmented control", code: `<SegmentedControl.Root value={view} onChange={setView} label="View mode">
  <SegmentedControl.Item value="grid" label="Grid" />
  <SegmentedControl.Item value="list" label="List" />
</SegmentedControl.Root>` },
      ],
    },
    { id: "docs", heading: "Generated docs", blocks: [{ kind: "todo", note: "Screenshots of the generated component docs." }] },
    { id: "behaviour", heading: "Keyboard and state behaviour", blocks: [{ kind: "todo", note: "Captioned recording with transcript." }] },
    {
      id: "standard",
      heading: "How it is held to a standard",
      blocks: [
        {
          kind: "list",
          items: [
            "Coverage gates: core and design fail below 95% lines and functions.",
            "Lint runs in CI and fails the build if formatting leaves a diff.",
            "Every change to a package needs a changeset, and commits follow Conventional Commits.",
            "Generated files are gitignored and never hand-edited; CI regenerates them.",
          ],
        },
      ],
    },
  ],
};
