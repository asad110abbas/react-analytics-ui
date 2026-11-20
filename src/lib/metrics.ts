import type { Visit } from "./data";

export interface Totals {
  sessions: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  revenuePerSession: number;
}

export function totals(rows: Visit[]): Totals {
  const sessions = rows.reduce((s, r) => s + r.sessions, 0);
  const conversions = rows.reduce((s, r) => s + r.conversions, 0);
  const revenue = rows.reduce((s, r) => s + r.revenue, 0);
  return {
    sessions,
    conversions,
    revenue,
    conversionRate: sessions ? conversions / sessions : 0,
    revenuePerSession: sessions ? revenue / sessions : 0,
  };
}

export function pctChange(current: number, previous: number): number | null {
  return previous === 0 ? null : (current - previous) / previous;
}

/** Split rows into the last `days` days and the equal-length period before it. */
export function splitPeriods(rows: Visit[], days: number) {
  const dates = [...new Set(rows.map((r) => r.date))].sort();
  const cur = new Set(dates.slice(-days));
  const prev = new Set(dates.slice(-2 * days, -days));
  return { current: rows.filter((r) => cur.has(r.date)), previous: rows.filter((r) => prev.has(r.date)) };
}

export function groupBy<K extends keyof Visit>(rows: Visit[], key: K) {
  const map = new Map<string, Visit[]>();
  for (const r of rows) {
    const k = String(r[key]);
    map.set(k, [...(map.get(k) ?? []), r]);
  }
  return [...map.entries()].map(([name, rs]) => ({ name, ...totals(rs) }));
}

export function daily(rows: Visit[]) {
  return groupBy(rows, "date").sort((a, b) => a.name.localeCompare(b.name));
}

export function movingAverage(values: number[], window: number): (number | null)[] {
  return values.map((_, i) =>
    i + 1 < window ? null : values.slice(i + 1 - window, i + 1).reduce((a, b) => a + b, 0) / window,
  );
}

export const fmt = {
  int: (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 }),
  pct: (n: number) => `${(n * 100).toFixed(1)}%`,
  money: (n: number) => `PKR ${n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n.toLocaleString("en-US")}`,
};
