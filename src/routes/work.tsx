import { ui } from "../content/ui";
import { Section } from "../components/Blocks";
import { LiveComponents, TokenEditor } from "../components/UiDemo";

export const Work = () => (
  <div className="band page">
    <h1>{ui.title}</h1>
    <p>{ui.summary}</p>
    {ui.sections.map((s) => (
      <Section key={s.id} section={s}>
        {s.id === "tokens" ? <TokenEditor /> : s.id === "components" ? <LiveComponents /> : null}
      </Section>
    ))}
  </div>
);