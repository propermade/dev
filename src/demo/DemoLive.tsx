// core's AppShell and SideNav only take nav items, so the shell is composed from Astryx's own.
import { AppShell, SideNav } from "@astryxdesign/core";
// No subpath entry for charts yet, so this comes from the root entry.
import { TimeSeriesChart, type TimeSeries } from "@propermade/core";
import {
  Button,
  Card,
  SegmentedControl,
  Text,
  ThemeToggle,
  TopNav,
} from "@propermade/core/components";
import { AppGrid, DataSourcesProvider, type AppGridPane } from "@propermade/core/grid";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { useThemeMode } from "../components/ThemeShell";
import { FAULT_CHANNEL, type Feed } from "./feeds";
import { Kpi } from "./Kpi";
import { demoSources } from "./sources";
import { themeVars } from "./themeEngine";
import { ThemePanel, useThemeSettings } from "./ThemePanel";

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
function useLiveWalks(paused: boolean): Walks {
  const [walks, setWalks] = useState<Walks>(() => seed());
  useEffect(() => {
    if (paused) return;
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
  }, [paused]);
  return walks;
}

const values = (points: Point[], n = 60) => points.slice(-n).map((p) => p.value);
const change = (points: Point[], n = 60) => {
  const span = points.slice(-n);
  return span[span.length - 1]!.value / span[0]!.value - 1;
};
const last = (points: Point[]) => points[points.length - 1]!.value;

/** The mark in the app shell: the site's favicon, a monoline P on a signal-green tile. */
function DemoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="#468e5c" />
      <path
        fill="none"
        stroke="#fbfaf7"
        strokeWidth="9"
        strokeLinejoin="round"
        d="M23 50V15h12a11 11 0 0 1 0 22H23"
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
  // The side nav takes 20rem, so two panes need more than the usual tablet width.
  const query = "(min-width: 64rem)";
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
  const [paused, setPaused] = useState(false);
  const [span, setSpan] = useState("120");
  const walks = useLiveWalks(paused);
  const { mode, setMode } = useThemeMode();
  const wide = useWide();
  const [settings, setSettings] = useThemeSettings();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const vars = useMemo(() => themeVars(settings) as CSSProperties, [settings]);
  const n = Number(span);
  const series = useMemo<TimeSeries[]>(
    () => [
      { id: "index", label: "Composite index", points: walks.index.slice(-n), emphasis: true },
      { id: "equities", label: "Equities", points: walks.equities.slice(-n) },
      { id: "crypto", label: "Crypto", points: walks.crypto.slice(-n), lineStyle: "dashed" },
    ],
    [walks.index, walks.equities, walks.crypto, n],
  );
  return (
    <section className="app-themed" style={vars} aria-labelledby="app-h">
      <h2 id="app-h" className="visually-hidden">
        The demo app
      </h2>
      <AppShell
        variant="section"
        contentPadding={0}
        height="fill"
        // "fill" alone is a whole viewport tall, which runs under the site header.
        style={{ height: "100%" }}
        topNav={
          <TopNav
            heading="propermade ui demo"
            logo={<DemoMark />}
            topNavItems={[]}
            activeNavId=""
            handleClickNavigation={noop}
          />
        }
        sideNav={
          <SideNav
            collapsible={{ isCollapsed: navCollapsed, onCollapsedChange: setNavCollapsed }}
            // A fixed width would also hold the collapsed rail open.
            style={navCollapsed ? undefined : { inlineSize: "20rem" }}
            footer={<ThemeToggle themeMode={mode} isCollapsed={navCollapsed} onChange={setMode} />}
          >
            {navCollapsed ? null : <ThemePanel settings={settings} onChange={setSettings} />}
          </SideNav>
        }
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
              <div className="chart-head">
                <Text weight="semibold">Index history</Text>
                <div className="chart-controls">
                  <SegmentedControl.Root value={span} onChange={setSpan} label="Time span">
                    <SegmentedControl.Item value="60" label="15s" />
                    <SegmentedControl.Item value="120" label="30s" />
                    <SegmentedControl.Item value="240" label="60s" />
                  </SegmentedControl.Root>
                  <Button
                    size="sm"
                    variant="secondary"
                    label={paused ? "Resume" : "Pause"}
                    onClick={() => setPaused((p) => !p)}
                  />
                </div>
              </div>
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
              <Button
                style={{ height: 38 }}
                variant="secondary"
                label="Take the crypto feed down for 5 seconds"
                onClick={() => outage("crypto")}
              />
            </div>
          </div>
          <div className="workspace" role="region" aria-label="Workspace">
            <DataSourcesProvider sources={demoSources}>
              <AppGrid
                // A saved layout wins over paneColumns, so each width keeps its own.
                key={wide ? "wide" : "narrow"}
                layoutId={wide ? "demo-workspace" : "demo-workspace-narrow"}
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
            retries automatically with backoff; if the feed stays down it offers a Retry, and every
            other pane keeps streaming. The data on this page is generated for the demo.
          </p>
        </div>
      </AppShell>
    </section>
  );
}
