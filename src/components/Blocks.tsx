import type { Block, Media, Section as SectionData } from "../content/types";

export function MediaFigure({ media }: { media: Media }) {
  return (
    <figure>
      {media.kind === "image" ? (
        <img src={media.src} alt={media.alt} loading="lazy" />
      ) : (
        <>
          <video controls preload="none" poster={media.poster} src={media.src}>
            <track kind="captions" src={media.captions} default />
          </video>
          <details>
            <summary>Transcript</summary>
            <p>{media.transcript}</p>
          </details>
        </>
      )}
      {media.caption ? <figcaption>{media.caption}</figcaption> : null}
    </figure>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "p":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <figure>
          {block.title ? <figcaption>{block.title}</figcaption> : null}
          <pre tabIndex={0}>
            <code className={`language-${block.lang}`}>{block.code}</code>
          </pre>
        </figure>
      );
    case "media":
      return <MediaFigure media={block.media} />;
    case "todo":
      return <p className="todo">Draft: {block.note}</p>;
  }
}

export function Section({ section }: { section: SectionData }) {
  return (
    <section aria-labelledby={`${section.id}-h`} id={section.id}>
      <h2 id={`${section.id}-h`}>{section.heading}</h2>
      {section.blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </section>
  );
}
