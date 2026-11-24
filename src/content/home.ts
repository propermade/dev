import type { PageContent } from "./types";

export const aboutLead =
  "I'm a product engineering lead and UI architect who thinks like a designer and ships like an engineer. My focus is design systems, agent orchestration frameworks, and real-time, low-latency platforms for high-volume streaming data.";

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
        { kind: "p", text: aboutLead },
        { kind: "p", text: "I studied painting at Pratt, but I was more builder and experimenter than painter. A more traditional program might have asked me to leave. Instead I taught myself to spec, source and assemble a desktop from scratch, and started making interactive Flash artworks and abstract websites." },
        { kind: "p", text: "Pratt gave me the confidence that I could solve interactive, technical problems creatively. In my first freelance design role, the company wasn't ready for the boom in web business and kept losing pitches to larger interactive agencies. I volunteered to figure it out and became its de facto web development department, a one-person freelance team." },
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
