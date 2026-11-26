import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { palette, ratio, type Token } from "../theme/theme";
import { home } from "../content/home";
import { site } from "../content/site";
import { InboxIcon } from "@heroicons/react/16/solid";

const swatches = [
  { name: "Ink", token: "bg" as Token, mode: 1 as const, ratio: ratio("fg", "bg", 1) },
  { name: "Paper", token: "bg" as Token, mode: 0 as const, ratio: ratio("fg", "bg", 0) },
  {
    name: "Signal",
    token: "signal" as Token,
    mode: 0 as const,
    ratio: ratio("signal", "bg", 1),
  },
  { name: "Link", token: "link" as Token, mode: 0 as const, ratio: ratio("link", "bg", 0) },
];

function Tokens() {
  return (
    <ul
      className="tokens"
      aria-label="The site's color tokens, each with its measured text contrast ratio"
    >
      {swatches.map((s) => (
        <li key={s.name}>
          <span
            className="chip"
            style={{ background: palette[s.token][s.mode] }}
            aria-hidden="true"
          />
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
      <span className="label hl" style={{ "--i": 1 } as CSSProperties}>
        {n}
      </span>
      <h2 id={id}>{children}</h2>
    </div>
  );
}

export function Home() {
  return (
    <>
      <div className="hero-wrap">
        <section className="hero" aria-labelledby="hero-h">
          <div>
            <p className="label rise" style={{ "--i": 0 } as CSSProperties}>
              {site.title}
            </p>
            <p className="lead rise" style={{ "--i": 3 } as CSSProperties}>
              I lead{" "}
              <span className="hl" style={{ "--i": 0 } as CSSProperties}>
                frontend platform
              </span>{" "}
              and{" "}
              <span className="hl" style={{ "--i": 0 } as CSSProperties}>
                design systems
              </span>{" "}
              strategy: the architecture, standards and teams that let product organizations ship
              accessible interfaces consistently at scale. I came to engineering through art, with
              fine arts degrees from Pratt Institute and Tulane University.
            </p>
            <div className="cta rise" style={{ "--i": 4 } as CSSProperties}>
              <Link to="/work/" className="btn primary">
                Selected work{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <a className="btn" href="#contact">
                Contact
              </a>
            </div>
            <p className="label sub rise" style={{ "--i": 5 } as CSSProperties}>
              {site.subtitle}
            </p>
          </div>
          <div className="rise" style={{ "--i": 4 } as CSSProperties}>
            <Tokens />
          </div>
        </section>
      </div>
      <section className="band sec-about reveal" aria-labelledby="about-h" id="about">
        <SecHead n="01" id="about-h">
          About
        </SecHead>
        {home.sections
          .find((s) => s.id === "about")
          ?.blocks.map((b, i) =>
            b.kind === "p" ? (
              <p key={i} className={i === 0 ? "about-lead" : undefined}>
                {b.text}
              </p>
            ) : null,
          )}
      </section>
      <section className="band reveal" aria-labelledby="experience-h" id="experience">
        <SecHead n="02" id="experience-h">
          Experience
        </SecHead>
        <dl className="rows">
          <div>
            <dt>DriveWealth</dt>
            <dd>
              <span className="position">Principal Engineer & Frontend Platform Lead</span> ·
              February 2021 – Present
              <br />
              Lead frontend architecture and the enterprise design system for a fintech trading
              platform, and manage and mentor a distributed engineering team as player-coach.
            </dd>
          </div>
          <div>
            <dt>Global Holdings</dt>
            <dd>
              <span className="position">Lead Frontend Engineer</span> · 2019 – 2021
              <br />
              Led a team of five engineers on web platforms processing billions in annual
              transactional volume, and cut release cycle turnaround by 35%.
            </dd>
          </div>
          <div>
            <dt>AcrobatAnt</dt>
            <dd>
              <span className="position">Interactive Director</span> · 2017 – 2019
              <br />
              Managed designers and engineers delivering zero-to-one web products, and improved
              on-time milestone delivery by 50%.
            </dd>
          </div>
          <div>
            <dt>Anaconda</dt>
            <dd>
              <span className="position">User Interface Architect</span> · 2016 – 2017
              <br />
              Led UI platform architecture and a cross-functional engineering and design team, and
              scaled frontend standards after a $24M Series A.
            </dd>
          </div>
          <div>
            <dt>Razorfish</dt>
            <dd>
              <span className="position">Senior UX Engineer</span> · 2013 – 2016 <br />
              Built WCAG-accessible web applications and design system architectures for Fortune 20
              accounts.
            </dd>
          </div>
          <div>
            <dt>Earlier Experience</dt>
            <dd>
              <span className="position">Web Engineering Manager</span> · Teach For America
              <br />
              <span className="position">Adjunct Assistant Professor</span> · Tulane University
            </dd>
          </div>
        </dl>
      </section>
      <Contact />
    </>
  );
}

function Contact() {
  return (
    <section className="band reveal" aria-labelledby="contact-h" id="contact">
      <SecHead n="03" id="contact-h">
        Contact
      </SecHead>
      <ul className="contact-links">
        {site.email ? (
          <li>
            <a href={`mailto:${site.email}`}>
              {site.email}
              <InboxIcon className="email" />
            </a>
          </li>
        ) : null}
        <li>
          <a href={site.linkedin}>
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </li>
        {site.resumePdf ? (
          <li>
            <a href={site.resumePdf}>Résumé (PDF)</a>
          </li>
        ) : null}
        {site.calendar ? (
          <li>
            <a href={site.calendar}>Book a first call</a>
          </li>
        ) : null}
        {site.github ? (
          <li>
            <a href={site.github}>GitHub</a>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
