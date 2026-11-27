// Shared by the page and the worker: plain types and constants only.
export type Feed = "equities" | "crypto";
export interface TickerParams {
  feed: Feed;
}
export interface TickerRow {
  id: string;
  symbol: string;
  last: number;
  open: number;
  volume: number;
  updatedAt: number;
}
export const FAULT_CHANNEL = "demo-faults";
