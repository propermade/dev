// Content for /work. Media is placeholder until real screenshots, recordings and code arrive.
export type Shot = { title: string; caption: string; src?: string; alt?: string };
export type Snippet = { file: string; lang: string; note: string; code: string };
export type Recording = { title: string; length: string; transcript: string; src?: string; poster?: string; captions?: string };
export type Project = {
  id: string;
  kind: "ui" | "ai";
  kindLabel: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  facts: [string, string][];
  links: { label: string; href: string }[];
  shots: Shot[];
  recording: Recording;
  code: Snippet[];
};

export const workIntro = {
  title: "Platforms that make org standards the default",
  summary: "Independent work on design systems and agent workflows that let an organization set a standard once and have tooling enforce it. Each has screenshots, a recording and the code that matters.",
};

export const projects: Project[] = [
  {
    id: "ui",
    kind: "ui",
    kindLabel: "Design system",
    title: "Design systems that enforce their own rules",
    summary: "One token source feeding code, Storybook and Claude Design.",
    body: "A shared React package of accessible components and a theme, built from one set of design tokens. Product teams import UI from one package, and tooling checks the rules instead of review comments.",
    tags: ["React", "StyleX", "W3C Design Tokens", "Storybook", "WCAG 2.2"],
    facts: [
      ["Role", "Design and build"],
      ["Packages", "core, design, demo, docs"],
      ["Standard", "95% coverage gate, AAA text contrast"],
    ],
    links: [
      { label: "Source on GitHub", href: "https://github.com/properinteractive/ui" },
      { label: "UI packages site", href: "https://propermade.github.io/ui/" },
    ],
    shots: [
      { title: "System map", caption: "Design tokens, core UI and a demo app, independently useful and connected by design." },
      { title: "Token editor", caption: "Drag the radius and the components re-theme from one CSS variable." },
      { title: "Shared context", caption: "AppShell, SideNav and ThemeToggle shown as an owner tree and a Storybook view." },
      { title: "Diagrams and docs", caption: "Generated component trees and a searchable view of the repo's Markdown." },
    ],
    recording: {
      title: "Keyboard and state behaviour",
      length: "1:42",
      transcript: "Placeholder transcript. A captioned walkthrough of tabbing through a segmented control, a menu and a dialog, with focus order and announced states described in text.",
    },
    code: [
      {
        file: "packages",
        lang: "sh",
        note: "The packages, one vocabulary from token to screen",
        code: `@propermade/design   # W3C tokens, light/dark exports
@propermade/core     # components, app shell, data grids, auth
@propermade/demo     # reference app that exercises them
@propermade/docs     # tracked Markdown as a browsable site`,
      },
      {
        file: "tokens.json",
        lang: "json",
        note: "A token, as defined",
        code: `"element": {
  "$type": "dimension",
  "$value": "8px",
  "$extensions": {
    "com.propermade": { "css": "--radius-element" }
  }
}`,
      },
      {
        file: "SegmentedControl.tsx",
        lang: "tsx",
        note: "A component's API in use",
        code: `<SegmentedControl.Root
  value={view}
  onChange={setView}
  label="View mode"
>
  <SegmentedControl.Item value="grid" label="Grid" />
  <SegmentedControl.Item value="list" label="List" />
</SegmentedControl.Root>`,
      },
    ],
  },
  {
    id: "ai",
    kind: "ai",
    kindLabel: "Agent workflow",
    title: "Agent workflows with verification gates",
    summary: "Personas, skills and a DAG engine from spec to shipped PR.",
    body: "An agent harness for a spec, build, review, ship and track workflow. \"It's done\" is decided by scripts and people, not by the agent saying so. Each step passes a check or hands back to the agent with the failure.",
    tags: ["TypeScript", "DAG engine", "Claude Code", "Hooks", "Plugins"],
    facts: [
      ["Role", "Design and build"],
      ["Status", "Engine and ticket flow live; Slack and Jira offline only"],
      ["Gates", "Design, contracts and failing tests need a person"],
    ],
    links: [
      { label: "Source on GitHub", href: "https://github.com/properinteractive" },
      { label: "Status table", href: "https://github.com/properinteractive" },
    ],
    shots: [
      { title: "A run, start to PR", caption: "Nine steps from Program Board check to CI fix loop." },
      { title: "Approval gate", caption: "Approved files are fingerprinted and re-checked before the PR." },
      { title: "PR evidence", caption: "Commands run and their output, not an assertion." },
      { title: "Guardrail hook", caption: "A blocked force-push, with the reason shown." },
    ],
    recording: {
      title: "A run, start to passing gates",
      length: "3:20",
      transcript: "Placeholder transcript. A ticket enters the workflow, a person approves the design and the failing tests, the implement loop turns the checks green, and the PR opens carrying its evidence.",
    },
    code: [
      {
        file: "workflow.ts",
        lang: "ts",
        note: "A workflow as steps with checks between them",
        code: `export const ticketToPr = dag({
  steps: [
    step("spec"),
    step("design", { gate: "person-approves" }),
    step("failing-tests", { gate: "real-red" }),
    step("implement", { loop: { until: "checks-green", max: 5 } }),
    step("scope-check"),
    step("pr", { evidence: true }),
  ],
});`,
      },
      {
        file: "guardrail.sh",
        lang: "sh",
        note: "Block irreversible commands",
        code: `# PreToolUse hook
case "$COMMAND" in
  *"push --force"*|*"rm -rf /"*)
    echo "Blocked: irreversible command" >&2
    exit 2 ;;
esac`,
      },
    ],
  },
];
