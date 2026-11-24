import { Button, Card, Heading, Text } from "@propermade/core/base";
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
      <section className="hero" aria-labelledby="hero-h">
        <Text type="label" className="eyebrow">{site.title}</Text>
        <Heading level={1} type="display-1" id="hero-h">{site.name}</Heading>
        <p className="lead">{site.lead}</p>
        <div className="cta">
          <Button label="See selected work" variant="primary" href="#work" />
          <Button label="Contact" variant="secondary" href="#contact" />
        </div>
        <p className="subtle">{site.subtitle}</p>
      </section>
      <section aria-labelledby="work-h" id="work">
        <Heading level={2} id="work-h">Selected work</Heading>
        <p>Two projects of my own, separate from anything built at DriveWealth.</p>
        <div className="cards">
          <Card variant="default" className="work-card">
            <Heading level={3}><Link to="/ui/">ui</Link></Heading>
            <p>The design system this site is built from: one token source, accessible components, generated docs.</p>
          </Card>
          <Card variant="default" className="work-card">
            <Heading level={3}><Link to="/ai/">ai</Link></Heading>
            <p>The agent workflow that builds and reviews code to a standard, with verification gates at every step.</p>
          </Card>
        </div>
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
