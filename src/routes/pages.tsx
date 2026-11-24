import { Link } from "@tanstack/react-router";
import { Section } from "../components/Blocks";
import { ai } from "../content/ai";
import { home } from "../content/home";
import { site } from "../content/site";
import type { PageContent } from "../content/types";
import { ui } from "../content/ui";

function Sections({ page }: { page: PageContent }) {
  return page.sections.map((s) => <Section key={s.id} section={s} />);
}

export function HomePage() {
  return (
    <>
      <h1>{site.name}</h1>
      <p className="title">{site.title}</p>
      <p>{site.subtitle}</p>
      <p>{site.lead}</p>
      <section aria-labelledby="work-h" id="work">
        <h2 id="work-h">Selected work</h2>
        <p>Two projects of my own, separate from anything built at DriveWealth.</p>
        <ul>
          <li><Link to="/ui/">ui</Link>: the design system this site is built from.</li>
          <li><Link to="/ai/">ai</Link>: the agent workflow that builds and reviews code to a standard.</li>
        </ul>
      </section>
      <Sections page={{ ...home, sections: home.sections.filter((s) => s.id !== "work") }} />
      <Contact />
    </>
  );
}

function Contact() {
  return (
    <section aria-labelledby="contact-h" id="contact">
      <h2 id="contact-h">Contact</h2>
      <ul>
        {site.email ? <li>Email: {site.email}</li> : null}
        <li><a href={site.linkedin}>LinkedIn</a></li>
        {site.resumePdf ? <li><a href={site.resumePdf}>Résumé (PDF)</a></li> : null}
        {site.calendar ? <li><a href={site.calendar}>Book a first call</a></li> : null}
        {site.github ? <li><a href={site.github}>GitHub</a></li> : null}
      </ul>
    </section>
  );
}

export const UiPage = () => (
  <>
    <h1>{ui.title}</h1>
    <p>{ui.summary}</p>
    <Sections page={ui} />
  </>
);

export const AiPage = () => (
  <>
    <h1>{ai.title}</h1>
    <p>{ai.summary}</p>
    <Sections page={ai} />
  </>
);
