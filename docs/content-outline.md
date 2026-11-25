# propermade.dev: content outline (draft for approval)

Built from the brief (Nov 24 answers) and the `ui` and `ai` repos. Nothing here is final copy.
Tags: **[brief]** decided in the brief, **[repo]** read from `propermade/ui` or `propermade/ai`,
**[resume]** from your resumes per the brief, **[TODO]** needs you.

Rules carried from the brief: no private DriveWealth content, no DriveWealth figures (none are public),
no art work on the site, no phone number, WCAG 2.2 AA floor, reduced-motion respected, no analytics banner.

## Site map

| Route  | Purpose                                                                |
| ------ | ---------------------------------------------------------------------- |
| `/`    | Long home page: lead claim, selected work, about, experience, contact. |
| `/ui/` | Depth page for the design system.                                      |
| `/ai/` | Depth page for the agent workflow.                                     |

A résumé page is deferred; the public PDF covers it.

## `/` Home

1. **Hero**
   - Name: Ryan Watkins-Hughes. Title: Design Systems & Frontend Platform Lead. [brief]
   - Optional second line: "Accessibility & UX · Agent Frameworks". [brief]
   - Lead claim: "I build frontend platforms and design systems for products at scale, turning design rules into accessible code that enforces them. I came to engineering through art, with fine arts degrees from Pratt and Tulane." [brief]
   - Links: Selected work, Contact.
2. **Selected work** (two cards, each one sentence plus a link to its page)
   - `ui`: the design system this site is built from. [repo]
   - `ai`: the agent workflow that builds and reviews code to a standard. [repo]
   - Line stating both are my own work, separate from anything built at DriveWealth. [brief]
3. **About**
   - Player-coach leadership first: hiring, mentoring, setting technical direction. Hands-on depth second,
     pointing at `ui` and `ai`. [brief]
   - Art background in one sentence (degrees only, no art work). [brief]
   - Accessibility as the through line. The site is the proof, so say what it meets. [brief]
4. **Experience** (plain, résumé level)
   - DriveWealth: role title, dates, plain description of what I own. No metrics, screens, code or architecture. [brief]
     [TODO: title, dates, one-line description you are comfortable publishing]
   - Global Holdings: led five engineers; billions in annual transactional volume; 35% faster release cycles. [resume]
   - AcrobatAnt: 50% better on-time delivery. [resume]
   - Anaconda: scaled frontend standards after a $24M Series A. [resume]
   - Razorfish: design system work for Fortune 20 accounts, client unnamed. [resume]
   - Teach For America; teaching at Tulane. [brief]
   - Overall: 15+ years. [resume]
   - Optional line: DriveWealth "supporting an average of more than 6 million trades per day", credited to
     DriveWealth, never as my metric (DriveWealth release, Jul 22, 2026). [brief]
5. **Contact**
   - Email as text [TODO: which address]; LinkedIn linkedin.com/in/ryan-watkins-hughes; public résumé PDF
     [TODO: PDF without phone number or DriveWealth figures]; calendar link for a first call [TODO: URL];
     GitHub only once `ui` and `ai` are public. [brief]

## `/ui/` The design system

Frame it as a design system first. The repo's reference app is built around trading-style grids; keep that as
one example, with its mock data stated plainly, and do not lead with it. [brief item 7]

1. **What it is and why**: one token source of truth (`propermade.tokens.json`) feeding the React component
   package, Storybook and Claude Design, so design rules become code that enforces them. [repo]
2. **Tokens**: code example of a token definition and its generated light and dark CSS. [repo]
3. **Components, live**: real components from `@propermade/core` rendered on the page, since the site is built
   from it. [brief, repo]
4. **A component's API in use**: short code example, e.g. a registered data source feeding a grid pane
   (mock data; not a production feed). [repo]
5. **Generated docs**: screenshots of the generated component docs and per-component `AGENTS.md`. [repo]
6. **Keyboard and state behaviour**: short recording with a transcript and captions. [brief]
7. **How it is held to a standard**: coverage gates, lint-in-CI, changesets, generated files never hand-edited. [repo]
8. **Resilience example (optional)**: per-pane error boundaries and worker-backed feeds, stated as a reference
   implementation. [repo]

## `/ai/` The agent workflow

1. **What it is and why**: a harness of personas, skills, plugins and a small DAG engine for a
   spec, build, review, ship, track workflow. [repo]
2. **The workflow, as steps**: the `ticket-to-pr` flow: Program Board check, spec, architect review,
   person-approved design, failing tests, implement loop, scope check, PR, CI fix loop. [repo]
   Shown as a diagram plus a short workflow example with its verification gates.
3. **Verification gates**: run what CI runs and paste evidence; adversarial review in a fresh context;
   guardrails hooks that block irreversible commands; a person approves the design. [repo]
4. **Honest status**: `planning/status.md` separates "works today" from scaffolded; the page mirrors that
   instead of overclaiming. [repo]
5. **Memory**: session log and committed topic notes so lessons survive a session. [repo]
6. **A run, start to passing gates**: screenshots and a short recording with a transcript. [brief]
7. **Tools, not frameworks**: guide agents with what is needed and let the consuming repo supply its own
   connections. [repo, memory note]

## Media to capture

| Item                         | Page   | Notes                                                     |
| ---------------------------- | ------ | --------------------------------------------------------- |
| Generated docs screenshots   | `/ui/` | From `docs:dev` or Storybook. Alt text on each.           |
| Keyboard and state recording | `/ui/` | Short, captioned, transcript beside it.                   |
| Agent run screenshots        | `/ai/` | Terminal output with no private data.                     |
| Agent run recording          | `/ai/` | Start to passing gates, captioned, transcript.            |
| DriveWealth material         | n/a    | Only if you confirm it is already public. Otherwise none. |

## Open questions

1. Email address to show, and the calendar URL.
2. DriveWealth role title, dates and one-line description.
3. Does "DriveWealth material that can be published" mean public-only material? The brief says none.
4. Public résumé PDF: you supply, or I draft a version without phone and figures.
5. Atkinson Hyperlegible for the site, to match the résumés?
