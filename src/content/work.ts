import { site } from "./site";

// Content for /work. Media is placeholder until real screenshots, recordings and code arrive.
export type Category = "design-systems" | "applications" | "realtime" | "agents";

/** The /work filters, in order. A project can belong to several. */
export const categories: { id: Category; label: string }[] = [
  { id: "design-systems", label: "Design systems" },
  { id: "applications", label: "Applications" },
  { id: "realtime", label: "Real-time data" },
  { id: "agents", label: "Agent harness" },
];

export type Shot = { title: string; caption: string; src?: string; alt?: string };
export type Snippet = { file: string; lang: string; note: string; code: string };
export type Recording = {
  title: string;
  length: string;
  transcript: string;
  src?: string;
  poster?: string;
  captions?: string;
};
export type Project = {
  id: string;
  categories: Category[];
  kindLabel: string;
  title: string;
  summary: string;
  body: string;
  disclaimer?: string;
  tags: string[];
  facts: [string, string][];
  links: { label: string; href: string }[];
  shots?: Shot[];
  recordings?: Recording[];
  code?: Snippet[];
};

/** The source repos are private and GitHub has no request-access page for a private repo, so access is requested by email. */
const requestAccess = (repo: string) => ({
  label: "Request access",
  href: `mailto:${site.email}?subject=${encodeURIComponent(`Access request: ${repo}`)}`,
});

export const workIntro = {
  title: "Platform standards that scale",
  summary:
    "Four example projects, built around one problem I've worked on since creating a design system for a Fortune 20 at Razorfish: making an organization's standards the default path, so quality doesn't depend on who reviewed the change. A design system that enforces its own rules, two applications that test it against dense and live data, and an agent harness where verification, not the agent, decides what's done.",
};

export const projects: Project[] = [
  {
    id: "ui",
    categories: ["design-systems"],
    kindLabel: "Design system",
    title: "A design system that enforces its own rules",
    summary: "Tokens, components and checks built so the standard holds without review.",
    body: "The system rests on one decision: the standard has to be cheaper to follow than to bypass. Design tokens live in a single W3C-format source, and everything downstream is generated from it: the theme, per-mode exports, the component inventory, a Claude Design mirror and the docs. Checks fail when any of it goes stale. Components are modular and atomic, each with a clear API and accessibility built in. Product teams consume one package, and accessibility, coverage and token drift are CI gates, not review comments. That is how a design system scales across teams without its central team becoming the bottleneck.",
    tags: ["React", "Astryx", "W3C Design Tokens", "Data grids", "Storybook", "Bun monorepo"],
    facts: [
      ["Role", "Architecture, design and build"],
      ["Approach", "One token source, generated outputs, CI gates"],
      ["Scope", "200+ themeable tokens with sensible defaults, five packages and a demo app"],
      ["Gate", "95% test coverage threshold on core, design and the application"],
    ],
    links: [{ label: "View demo", href: "/demo/" }, requestAccess("propermade/ui")],
  },
  {
    id: "central",
    categories: ["applications", "realtime"],
    kindLabel: "Application",
    title: "User interfaces for business-critical, high-volume streaming data",
    summary:
      "A dashboard built to stay fast and legible as data streams in at high volume and low latency.",
    body: "This console handles extremely high-volume, low-latency streaming data, and it puts the system's data grids, charts, forms and theming to work at full density while updates arrive continuously. Each service's API requests and responses run in their own dedicated web worker, which keeps network work off the main thread so the interface stays responsive. Errors and crashed workers are isolated within their layout panes, so the rest of the app keeps running, and an automatic retry system recovers them. A few quiet affordances keep it seamless when a source drops out: stale rows are dimmed, the history leaves a gap instead of a flat line, and a control says whether a change was sent or applied.",
    tags: [
      "React",
      "Typescript",
      "User configurable layouts",
      "Sub-millisecond streaming data",
      "Web workers",
      "WebSockets",
      "Real-time charts",
    ],
    disclaimer: "Screenshots use mock data",
    facts: [
      ["Role", "App architecture, design system, and build"],
      ["Focus", "High-volume streaming data, dense tables, a responsive UI"],
      [
        "Customization",
        "Customizable themes with light and dark modes, and layouts configurable per browser",
      ],
    ],
    links: [{ label: "View demo", href: "/demo/" }],
    shots: [
      {
        title: "Summary and history",
        caption: "Metric cards above a multi-series history chart, with series and range controls.",
        src: "/media/central/C01_summary_chart.jpg",
        alt: "Dashboard with a row of summary metric cards above a line chart of three series and an overall series.",
      },
      {
        title: "Light theme",
        caption: "The same screen in the light theme.",
        src: "/media/central/C02_light_theme.jpg",
        alt: "Dashboard in the light theme with metric cards above a multi-series line chart.",
      },
      {
        title: "Scrub to inspect",
        caption: "Hovering the chart shows every series at that moment.",
        src: "/media/central/C03_chart_tooltip.jpg",
        alt: "Line chart with a tooltip listing each series' value at the hovered time.",
      },
      {
        title: "Dense table",
        caption:
          "A table at full density. A notice marks rows from a source that stopped reporting, and they are dimmed.",
        src: "/media/central/C04_table_stale_banner.jpg",
        alt: "Data table of positions with a blue notice banner, summary cards, a search field and a source filter.",
      },
      {
        title: "Row detail",
        caption: "Selecting a row opens a drawer with its own metrics and history chart.",
        src: "/media/central/C05_detail_drawer.jpg",
        alt: "Side drawer showing metric cards and a line chart for one selected row, over a dimmed table.",
      },
      {
        title: "Per-source switches",
        caption: "Each source has its own switches and the time it last reported.",
        src: "/media/central/C06_toggle_controls.jpg",
        alt: "Three panels of labeled toggle switches, one per source, each with a last-reported time.",
      },
      {
        title: "Review before sending",
        caption: "A form that states what a change will and won't do, then asks for review.",
        src: "/media/central/C07_review_form.jpg",
        alt: "Form with a select, a text field and two optional toggles, beside a notice that published is not applied.",
      },
    ],
    recordings: [
      {
        title: "Live streaming data",
        length: "1:00",
        transcript:
          "Placeholder transcript. Summary cards and a history chart update continuously as data streams in. One source stops reporting and is dimmed, and the chart leaves a gap instead of a flat line.",
      },
      {
        title: "Review and send a change",
        length: "0:45",
        transcript:
          "Placeholder transcript. A control form is filled in, reviewed and sent, and the page states that the change is on its way, not yet applied.",
      },
    ],
  },
  {
    id: "canopy",
    categories: ["applications"],
    kindLabel: "Application",
    title: "A team workspace for nonprofit financial recordkeeping",
    summary:
      "Canopy Ledger gives a nonprofit team one place for transactions, funds, budgets and reports.",
    body: "A working product built on the design system end to end, across six pages: app shell, cards, ledger tables, progress bars, segmented controls and status chips. It puts the components to work in a real product shape instead of isolated docs examples.",
    tags: ["React", "TypeScript", "Design tokens", "Data tables", "Historical charts"],
    facts: [
      ["Role", "Concept, design and build"],
      ["Data", "Sample workspace, read-only"],
      ["Pages", "Overview, Transactions, Funds, Budgets, Reports, Team"],
    ],
    links: [{ label: "View demo", href: "https://canopy.propermade.dev/demo" }],
    shots: [
      {
        title: "Overview",
        caption:
          "Four balance cards and the latest ledger activity, with a persistent sample-workspace notice.",
        src: "/media/canopy/S01_overview_top.jpg",
        alt: "Canopy Ledger overview: balance cards for cash, restricted balance, income and expenses above a latest-activity list.",
      },
      {
        title: "Budget pulse",
        caption:
          "Category spending against plan, with colour marking how close each line is to its limit.",
        src: "/media/canopy/S02_overview_latest_activity.jpg",
        alt: "Latest activity ledger beside a budget pulse panel with progress bars per category.",
      },
      {
        title: "Transactions",
        caption: "A read-only ledger with search and filters for activity and fund.",
        src: "/media/canopy/S03_transactions_top.jpg",
        alt: "Transactions page listing twelve entries with a search field and two filter menus.",
      },
      {
        title: "Funds and grants",
        caption:
          "Balances by purpose, with restricted funds visually separate from unrestricted ones.",
        src: "/media/canopy/S04_funds_top.jpg",
        alt: "Funds and grants page with fund cards showing balances and purposes.",
      },
      {
        title: "Active commitments",
        caption: "Grant awards with spend against award and reporting dates.",
        src: "/media/canopy/S05_funds_active_commitments.jpg",
        alt: "Active commitments table with spend-versus-award bars and on-track status chips.",
      },
      {
        title: "Close question",
        caption: "A plain-language prompt sits beside the figures it refers to.",
        src: "/media/canopy/S06_budgets_close_question.jpg",
        alt: "Budget bars with a close-question callout about program supplies.",
      },
      {
        title: "Reports by category",
        caption: "A meeting-friendly view of where resources are going, grouped by category.",
        src: "/media/canopy/S07_reports_by_category.jpg",
        alt: "Reports page grouping spend by category with a board-packet context panel.",
      },
      {
        title: "Reports by fund",
        caption: "The same report regrouped by fund with a segmented control.",
        src: "/media/canopy/S08_reports_by_fund.jpg",
        alt: "Reports page after switching the segmented control to group by fund.",
      },
      {
        title: "Team and history",
        caption: "Who has access and a record of recent activity.",
        src: "/media/canopy/S09_team_history_top.jpg",
        alt: "Team and history page listing roles beside a timeline of recent entries.",
      },
    ],
    recordings: [
      {
        title: "Overview and budget pulse",
        length: "0:28",
        transcript:
          "The overview of a sample workspace: four balance cards and a latest-activity ledger. Scrolling down to the budget pulse, where category spending is shown as bars against plan. Colour marks how close each category is to its limit.",
      },
      {
        title: "Ledger and entry detail",
        length: "0:24",
        transcript:
          "Opening Transactions: a read-only ledger of twelve entries with search and filters. Selecting an entry expands its memo and reference below the row.",
      },
      {
        title: "Funds, grants and budgets",
        length: "0:30",
        transcript:
          "Funds and grants: balances by purpose, with restricted funds kept apart from unrestricted ones. Budgets: spending against plan by category, and a plain-language close question.",
      },
      {
        title: "Reports and team history",
        length: "0:36",
        transcript:
          "Reports: the same figures grouped by category, then toggled to group by fund. Team and history: who has access and a record of recent activity.",
      },
    ],
  },
  {
    id: "ai",
    categories: ["agents"],
    kindLabel: "Agent harness",
    title: "Agent workflows with verification built in",
    summary: "A harness where scripts and people, not the agent, decide what's done.",
    body: "Agents are fast and unreliable judges of their own work, so the harness separates doing from verifying. Each workflow is a directed acyclic graph. Mechanical steps are scripts that must pass, judgment steps pause for an agent or a person, and loops are bounded. Design, contracts and failing tests need human approval and are fingerprinted, so an agent can't quietly rewrite a test to get green. The result is delegation with evidence: each pull request carries the commands that were run and their output.",
    tags: ["Python", "DAG engine", "Claude Code", "Hooks", "Plugins"],
    facts: [
      ["Scope", "Personas, skills and six installable plugins"],
      ["Approach", "Deterministic workflows, scripted gates, human approval at judgment points"],
      ["Gates", "Design, contracts and failing tests need a person"],
    ],
    links: [requestAccess("propermade/ai")],
  },
];
