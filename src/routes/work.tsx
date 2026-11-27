import { Dialog, Layout, Text } from "@propermade/core/components";
import { useId, useState, type KeyboardEvent } from "react";

import { projects, workIntro, type Project } from "../content/work";
import { Highlighted } from "../highlight";

type Kind = "all" | Project["kind"];
type Tab = "shots" | "rec" | "code";

const filters: { id: Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ui", label: "Design systems & applications" },
  { id: "ai", label: "Agent harness" },
];

function Placeholder({
  title,
  meta,
  label,
  className = "",
}: {
  title: string;
  meta: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`ph ${className}`} role="img" aria-label={label}>
      <div className="cap">
        <b>{title}</b>
        {meta}
      </div>
    </div>
  );
}

function Empty({ what }: { what: string }) {
  return <p className="shotcap">No {what} yet.</p>;
}

function Shots({ p }: { p: Project }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const shots = p.shots ?? [];
  const s = shots[i];
  if (!s) return <Empty what="screenshots" />;
  return (
    <>
      {s.src ? (
        <figure className="shot">
          <button
            type="button"
            className="enlarge"
            aria-label={`Enlarge screenshot: ${s.title}`}
            onClick={() => setOpen(true)}
          >
            <img src={s.src} alt={s.alt ?? s.title} loading="lazy" />
          </button>
          <Dialog.Root
            isOpen={open}
            onOpenChange={setOpen}
            purpose="info"
            width={1280}
            maxHeight="92dvh"
          >
            <Layout.Root
              height="auto"
              header={<Dialog.Header title={s.title} subtitle={s.caption} onOpenChange={setOpen} />}
              content={
                <Layout.Content>
                  <img className="enlarged" src={s.src} alt={s.alt ?? s.title} />
                </Layout.Content>
              }
            />
          </Dialog.Root>
          {p.disclaimer && (
            <Text size="xsm">
              <em>{p.disclaimer}</em>
            </Text>
          )}
        </figure>
      ) : (
        <Placeholder
          title={s.title}
          meta={`Screenshot ${i + 1} · 1600×1000`}
          label={`Placeholder screenshot: ${s.title}`}
        />
      )}
      <p className="shotcap">{s.caption}</p>
      <div className="thumbs">
        {shots.map((x, n) => (
          <button
            key={x.title}
            type="button"
            className={x.src ? "thumb has-img" : "thumb"}
            aria-label={`Show screenshot ${n + 1}: ${x.title}`}
            aria-current={n === i ? "true" : undefined}
            onClick={() => setI(n)}
          >
            {x.src ? <img src={x.src} alt="" loading="lazy" /> : n + 1}
          </button>
        ))}
      </div>
    </>
  );
}

function Recording({ p }: { p: Project }) {
  const [i, setI] = useState(0);
  const recordings = p.recordings ?? [];
  const r = recordings[i];
  if (!r) return <Empty what="recordings" />;
  return (
    <>
      {r.src ? (
        <video key={r.src} controls preload="none" poster={r.poster} src={r.src}>
          {r.captions ? (
            <track kind="captions" src={r.captions} srcLang="en" label="English" default />
          ) : null}
        </video>
      ) : (
        <Placeholder
          title={r.title}
          meta={`Recording · ${r.length} · captions on`}
          label={`Placeholder recording: ${r.title}`}
          className="rec"
        />
      )}
      {recordings.length > 1 ? (
        <div className="thumbs">
          {recordings.map((x, n) => (
            <button
              key={x.title}
              type="button"
              className="file"
              aria-pressed={n === i}
              onClick={() => setI(n)}
            >
              {x.title}
            </button>
          ))}
        </div>
      ) : null}
      <details>
        <summary>Transcript</summary>
        <p>{r.transcript}</p>
      </details>
    </>
  );
}

function Code({ p }: { p: Project }) {
  const [i, setI] = useState(0);
  const snippets = p.code ?? [];
  const f = snippets[i];
  if (!f) return <Empty what="code" />;
  return (
    <>
      <div className="codebox">
        <div className="codebar">
          <div className="files">
            {snippets.map((c, n) => (
              <button
                key={c.file}
                type="button"
                className="file"
                aria-pressed={n === i}
                onClick={() => setI(n)}
              >
                {c.file}
              </button>
            ))}
          </div>
        </div>
        <pre tabIndex={0}>
          <code className={`language-${f.lang}`}>
            <Highlighted code={f.code} lang={f.lang} />
          </code>
        </pre>
      </div>
      <p className="codenote">{f.note}.</p>
    </>
  );
}

function ProjectSection({ p, n }: { p: Project; n: number }) {
  const [tab, setTab] = useState<Tab>("shots");
  const uid = useId();
  const hasMedia = Boolean(p.shots?.length || p.recordings?.length || p.code?.length);
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "shots", label: "Screenshots", count: p.shots?.length ?? 0 },
    // { id: "rec", label: "Recording", count: p.recordings?.length ?? 0 },
    // { id: "code", label: "Code", count: p.code?.length ?? 0 },
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
      <div className={hasMedia ? "cols" : "cols solo"}>
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
              <a
                key={l.label}
                className={i === 0 ? "btn primary" : "btn"}
                href={l.href}
                {...(l.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener" })}
              >
                {l.label}
                {l.href.startsWith("mailto:") ? null : (
                  <>
                    {" "}
                    <span className="arrow" aria-hidden="true">
                      ↗
                    </span>
                  </>
                )}
              </a>
            ))}
          </div>
        </div>
        {hasMedia ? (
          <div className="media">
            <div role="tablist" aria-label={`${p.title} media`} onKeyDown={onKey}>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`${uid}-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`${uid}-panel`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>
            <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${tab}`}>
              {tab === "shots" ? (
                <Shots p={p} />
              ) : tab === "rec" ? (
                <Recording p={p} />
              ) : (
                <Code p={p} />
              )}
            </div>
          </div>
        ) : null}
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
          <button
            key={f.id}
            type="button"
            className="btn"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {shown.map((p) => (
        <ProjectSection key={p.id} p={p} n={projects.indexOf(p)} />
      ))}
    </>
  );
};
