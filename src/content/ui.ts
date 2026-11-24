import type { PageContent } from "./types";

export const ui: PageContent = {
  title: "ui: a design system that enforces its own rules",
  summary: "One token source feeding code, Storybook and Claude Design.",
  sections: [
    { id: "what", heading: "What it is and why", blocks: [{ kind: "todo", note: "One token source of truth feeding the React package, Storybook and Claude Design." }] },
    { id: "tokens", heading: "Tokens", blocks: [{ kind: "todo", note: "Token definition and its generated light and dark CSS." }] },
    { id: "components", heading: "Components, live", blocks: [{ kind: "todo", note: "Real @propermade/core components rendered on the page." }] },
    { id: "api", heading: "A component's API in use", blocks: [{ kind: "todo", note: "Short example; mock data, stated plainly." }] },
    { id: "docs", heading: "Generated docs", blocks: [{ kind: "todo", note: "Screenshots of generated component docs." }] },
    { id: "behaviour", heading: "Keyboard and state behaviour", blocks: [{ kind: "todo", note: "Captioned recording with transcript." }] },
    { id: "standard", heading: "How it is held to a standard", blocks: [{ kind: "todo", note: "Coverage gates, lint in CI, changesets, generated files never hand-edited." }] },
  ],
};
