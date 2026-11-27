// One of these runs per grid pane: a mock market feed that lives off the main thread, so a crash
// here only takes down its own pane. Imports only the worker entry, never React or AG Grid.
import { exposePager, Subject, type Pager, type ViewItem } from "@propermade/core/worker";

import { FAULT_CHANNEL, type Feed, type TickerParams, type TickerRow } from "./feeds";

const SYMBOLS: Record<Feed, { count: number; base: number; spread: number; prefix: string }> = {
  equities: { count: 1200, base: 80, spread: 400, prefix: "EQ" },
  crypto: { count: 900, base: 2, spread: 60000, prefix: "CX" },
};
const TICK_MS = 50;
const UPDATES_PER_TICK = 150;

const makeRows = (feed: Feed): TickerRow[] => {
  const { count, base, spread, prefix } = SYMBOLS[feed];
  return Array.from({ length: count }, (_, i) => {
    const last = base + (((i * 7919) % 1000) / 1000) * spread;
    return {
      id: `${prefix}${String(i).padStart(4, "0")}`,
      symbol: `${prefix}${String(i).padStart(4, "0")}`,
      last,
      open: last,
      volume: 1000 + ((i * 104729) % 90000),
      updatedAt: Date.now(),
    };
  });
};

function createTicker(feed: Feed): Pager<TickerRow> {
  const rows = makeRows(feed);
  const rowCount$ = new Subject<number>();
  const updates$ = new Subject<{ current: ViewItem<TickerRow>[] }>();

  const timer = setInterval(() => {
    const now = Date.now();
    const current: ViewItem<TickerRow>[] = [];
    for (let n = 0; n < UPDATES_PER_TICK; n++) {
      const viewIdx = Math.floor(Math.random() * rows.length);
      const row = rows[viewIdx]!;
      row.last = Math.max(0.01, row.last * (1 + (Math.random() - 0.5) * 0.004));
      row.volume += Math.floor(Math.random() * 500);
      row.updatedAt = now;
      current.push({ viewIdx, payload: { ...row }, ts: now });
    }
    updates$.next({ current });
  }, TICK_MS);

  // The page's "crash" button posts here. Throwing from a timer is an uncaught error in the
  // worker, which is exactly what a real crash looks like to the main thread.
  const faults = new BroadcastChannel(FAULT_CHANNEL);
  faults.onmessage = ({ data }: MessageEvent<{ feed?: Feed }>) => {
    if (data?.feed !== feed) return;
    setTimeout(() => {
      throw new Error(`Simulated crash in the ${feed} feed worker`);
    }, 0);
  };

  return {
    getPage: async ({ startRow, endRow }) => [
      rows
        .slice(startRow, endRow)
        .map((payload, i) => ({ viewIdx: startRow + i, payload: { ...payload }, ts: Date.now() })),
      rows.length,
    ],
    rowCount$,
    rowBatchedUpdates$: updates$,
    destroy: () => {
      clearInterval(timer);
      faults.close();
      rowCount$.complete();
      updates$.complete();
    },
  };
}

exposePager<TickerRow>((_query, params) => createTicker((params as TickerParams).feed));
