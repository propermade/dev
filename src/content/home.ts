import type { PageContent } from "./types";

export const aboutLead =
  "I'm an engineering leader and UI architect who works where design, engineering and organizational standards meet. My focus is platform design systems, agent orchestration frameworks, and application architecture for real-time, high-volume, streaming data.";

export const home: PageContent = {
  title: "Design Systems & Frontend Platform Lead",
  summary: "Selected work, about, experience and contact.",
  sections: [
    {
      id: "work",
      heading: "Selected work",
      blocks: [
        {
          kind: "p",
          text: "Independent work on design systems and agent workflows, where tooling enforces the standards.",
        },
      ],
    },
    {
      id: "about",
      heading: "About",
      blocks: [
        { kind: "p", text: aboutLead },
        {
          kind: "p",
          text: "Over 15 years I have moved from building interfaces to building the platforms and teams behind them: shared architecture, accessibility standards and review practices that many product teams can adopt without slowing down. I care most about standards that hold up across an organization, which means encoding them in tooling instead of relying on reminders.",
        },
        {
          kind: "p",
          text: "I came to engineering through art and design. I studied painting at Pratt Institute, then taught myself to build, and the mix of craft and systems thinking still shapes my work. Design rules should be precise enough to enforce and clear enough that teams choose to follow them. In my first freelance design role I turned a gap in the company into its web development function, and I have been building capability, not just shipping features, ever since.",
        },
      ],
    },
    {
      id: "experience",
      heading: "Experience",
      blocks: [
        {
          kind: "list",
          items: [
            "DriveWealth: Principal Engineer & Frontend Platform Lead, February 2021 to present. Lead the frontend platform and design system for a fintech trading platform, and manage a distributed engineering team as player-coach.",
            "Global Holdings: led five engineers; billions in annual transactional volume; 35% faster release cycles.",
            "AcrobatAnt: 50% better on-time delivery.",
            "Anaconda: scaled frontend standards after a $24M Series A.",
            "Razorfish: design system work for Fortune 20 accounts.",
            "Teach For America; teaching at Tulane University.",
            "15+ years building frontend platforms and design systems.",
          ],
        },
      ],
    },
  ],
};
