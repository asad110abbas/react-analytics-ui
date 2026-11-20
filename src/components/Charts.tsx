import {
  Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { fmt } from "../lib/metrics";

const COLORS = ["#1F6FEB", "#00B39F", "#F2994A", "#9B51E0", "#EB5757"];

export function TrendChart({ data }: { data: { name: string; sessions: number; ma7: number | null }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F6FEB" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#1F6FEB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickFormatter={(d: string) => d.slice(5)} minTickGap={24} />
        <YAxis tickFormatter={fmt.int} width={60} />
        <Tooltip formatter={(v: number) => fmt.int(v)} />
        <Area type="monotone" dataKey="sessions" stroke="#1F6FEB" fill="url(#g)" name="Sessions" />
        <Line type="monotone" dataKey="ma7" stroke="#F2994A" dot={false} strokeWidth={2} name="7-day avg" />
        <Legend />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function SourceBar({ data }: { data: { name: string; conversionRate: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={fmt.pct} />
        <YAxis type="category" dataKey="name" width={70} />
        <Tooltip formatter={(v: number) => fmt.pct(v)} />
        <Bar dataKey="conversionRate" name="Conversion rate" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DevicePie({ data }: { data: { name: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="revenue" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v: number) => fmt.money(v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
