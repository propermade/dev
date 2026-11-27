// No subpath entry for charts yet, so this comes from the root entry.
import { TimeSeriesChart, type TimeSeries } from "@propermade/core";
import { AppShell, Card, Text } from "@propermade/core/components";
import { AppGrid, DataSourcesProvider, type AppGridPane } from "@propermade/core/grid";
import { useEffect, useMemo, useState } from "react";

import { useThemeMode } from "../components/ThemeShell";
import { FAULT_CHANNEL, type Feed } from "./feeds";
import { Kpi } from "./Kpi";
import { demoSources } from "./sources";

// Declared at module scope so AppGrid sees a stable reference.
const panes: AppGridPane[] = [
  { id: "equities", config: { source: "demo-equities" } },
  { id: "crypto", config: { source: "demo-crypto" } },
];

const POINTS = 240;
const SAMPLE_MS = 250;

interface Point {
  time: number;
  value: number;
}
type Walks = Record<"index" | "equities" | "crypto" | "throughput" | "latency", Point[]>;

const BASES: Record<keyof Walks, { base: number; volatility: number }> = {
  index: { base: 100, volatility: 0.01 },
  equities: { base: 96, volatility: 0.01 },
  crypto: { base: 104, volatility: 0.01 },
  // Two grids at about 3,000 updates a second each.
  throughput: { base: 6000, volatility: 0.03 },
  latency: { base: 12, volatility: 0.08 },
};

function seed(): Walks {
  const start = Math.floor(Date.now() / 1000) - POINTS;
  const walk = (base: number, volatility: number): Point[] => {
    let v = base;
    return Array.from({ length: POINTS }, (_, i) => {
      v *= 1 + (Math.random() - 0.5) * volatility;
      return { time: start + i, value: v };
    });
  };
  return Object.fromEntries(
    (Object.keys(BASES) as (keyof Walks)[]).map((k) => [
      k,
      walk(BASES[k].base, BASES[k].volatility),
    ]),
  ) as Walks;
}

/** Random walks sampled on the main thread, so the cards and chart have something live to draw. */
function useLiveWalks(): Walks {
  const [walks, setWalks] = useState<Walks>(() => seed());
  useEffect(() => {
    const id = setInterval(() => {
      setWalks((prev) => {
        const next = {} as Walks;
        for (const k of Object.keys(prev) as (keyof Walks)[]) {
          const last = prev[k][prev[k].length - 1]!;
          const { base, volatility } = BASES[k];
          // Pull gently back toward the base so a long session doesn't drift off the chart.
          const value =
            last.value * (1 + (Math.random() - 0.5) * volatility) + (base - last.value) * 0.01;
          next[k] = [...prev[k].slice(-(POINTS - 1)), { time: last.time + 1, value }];
        }
        return next;
      });
    }, SAMPLE_MS);
    return () => clearInterval(id);
  }, []);
  return walks;
}

const values = (points: Point[], n = 60) => points.slice(-n).map((p) => p.value);
const change = (points: Point[], n = 60) => {
  const span = points.slice(-n);
  return span[span.length - 1]!.value / span[0]!.value - 1;
};
const last = (points: Point[]) => points[points.length - 1]!.value;

/** The mark in the app shell: the site's favicon, a letter on a green tile. */
function DemoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="var(--signal-fill, #3a7a4f)" />
      <path
        fill="#fff"
        fillRule="evenodd"
        transform="translate(-1.5 0)"
        d="M21 16h15a10 10 0 0 1 0 20H29v12h-8zM29 23v6h7a3 3 0 0 0 0-6z"
      />
    </svg>
  );
}

/** Holds one feed's worker down for a few seconds: a single crash recovers too fast to see. */
function outage(feed: Feed, ms = 5000) {
  const channel = new BroadcastChannel(FAULT_CHANNEL);
  const id = setInterval(() => channel.postMessage({ feed }), 300);
  setTimeout(() => {
    clearInterval(id);
    channel.close();
  }, ms);
}

const noop = () => {};

/** Whether the viewport is wide enough for two panes side by side. */
function useWide() {
  const query = "(min-width: 48rem)";
  const [wide, setWide] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setWide(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return wide;
}

export default function DemoLive() {
  const walks = useLiveWalks();
  const { mode, setMode } = useThemeMode();
  const wide = useWide();
  const series = useMemo<TimeSeries[]>(
    () => [
      { id: "index", label: "Composite index", points: walks.index, emphasis: true },
      { id: "equities", label: "Equities", points: walks.equities },
      { id: "crypto", label: "Crypto", points: walks.crypto, lineStyle: "dashed" },
    ],
    [walks.index, walks.equities, walks.crypto],
  );
  return (
    <section className="band" aria-labelledby="app-h">
      <h2 id="app-h" className="visually-hidden">
        The demo app
      </h2>
      <div className="app-window">
        <AppShell
          appName="Proper demo"
          logo={<DemoMark />}
          sideNavItems={[]}
          topNavItems={[]}
          activeNavId=""
          themeMode={mode}
          handleThemeModeChange={setMode}
          handleClickNavigation={noop}
        >
          <div className="app-page">
            <div className="kpis">
              <Kpi
                label="Composite index"
                value={last(walks.index).toFixed(2)}
                delta={change(walks.index)}
                spark={values(walks.index)}
              />
              <Kpi
                label="Updates per second"
                value={Math.round(last(walks.throughput)).toLocaleString()}
                delta={change(walks.throughput)}
                spark={values(walks.throughput)}
                detail="vs a minute ago"
              />
              <Kpi
                label="Render latency, p99"
                value={`${last(walks.latency).toFixed(1)} ms`}
                delta={change(walks.latency)}
                upIs="bad"
                spark={values(walks.latency)}
                detail="vs a minute ago"
              />
              <Kpi label="Feeds live" value="2 of 2" progress={1} detail="Each in its own worker" />
            </div>

            <Card>
              <div className="chart-card">
                <Text weight="semibold">Index history</Text>
                <TimeSeriesChart label="Composite index" series={series} height={240} live />
              </div>
            </Card>

            <div className="workspace-head">
              <div>
                <Text weight="semibold">Workspace</Text>
                <Text type="supporting">
                  Drag a pane by its handle, resize it from its edges, add or remove panes, and pick
                  each pane's data source from its settings. Layouts are saved in this browser.
                </Text>
              </div>
              <div className="workspace-actions">
                <button type="button" className="btn demo-fault" onClick={() => outage("crypto")}>
                  Take the crypto feed down for 5 seconds
                </button>
              </div>
            </div>
            <div className="workspace" role="region" aria-label="Workspace">
              <DataSourcesProvider sources={demoSources}>
                <AppGrid
                  layoutId="demo-workspace"
                  panes={panes}
                  maxPanes={6}
                  paneColumns={wide ? 2 : 1}
                  paneHeight={3}
                  paneTitleActive
                  paneActionsActive
                />
              </DataSourcesProvider>
            </div>
            <p className="demo-note">
              A crashed worker only takes down its own pane. That pane says it is reconnecting and
              retries automatically with backoff; if the feed stays down it offers a Retry, and
              every other pane keeps streaming. The data on this page is generated for the demo.
            </p>
          </div>
        </AppShell>
      </div>
    </section>
  );
}
