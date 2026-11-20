import { describe, expect, it } from "vitest";
import { generateVisits, type Visit } from "./data";
import { groupBy, movingAverage, pctChange, splitPeriods, totals } from "./metrics";

const row = (date: string, sessions: number, conversions: number, revenue: number): Visit => ({
  date, source: "Organic", device: "Desktop", sessions, conversions, revenue,
});

describe("metrics", () => {
  it("computes totals and rates", () => {
    const t = totals([row("2025-01-01", 100, 5, 1000), row("2025-01-02", 100, 15, 3000)]);
    expect(t).toEqual({ sessions: 200, conversions: 20, revenue: 4000, conversionRate: 0.1, revenuePerSession: 20 });
  });

  it("handles empty input", () => {
    expect(totals([]).conversionRate).toBe(0);
  });

  it("pctChange guards divide-by-zero", () => {
    expect(pctChange(150, 100)).toBe(0.5);
    expect(pctChange(1, 0)).toBeNull();
  });

  it("splits equal periods", () => {
    const rows = ["01", "02", "03", "04"].map((d) => row(`2025-01-${d}`, 1, 0, 0));
    const { current, previous } = splitPeriods(rows, 2);
    expect(current.map((r) => r.date)).toEqual(["2025-01-03", "2025-01-04"]);
    expect(previous.map((r) => r.date)).toEqual(["2025-01-01", "2025-01-02"]);
  });

  it("moving average", () => {
    expect(movingAverage([1, 2, 3, 4], 2)).toEqual([null, 1.5, 2.5, 3.5]);
  });

  it("generator is deterministic and grouped totals add up", () => {
    const a = generateVisits(10), b = generateVisits(10);
    expect(a).toEqual(b);
    const sum = groupBy(a, "source").reduce((s, g) => s + g.sessions, 0);
    expect(sum).toBe(totals(a).sessions);
  });
});
