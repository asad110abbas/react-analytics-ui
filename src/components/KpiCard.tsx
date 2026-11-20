interface Props {
  label: string;
  value: string;
  change: number | null;
}

export function KpiCard({ label, value, change }: Props) {
  const tone = change === null ? "neutral" : change >= 0 ? "up" : "down";
  return (
    <div className="card kpi">
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{value}</strong>
      <span className={`kpi-change ${tone}`}>
        {change === null ? "n/a" : `${change >= 0 ? "▲" : "▼"} ${(Math.abs(change) * 100).toFixed(1)}%`}
        <small> vs previous period</small>
      </span>
    </div>
  );
}
