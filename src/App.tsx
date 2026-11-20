import { useMemo, useState } from "react";
import { DevicePie, SourceBar, TrendChart } from "./components/Charts";
import { KpiCard } from "./components/KpiCard";
import { generateVisits, type Visit } from "./lib/data";
import { daily, fmt, groupBy, movingAverage, pctChange, splitPeriods, totals } from "./lib/metrics";

const ALL = generateVisits();
const RANGES = [7, 30, 60] as const;
const SOURCES: Visit["source"][] = ["Organic", "Paid", "Social", "Email", "Referral"];

export default function App() {
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const [sources, setSources] = useState<Set<string>>(new Set(SOURCES));

  const { current, previous } = useMemo(
    () => splitPeriods(ALL.filter((r) => sources.has(r.source)), range),
    [range, sources],
  );
  const cur = totals(current);
  const prev = totals(previous);
  const trend = useMemo(() => {
    const d = daily(current);
    const ma = movingAverage(d.map((x) => x.sessions), 7);
    return d.map((x, i) => ({ name: x.name, sessions: x.sessions, ma7: ma[i] }));
  }, [current]);
  const bySource = groupBy(current, "source").sort((a, b) => b.conversionRate - a.conversionRate);
  const byDevice = groupBy(current, "device");

  const toggle = (s: string) =>
    setSources((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(s) && next.size > 1) next.delete(s);
      else next.add(s);
      return next;
    });

  return (
    <main className="container">
      <header className="header">
        <div>
          <h1>Web Analytics</h1>
          <p className="muted">Traffic, conversion and revenue · synthetic demo data</p>
        </div>
        <div className="segmented" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button key={r} className={r === range ? "active" : ""} onClick={() => setRange(r)}>
              {r}d
            </button>
          ))}
        </div>
      </header>

      <div className="chips">
        {SOURCES.map((s) => (
          <button key={s} className={`chip ${sources.has(s) ? "on" : ""}`} onClick={() => toggle(s)}>
            {s}
          </button>
        ))}
      </div>

      <section className="grid kpis">
        <KpiCard label="Sessions" value={fmt.int(cur.sessions)} change={pctChange(cur.sessions, prev.sessions)} />
        <KpiCard label="Conversions" value={fmt.int(cur.conversions)} change={pctChange(cur.conversions, prev.conversions)} />
        <KpiCard label="Conversion rate" value={fmt.pct(cur.conversionRate)} change={pctChange(cur.conversionRate, prev.conversionRate)} />
        <KpiCard label="Revenue" value={fmt.money(cur.revenue)} change={pctChange(cur.revenue, prev.revenue)} />
      </section>

      <section className="card">
        <h2>Daily sessions</h2>
        <TrendChart data={trend} />
      </section>

      <section className="grid two">
        <div className="card">
          <h2>Conversion rate by source</h2>
          <SourceBar data={bySource} />
        </div>
        <div className="card">
          <h2>Revenue by device</h2>
          <DevicePie data={byDevice} />
        </div>
      </section>

      <section className="card">
        <h2>Channel table</h2>
        <table>
          <thead>
            <tr><th>Source</th><th>Sessions</th><th>Conversions</th><th>CVR</th><th>Revenue</th><th>Rev / session</th></tr>
          </thead>
          <tbody>
            {bySource.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td><td>{fmt.int(r.sessions)}</td><td>{fmt.int(r.conversions)}</td>
                <td>{fmt.pct(r.conversionRate)}</td><td>{fmt.money(r.revenue)}</td><td>{r.revenuePerSession.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
