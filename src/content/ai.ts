import type { PageContent } from "./types";

export const ai: PageContent = {
  title: "ai: an agent workflow with verification gates",
  summary: "Personas, skills and a DAG engine from spec to shipped PR.",
  sections: [
    { id: "what", heading: "What it is and why", blocks: [{ kind: "todo", note: "Personas, skills, plugins and a small DAG engine: spec, build, review, ship, track." }] },
    {
      id: "workflow",
      heading: "The workflow",
      blocks: [
        {
          kind: "list",
          items: [
            "Program Board check",
            "Spec",
            "Architect review",
            "Person-approved design",
            "Failing tests",
            "Implement loop",
            "Scope check",
            "PR",
            "CI fix loop",
          ],
        },
      ],
    },
    { id: "gates", heading: "Verification gates", blocks: [{ kind: "todo", note: "Evidence in the PR, adversarial review in a fresh context, guardrail hooks, a person approves the design." }] },
    { id: "status", heading: "Honest status", blocks: [{ kind: "todo", note: "Mirror planning/status.md: works today vs scaffolded." }] },
    { id: "run", heading: "A run, start to passing gates", blocks: [{ kind: "todo", note: "Screenshots and a captioned recording with transcript." }] },
  ],
};
