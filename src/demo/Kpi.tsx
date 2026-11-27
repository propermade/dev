import { Card, Text } from "@propermade/core/components";

type Tone = "good" | "bad" | "neutral";

export interface KpiProps {
  label: string;
  value: string;
  /** The change over the sparkline's span, as a fraction (0.02 is up 2%); omit for none. */
  delta?: number;
  /** Whether a rise is good news, bad news or neither. */
  upIs?: Tone;
  spark?: readonly number[];
  /** 0 to 1, drawn as a bar instead of a sparkline. */
  progress?: number;
  detail?: string;
}

const TONE_COLOR: Record<Tone, string> = {
  good: "var(--color-text-success)",
  bad: "var(--color-text-error)",
  neutral: "var(--color-text-secondary)",
};

/** A series scaled into a 100 by 32 box, as a line and a closed area under it. */
function sparkPath(values: readonly number[]): [line: string, area: string] {
  const lo = Math.min(...values);
  const span = Math.max(...values) - lo || 1;
  const step = 100 / Math.max(1, values.length - 1);
  const coords = values.map(
    (v, i) => `${(i * step).toFixed(2)},${(30 - ((v - lo) / span) * 28).toFixed(2)}`,
  );
  const line = `M${coords.join("L")}`;
  return [line, `${line}L100,32L0,32Z`];
}

function Sparkline({ values, color }: { values: readonly number[]; color: string }) {
  const [line, area] = sparkPath(values);
  return (
    <svg
      className="kpi-spark"
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ color }}
    >
      <path d={area} fill="currentColor" opacity={0.12} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A KPI tile in the Leafline overview's style: a label, a value, its change and a small chart. */
export function Kpi({ label, value, delta, upIs = "neutral", spark, progress, detail }: KpiProps) {
  const up = (delta ?? 0) > 0;
  const tone: Tone =
    delta === undefined || upIs === "neutral" || Math.abs(delta) < 0.0005
      ? "neutral"
      : up === (upIs === "good")
        ? "good"
        : "bad";
  const color = tone === "neutral" ? "var(--color-accent)" : TONE_COLOR[tone];
  return (
    <Card>
      <section className="kpi" aria-label={label}>
        <Text type="supporting" weight="medium">
          {label}
        </Text>
        <span className="kpi-value">{value}</span>
        <span className="kpi-detail" style={{ color: TONE_COLOR[tone] }}>
          {delta !== undefined && Math.abs(delta) >= 0.0005 ? (
            <>
              <span aria-hidden="true">{up ? "▲" : "▼"} </span>
              {Math.abs(delta * 100).toFixed(1)}%{detail ? ` ${detail}` : ""}
            </>
          ) : (
            (detail ?? " ")
          )}
        </span>
        {spark && spark.length > 1 ? <Sparkline values={spark} color={color} /> : null}
        {progress !== undefined ? (
          <span className="kpi-track" aria-hidden="true">
            <span className="kpi-bar" style={{ inlineSize: `${Math.round(progress * 100)}%` }} />
          </span>
        ) : null}
      </section>
    </Card>
  );
}
