import { createWorkerPager, defineDataSource } from "@propermade/core/grid";

import type { Feed, TickerRow } from "./feeds";

const money = (value: number) =>
  value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** A grid source whose rows stream from its own Web Worker, one worker per pane. */
const feedSource = (feed: Feed, label: string) =>
  defineDataSource<TickerRow>({
    id: `demo-${feed}`,
    label,
    group: "Demo feeds",
    getId: (row) => row.id,
    rowModelType: "clientSide",
    columnDefs: [
      { field: "symbol", headerName: "Symbol", minWidth: 110, flex: 1 },
      {
        field: "last",
        headerName: "Last",
        type: "numericColumn",
        flex: 1,
        minWidth: 100,
        valueFormatter: ({ value }) => money(value as number),
      },
      {
        headerName: "Change",
        type: "numericColumn",
        flex: 1,
        minWidth: 100,
        valueGetter: ({ data }) => (data ? (data.last / data.open - 1) * 100 : 0),
        valueFormatter: ({ value }) =>
          `${(value as number) >= 0 ? "+" : ""}${money(value as number)}%`,
        cellStyle: ({ value }) => ({
          color:
            (value as number) >= 0
              ? "var(--color-success, #1f7a46)"
              : "var(--color-danger, #b3261e)",
        }),
      },
      {
        field: "volume",
        headerName: "Volume",
        type: "numericColumn",
        flex: 1,
        minWidth: 100,
        valueFormatter: ({ value }) => (value as number).toLocaleString(),
      },
    ],
    createPager: (query) =>
      createWorkerPager<TickerRow>({
        createWorker: () =>
          new Worker(new URL("./ticker.worker.ts", import.meta.url), {
            type: "module",
            name: `demo-feed:${feed}`,
          }),
        query,
        params: { feed },
        rowModelType: "clientSide",
      }),
  });

export const demoSources = [feedSource("equities", "Equities"), feedSource("crypto", "Crypto")];
