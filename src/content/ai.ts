import type { PageContent } from "./types";

export const ai: PageContent = {
  title: "agent workflows with verification gates",
  summary: "Personas, skills and a DAG engine from spec to shipped PR.",
  sections: [
    {
      id: "what",
      heading: "What it is and why",
      blocks: [
        { kind: "p", text: "An agent harness for a spec, build, review, ship and track workflow: personas, skills, plugins and a small DAG engine that runs a workflow as steps with checks between them." },
        { kind: "p", text: "The point is that \"it's done\" is decided by scripts and people, not by the agent saying so. Each step either passes a check or hands back to the agent with the failure." },
      ],
    },
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
    {
      id: "gates",
      heading: "Verification gates",
      blocks: [
        {
          kind: "list",
          items: [
            "A person approves the design, the contracts and the failing tests before implementation starts. Approved files are fingerprinted and re-checked before the PR.",
            "Tests must be a real red first, and approved tests are never rewritten to make a change pass.",
            "Implementation runs in a bounded loop until the checks are green, then the diff is checked against the approved scope.",
            "The PR carries the evidence: the commands run and their output, not an assertion that they passed.",
            "A reviewer agent reads the diff in a fresh context and reports only correctness or requirement gaps.",
            "Guardrail hooks block irreversible commands such as force-pushes and recursive deletes, run fast checks after every edit, and run the slow suites when the agent tries to stop.",
          ],
        },
      ],
    },
    {
      id: "status",
      heading: "Honest status",
      blocks: [
        { kind: "p", text: "Not all of it is live, and the project keeps a status table that says which parts are which." },
        {
          kind: "list",
          items: [
            "Works today: the DAG engine, the spec, diagram, review, commit and test-scaffolding skills, and the end-to-end ticket workflow, which has taken a real ticket to a PR in an app that installs the project.",
            "Works, with live checks still to come: the session-memory and guardrails plugins run live in a session but have not been run as marketplace installs. Some hooks are covered by tests only.",
            "Works offline only: the Slack and Jira plugins run against fake servers, not yet a live workspace.",
            "External: a few skills it assumes are installed separately; none of their content lives in this repo.",
          ],
        },
      ],
    },
    { id: "run", heading: "A run, start to passing gates", blocks: [{ kind: "todo", note: "Screenshots and a captioned recording with transcript." }] },
  ],
};
