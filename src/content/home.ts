import type { PageContent } from "./types";

export const home: PageContent = {
  title: "Design Systems & Frontend Platform Lead",
  summary: "Selected work, about, experience and contact.",
  sections: [
    {
      id: "work",
      heading: "Selected work",
      blocks: [
        { kind: "p", text: "Two projects of my own, separate from anything built at DriveWealth." },
      ],
    },
    {
      id: "about",
      heading: "About",
      blocks: [
        { kind: "todo", note: "Player-coach leadership first (hiring, mentoring, technical direction), hands-on depth second. One sentence on the art background (degrees only)." },
      ],
    },
    {
      id: "experience",
      heading: "Experience",
      blocks: [
        { kind: "todo", note: "DriveWealth: title, dates, one-line description only. No metrics, screens, code or architecture." },
        {
          kind: "list",
          items: [
            "15+ years building frontend platforms and design systems.",
            "Global Holdings: led five engineers; billions in annual transactional volume; 35% faster release cycles.",
            "AcrobatAnt: 50% better on-time delivery.",
            "Anaconda: scaled frontend standards after a $24M Series A.",
            "Razorfish: design system work for Fortune 20 accounts.",
            "Teach For America; teaching at Tulane.",
          ],
        },
      ],
    },
  ],
};
