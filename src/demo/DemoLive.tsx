// No subpath entry for charts yet, so this comes from the root entry.
import { TimeSeriesChart, type TimeSeries } from "@propermade/core";
import { Button } from "@propermade/core/components";
import { AppGrid, DataSourcesProvider, type AppGridPane } from "@propermade/core/grid";
import { useEffect, useState } from "react";

import { FAULT_CHANNEL, type Feed } from "./feeds";
import { demoSources } from "./sources";
import { LiveComponents, TokenEditor } from "./ThemeLab";

// Declared at module scope so AppGrid sees a stable reference.
const panes: AppGridPane[] = [
  { id: "equities", config: { source: "demo-equities" } },
  { id: "crypto", config: { source: "demo-crypto" } },
];

const POINTS = 240;
const SAMPLE_MS = 250;

/** A random walk sampled on the main thread, so the chart has something live to draw. */
function useLiveSeries(): TimeSeries[] {
  const [series, setSeries] = useState<TimeSeries[]>(() => seed());
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) =>
        prev.map((s) => {
          const last = s.points[s.points.length - 1]!;
          const value = (last.value ?? 100) * (1 + (Math.random() - 0.5) * 0.01);
          return {
            ...s,
            points: [...s.points.slice(-(POINTS - 1)), { time: last.time + 1, value }],
          };
        }),
      );
    }, SAMPLE_MS);
    return () => clearInterval(id);
  }, []);
  return series;
}

function seed(): TimeSeries[] {
  const start = Math.floor(Date.now() / 1000) - POINTS;
  const walk = (base: number) => {
    let v = base;
    return Array.from({ length: POINTS }, (_, i) => {
      v *= 1 + (Math.random() - 0.5) * 0.01;
      return { time: start + i, value: v };
    });
  };
  return [
    { id: "index", label: "Composite index", points: walk(100), emphasis: true },
    { id: "equities", label: "Equities", points: walk(96) },
    { id: "crypto", label: "Crypto", points: walk(104), lineStyle: "dashed" },
  ];
}

/**
 * Keeps one feed's worker crashing for a few seconds. A single crash recovers in under a second,
 * too fast to see, so the outage repeats until the time is up. The pane retries three times, then
 * offers a manual Retry, which works once the outage is over.
 */
function outage(feed: Feed, ms = 5000) {
  const channel = new BroadcastChannel(FAULT_CHANNEL);
  const id = setInterval(() => channel.postMessage({ feed }), 300);
  setTimeout(() => {
    clearInterval(id);
    channel.close();
  }, ms);
}

export default function DemoLive() {
  const series = useLiveSeries();
  return (
    <>
      <section className="band" aria-labelledby="theme-h">
        <h2 id="theme-h">Re-theme it live</h2>
        <p>
          Drag the radius or pick an accent. The components next to the controls re-theme from the
          same design tokens the rest of the system is built on, scoped to this block.
        </p>
        <TokenEditor />
        <LiveComponents />
      </section>

      <section className="band" aria-labelledby="stream-h">
        <h2 id="stream-h">Streaming data, off the main thread</h2>
        <p>
          Each grid below streams about 3,000 row updates a second from its own Web Worker, so the
          interface stays responsive. The chart is sampled live on the page. The data is generated
          for this demo.
        </p>
        <TimeSeriesChart label="Composite index" series={series} height={260} live />
        <DataSourcesProvider sources={demoSources}>
          <div className="demo-grid">
            <AppGrid layoutId="demo-workspace" panes={panes} maxPanes={4} />
          </div>
        </DataSourcesProvider>
      </section>

      <section className="band" aria-labelledby="fault-h">
        <h2 id="fault-h">Break one pane, keep the app</h2>
        <p>
          A crashed worker only takes down its own pane. That pane says it is reconnecting and
          retries automatically with backoff. If the feed stays down it offers a Retry, and every
          other pane keeps streaming. Panes can be dragged, resized, added and removed; the layout
          is saved in this browser.
        </p>
        <div className="demo-row">
          <Button
            variant="destructive"
            label="Take the crypto feed down for 5 seconds"
            onClick={() => outage("crypto")}
          />
          <Button
            variant="secondary"
            label="Take the equities feed down for 5 seconds"
            onClick={() => outage("equities")}
          />
        </div>
      </section>
    </>
  );
}
