// Search and answer-engine metadata, generated from the content modules so it never drifts from the pages.
// Pure data and strings: used by scripts/prerender.ts at build time, never shipped to the browser.
import { home } from "./content/home";
import { site } from "./content/site";

export const siteUrl = "https://propermade.dev";

type PageMeta = { path: string; title: string; description: string };

export const pages: PageMeta[] = [
  {
    path: "/",
    title: `${site.name}: ${home.title}`,
    description: site.summary,
  },
  { path: "/work", title: `Selected Work · ${site.name}`, description: "Selected Work" },
];

const url = (path: string) => `${siteUrl}${path}`;
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Only facts already public in the brief: no phone, no DriveWealth figures. */
const person = {
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: site.name,
  jobTitle: site.title,
  url: siteUrl,
  description: site.summary,
  sameAs: [site.linkedin, ...(site.github ? [site.github] : [])],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Pratt Institute" },
    { "@type": "CollegeOrUniversity", name: "Tulane University" },
  ],
  knowsAbout: ["Design systems", "Frontend platforms", "Web accessibility", "Agent workflows"],
};

function jsonLd(page: PageMeta) {
  const graph: object[] = [
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: site.name, inLanguage: "en", publisher: { "@id": `${siteUrl}/#person` } },
    person,
  ];
  if (page.path === "/") {
    graph.push({ "@type": "ProfilePage", "@id": `${siteUrl}/#profile`, url: siteUrl, name: page.title, mainEntity: { "@id": `${siteUrl}/#person` }, isPartOf: { "@id": `${siteUrl}/#website` } });
  } else {
    graph.push(
      { "@type": "WebPage", "@id": `${url(page.path)}#page`, url: url(page.path), name: page.title, description: page.description, author: { "@id": `${siteUrl}/#person` }, isPartOf: { "@id": `${siteUrl}/#website` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
        { "@type": "ListItem", position: 2, name: page.path.replaceAll("/", ""), item: url(page.path) },
      ] },
    );
  }
  // "<" is escaped so page text can never close the script element.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
}

/** The <head> tags for a route: title, description, canonical, Open Graph, Twitter, JSON-LD. */
export function headFor(path: string): string {
  const page = pages.find((p) => p.path === path);
  if (!page) throw new Error(`No SEO entry for ${path}`);
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${url(path)}" />`,
    `<meta property="og:type" content="${path === "/" ? "profile" : "website"}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url(path)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<script type="application/ld+json">${jsonLd(page)}</script>`,
  ].join("\n    ");
}

export const sitemapXml = () =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${url(p.path)}</loc></url>`)
    .join("\n")}\n</urlset>\n`;

/**
 * Crawler policy. Retrieval bots fetch a page to answer a live question; training bots collect for model training.
 * Default is allow-all. This is the owner's call: flip `allow` to false to opt a bot out.
 */
export const crawlers: { agent: string; kind: "retrieval" | "training"; allow: boolean }[] = [
  { agent: "OAI-SearchBot", kind: "retrieval", allow: true },
  { agent: "ChatGPT-User", kind: "retrieval", allow: true },
  { agent: "PerplexityBot", kind: "retrieval", allow: true },
  { agent: "Claude-SearchBot", kind: "retrieval", allow: true },
  { agent: "Claude-User", kind: "retrieval", allow: true },
  { agent: "GPTBot", kind: "training", allow: true },
  { agent: "ClaudeBot", kind: "training", allow: true },
  { agent: "Google-Extended", kind: "training", allow: true },
  { agent: "Applebot-Extended", kind: "training", allow: true },
  { agent: "CCBot", kind: "training", allow: true },
];

export const robotsTxt = () =>
  [
    "User-agent: *",
    "Allow: /",
    "",
    ...crawlers.flatMap((c) => [`# ${c.kind}`, `User-agent: ${c.agent}`, c.allow ? "Allow: /" : "Disallow: /", ""]),
    `Sitemap: ${url("/sitemap.xml")}`,
    "",
  ].join("\n");

/** llms.txt: a plain-text map of the site for LLM tools. Public pages only. */
export const llmsTxt = () =>
  [
    `# ${site.name}`,
    "",
    `> ${site.summary}`,
    "",
    "## Pages",
    "",
    ...pages.map((p) => `- [${p.title}](${url(p.path)}): ${p.description}`),
    "",
    "## Contact",
    "",
    `- [LinkedIn](${site.linkedin})`,
    "",
  ].join("\n");
