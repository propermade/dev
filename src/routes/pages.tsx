import type { CSSProperties } from "react";
import { palette, ratio, type Token } from "../design/palette";
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

const swatches = [
  { name: "Ink", token: "bg" as Token, mode: 1 as const, ratio: ratio("fg", "bg", 1) },
  { name: "Paper", token: "bg" as Token, mode: 0 as const, ratio: ratio("fg", "bg", 0) },
  { name: "Signal", token: "signal" as Token, mode: 0 as const, ratio: ratio("onSignal", "signal", 0) },
  { name: "Link", token: "link" as Token, mode: 0 as const, ratio: ratio("link", "bg", 0) },
];

function Tokens() {
  return (
    <ul className="tokens" aria-label="The site's colour tokens, each with its measured text contrast ratio">
      {swatches.map((s) => (
        <li key={s.name}>
          <span className="chip" style={{ background: palette[s.token][s.mode] }} aria-hidden="true" />
          <span>
            <b>{s.name}</b>
            <small>
              {palette[s.token][s.mode]} · {s.ratio.toFixed(1)}:1
            </small>
          </span>
        </li>
      ))}
    </ul>
  );
}

function SecHead({ n, id, children }: { n: string; id: string; children: string }) {
  return (
    <div className="sec-head">
      <span className="label">{n}</span>
      <h2 id={id}>{children}</h2>
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <div className="dark-band">
        <section className="hero" aria-labelledby="hero-h">
          <div>
            <p className="label rise" style={{ "--i": 0 } as CSSProperties}>{site.title}</p>
            <h1 id="hero-h">
              <span className="rise" style={{ "--i": 1 } as CSSProperties}>Ryan</span>
              <span className="rise" style={{ "--i": 2 } as CSSProperties}>Watkins-Hughes</span>
            </h1>
            <p className="lead rise" style={{ "--i": 3 } as CSSProperties}>
              I build the <span className="hl" style={{ "--i": 0 } as CSSProperties}>design systems</span> and frontend platforms that product
              teams depend on, turning design rules into <span className="hl" style={{ "--i": 1 } as CSSProperties}>accessible code that enforces them</span>.
              I came to engineering <span className="hl" style={{ "--i": 2 } as CSSProperties}>through art</span>, with fine arts degrees from Pratt and Tulane.
            </p>
            <div className="cta rise" style={{ "--i": 4 } as CSSProperties}>
              <a className="btn primary" href="#work">See selected work <span className="arrow" aria-hidden="true">→</span></a>
              <a className="btn" href="#contact">Contact</a>
            </div>
            <p className="label sub rise" style={{ "--i": 5 } as CSSProperties}>{site.subtitle}</p>
          </div>
          <div className="rise" style={{ "--i": 4 } as CSSProperties}>
            <Tokens />
          </div>
        </section>
      </div>
      <section className="band reveal" aria-labelledby="work-h" id="work">
        <SecHead n="01" id="work-h">Selected work</SecHead>
        <p>Two projects of my own, separate from anything built at DriveWealth.</p>
        <ul className="cards">
          <li>
            <Link to="/ui/" className="card blue">
              <span className="idx" aria-hidden="true">ui</span>
              <h3>Design system</h3>
              <p>The system this site is built from: one token source, accessible components, generated docs.</p>
              <span className="go">Read the case <span className="arrow" aria-hidden="true">→</span></span>
            </Link>
          </li>
          <li>
            <Link to="/ai/" className="card">
              <span className="idx" aria-hidden="true">ai</span>
              <h3>Agent workflow</h3>
              <p>The harness that builds and reviews code to a standard, with verification gates at every step.</p>
              <span className="go">Read the case <span className="arrow" aria-hidden="true">→</span></span>
            </Link>
          </li>
        </ul>
      </section>
      <section className="band reveal" aria-labelledby="about-h" id="about">
        <SecHead n="02" id="about-h">About</SecHead>
        {home.sections.find((s) => s.id === "about")?.blocks.map((b, i) =>
          b.kind === "p" ? <p key={i} className={i === 0 ? "about-lead" : undefined}>{b.text}</p> : null,
        )}
        <p><a href={site.linkedin}>Connect on LinkedIn <span aria-hidden="true">↗</span></a></p>
      </section>
      <section className="band reveal" aria-labelledby="experience-h" id="experience">
        <SecHead n="03" id="experience-h">Experience</SecHead>
        <dl className="rows">
          <div><dt>DriveWealth</dt><dd>Principal Engineer &amp; Frontend Platform Lead, February 2021 to present. Lead the frontend platform and design system for a fintech trading platform, and manage a distributed engineering team as player-coach.</dd></div>
          <div><dt>Global Holdings</dt><dd>Led five engineers; billions in annual transactional volume; 35% faster release cycles.</dd></div>
          <div><dt>AcrobatAnt</dt><dd>50% better on-time delivery.</dd></div>
          <div><dt>Anaconda</dt><dd>Scaled frontend standards after a $24M Series A.</dd></div>
          <div><dt>Razorfish</dt><dd>Design system work for Fortune 20 accounts.</dd></div>
          <div><dt>Teaching</dt><dd>Teach For America; teaching at Tulane.</dd></div>
          <div><dt>Overall</dt><dd>15+ years building frontend platforms and design systems.</dd></div>
        </dl>
      </section>
      <Contact />
    </>
  );
}

function Contact() {
  return (
    <section className="band reveal" aria-labelledby="contact-h" id="contact">
      <SecHead n="04" id="contact-h">Contact</SecHead>
      <ul className="contact-links">
        {site.email ? <li><a href={`mailto:${site.email}`}>{site.email}</a></li> : null}
        <li><a href={site.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a></li>
        {site.resumePdf ? <li><a href={site.resumePdf}>Résumé (PDF)</a></li> : null}
        {site.calendar ? <li><a href={site.calendar}>Book a first call</a></li> : null}
        {site.github ? <li><a href={site.github}>GitHub</a></li> : null}
      </ul>
    </section>
  );
}

export const UiPage = () => (
  <div className="band page">
    <h1>{ui.title}</h1>
    <p>{ui.summary}</p>
    <Sections page={ui} />
  </div>
);

export const AiPage = () => (
  <div className="band page">
    <h1>{ai.title}</h1>
    <p>{ai.summary}</p>
    <Sections page={ai} />
  </div>
);
