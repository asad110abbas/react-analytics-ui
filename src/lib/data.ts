export interface Visit {
  date: string; // yyyy-mm-dd
  source: "Organic" | "Paid" | "Social" | "Email" | "Referral";
  device: "Desktop" | "Mobile" | "Tablet";
  sessions: number;
  conversions: number;
  revenue: number;
}

/** Deterministic pseudo-random generator so the demo looks the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateVisits(days = 120, seed = 7): Visit[] {
  const rand = mulberry32(seed);
  const sources: Visit["source"][] = ["Organic", "Paid", "Social", "Email", "Referral"];
  const devices: Visit["device"][] = ["Desktop", "Mobile", "Tablet"];
  const base = { Organic: 420, Paid: 260, Social: 180, Email: 90, Referral: 70 };
  const cvr = { Organic: 0.028, Paid: 0.035, Social: 0.012, Email: 0.05, Referral: 0.03 };
  const share = { Desktop: 0.38, Mobile: 0.55, Tablet: 0.07 };
  const start = new Date("2025-09-01T00:00:00Z");
  const out: Visit[] = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(start.getTime() + d * 86_400_000);
    const weekend = day.getUTCDay() === 0 || day.getUTCDay() === 6 ? 0.8 : 1;
    const growth = 1 + d * 0.003;
    for (const source of sources) {
      for (const device of devices) {
        const sessions = Math.round(base[source] * share[device] * weekend * growth * (0.8 + rand() * 0.4));
        const conversions = Math.round(sessions * cvr[source] * (device === "Desktop" ? 1.3 : 0.9) * (0.7 + rand() * 0.6));
        out.push({ date: day.toISOString().slice(0, 10), source, device, sessions, conversions,
          revenue: Math.round(conversions * (2500 + rand() * 3000)) });
      }
    }
  }
  return out;
}
