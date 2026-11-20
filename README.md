# 📉 React Analytics UI

![React](https://img.shields.io/badge/React_18-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF)
![CI](https://github.com/asad110abbas/react-analytics-ui/actions/workflows/ci.yml/badge.svg)

> 🌌 Part of **[BRIHA AI World](https://github.com/asad110abbas)**, the AI-driven portfolio of Syed Asad Abbas.

A responsive **web analytics dashboard** built with React, TypeScript and Recharts. It shows traffic, conversions
and revenue, with period-over-period comparison, source filters, a 7-day moving average, and automatic dark mode.

## Features
- KPI cards with ▲/▼ change vs. the previous equal-length period (7 / 30 / 60 days)
- Sessions trend with a 7-day moving-average overlay
- Conversion rate by traffic source, revenue split by device, sortable channel table
- Toggle traffic sources on and off. Everything recomputes with `useMemo`
- All metric logic in pure, unit-tested TypeScript functions (`src/lib/metrics.ts`)
- Responsive CSS grid, light/dark themes via `prefers-color-scheme`, no UI framework needed

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest unit tests
npm run build      # production bundle in dist/
```

## Structure
```
src/
  lib/data.ts        deterministic synthetic visit generator (seeded PRNG)
  lib/metrics.ts     totals, period split, % change, moving average, formatting
  components/        KpiCard and Recharts chart components
  App.tsx            dashboard layout and state
```

> The data is synthetic and generated client-side.
