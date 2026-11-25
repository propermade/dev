import { useId, useState, type KeyboardEvent } from "react";
import { projects, workIntro, type Project } from "../content/work";

type Kind = "all" | Project["kind"];
type Tab = "shots" | "rec" | "code";

const filters: { id: Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ui", label: "Design systems" },
  { id: "ai", label: "Agent workflows" },
];

function Placeholder({ title, meta, label, className = "" }: { title: string; meta: string; label: string; className?: string }) {
  return (
    <div className={`ph ${className}`} role="img" aria-label={label}>
      <div className="cap">
        <b>{title}</b>
        {meta}
      </div>
    </div>
  );
}

function Shots({ p }: { p: Project }) {
  const [i, setI] = useState(0);
  const s = p.shots[i]!;
  return (
    <>
      {s.src ? (
        <figure className="shot">
          <img src={s.src} alt={s.alt ?? s.title} loading="lazy" />
        </figure>
      ) : (
        <Placeholder title={s.title} meta={`Screenshot ${i + 1} · 1600×1000`} label={`Placeholder screenshot: ${s.title}`} />
      )}
      <p className="shotcap">{s.caption}</p>
      <div className="thumbs">
        {p.shots.map((x, n) => (
          <button
            key={x.title}
            type="button"
            className="thumb"
            aria-label={`Show screenshot ${n + 1}: ${x.title}`}
            aria-current={n === i ? "true" : undefined}
            onClick={() => setI(n)}
          >
            {n + 1}
          </button>
        ))}
      </div>
    </>
  );
}

function Recording({ p }: { p: Project }) {
  const r = p.recording;
  return (
    <>
      {r.src ? (
        <video controls preload="none" poster={r.poster} src={r.src}>
          {r.captions ? <track kind="captions" src={r.captions} default /> : null}
        </video>
      ) : (
        <Placeholder title={r.title} meta={`Recording · ${r.length} · captions on`} label={`Placeholder recording: ${r.title}`} className="rec" />
      )}
      <details>
        <summary>Transcript</summary>
        <p>{r.transcript}</p>
      </details>
    </>
  );
}

function Code({ p }: { p: Project }) {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const f = p.code[i]!;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(f.code);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    setTimeout(() => setCopied("idle"), 1500);
  };
  return (
    <>
      <div className="codebox">
        <div className="codebar">
          <div className="files">
            {p.code.map((c, n) => (
              <button key={c.file} type="button" className="file" aria-pressed={n === i} onClick={() => setI(n)}>
                {c.file}
              </button>
            ))}
          </div>
          <button type="button" className="copy" onClick={copy}>
            {copied === "ok" ? "Copied" : copied === "fail" ? "Select to copy" : "Copy"}
          </button>
        </div>
        <pre tabIndex={0}>
          <code className={`language-${f.lang}`}>{f.code}</code>
        </pre>
      </div>
      <p className="codenote">{f.note}. Placeholder snippet.</p>
    </>
  );
}

function ProjectSection({ p, n }: { p: Project; n: number }) {
  const [tab, setTab] = useState<Tab>("shots");
  const uid = useId();
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "shots", label: "Screenshots", count: p.shots.length },
    { id: "rec", label: "Recording", count: 1 },
    { id: "code", label: "Code", count: p.code.length },
  ];
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const next = tabs[(tabs.findIndex((t) => t.id === tab) + d + tabs.length) % tabs.length]!;
    setTab(next.id);
    document.getElementById(`${uid}-${next.id}`)?.focus();
  };
  return (
    <section className="project" id={p.id} aria-labelledby={`${p.id}-h`}>
      <div className="sec-head">
        <span className="label">{String(n + 1).padStart(2, "0")}</span>
        <h2 id={`${p.id}-h`}>{p.title}</h2>
      </div>
      <div className="cols">
        <div className="info">
          <p className="sum">{p.summary}</p>
          <p>{p.body}</p>
          <ul className="tags" aria-label="Technologies">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <dl className="rows">
            {p.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="links">
            {p.links.map((l, i) => (
              <a key={l.label} className={i === 0 ? "btn primary" : "btn"} href={l.href} target="_blank" rel="noopener">
                {l.label}{" "}
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="media">
          <div className="tabs" role="tablist" aria-label={`${p.title} media`} onKeyDown={onKey}>
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`${uid}-${t.id}`}
                type="button"
                role="tab"
                className="tab"
                aria-selected={tab === t.id}
                aria-controls={`${uid}-panel`}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                <span className="n">{t.count}</span>
              </button>
            ))}
          </div>
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${tab}`}>
            {tab === "shots" ? <Shots p={p} /> : tab === "rec" ? <Recording p={p} /> : <Code p={p} />}
          </div>
        </div>
      </div>
    </section>
  );
}

export const Work = () => {
  const [filter, setFilter] = useState<Kind>("all");
  const shown = projects.filter((p) => filter === "all" || p.kind === filter);
  return (
    <>
      <div className="page-head">
        <p className="label">Selected work</p>
        <h1>{workIntro.title}</h1>
        <p>{workIntro.summary}</p>
      </div>
      <div className="filters" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button key={f.id} type="button" className="btn" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <ul className="cards">
        {shown.map((p) => (
          <li key={p.id}>
            <a className={p.kind === "ai" ? "card blue" : "card"} href={`#${p.id}`}>
              <span className="label">{p.kindLabel}</span>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <span className="go">
                View project{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {shown.map((p) => (
        <ProjectSection key={p.id} p={p} n={projects.indexOf(p)} />
      ))}
    </>
  );
};
