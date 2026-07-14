// ── Forecast data pool (Layer 1) ─────────────────────────────────────────────
// Every value here is copied verbatim from the prototype's renderForecast() /
// initForecastCharts(). Today these are static arrays; tomorrow they become the
// return values of async fetchers — nothing else in the module changes.

import type {
  AtRiskDtRow,
  ForecastChartData,
  ForecastHorizon,
  HorizonData,
} from '../types'

// Prototype dataset colours (kept as literal hex to match Chart.js output exactly).
const NAVY = '#1B4F72'
const PURPLE = '#7C3AED'
const PURPLE_BAND = 'rgba(124,58,237,.3)'
const RED = '#DC3545'
const AMBER = '#E6921E'
const TEAL = '#17A2B8'
const GREEN = '#28A745'

/** Horizon → KPI/insight/table values. Mirrors prototype `horizonData`. */
export const HORIZON_DATA: Record<ForecastHorizon, HorizonData> = {
  '1m': {
    label: 'next 1 month',
    rev: '₹1.4 Cr',
    revSub: 'Next 1 month',
    atc: '18.9%',
    atcSub: '↓ 1.6pp vs now',
    atcLabel: 'Projected AT&C 1mo',
    dtRisk: 18,
    dtRiskSub: 'Overload in 1 month',
  },
  '3m': {
    label: 'next quarter',
    rev: '₹4.2 Cr',
    revSub: 'Next quarter',
    atc: '18.2%',
    atcSub: '↓ 2.3pp vs now',
    atcLabel: 'Projected AT&C Q3',
    dtRisk: 47,
    dtRiskSub: 'Overload in 6 months',
  },
  '6m': {
    label: 'next 6 months',
    rev: '₹8.4 Cr',
    revSub: 'Next 6 months',
    atc: '17.6%',
    atcSub: '↓ 2.9pp vs now',
    atcLabel: 'Projected AT&C Q4',
    dtRisk: 78,
    dtRiskSub: 'Overload in 6 months',
  },
  '12m': {
    label: 'next year',
    rev: '₹16.8 Cr',
    revSub: 'Next 12 months',
    atc: '17.0%',
    atcSub: '↓ 3.5pp vs now',
    atcLabel: 'Projected AT&C Q1 FY27',
    dtRisk: 112,
    dtRiskSub: 'Overload in 12 months',
  },
}

/** The four horizon pills, in prototype order. */
export const HORIZON_PILLS: { id: ForecastHorizon; label: string }[] = [
  { id: '1m', label: '1 month' },
  { id: '3m', label: '3 months' },
  { id: '6m', label: '6 months' },
  { id: '12m', label: '1 year' },
]

// ── Chart 1: AT&C loss forecast (line, default) — 4 datasets ──────────────────
const LOSS_MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const LOSS_ACTUAL = [24.8, 24.5, 24.2, 23.8, 23.4, 23.0, 22.7, 22.3, 22.0, 21.6, 21.2, 20.8, 20.5, null, null, null, null, null]
const LOSS_FORECAST = [null, null, null, null, null, null, null, null, null, null, null, null, 20.5, 19.9, 19.4, 18.9, 18.5, 18.2]
const LOSS_UPPER = [null, null, null, null, null, null, null, null, null, null, null, null, 20.5, 20.4, 20.0, 19.6, 19.3, 19.2]
const LOSS_LOWER = [null, null, null, null, null, null, null, null, null, null, null, null, 20.5, 19.4, 18.8, 18.2, 17.7, 17.2]

export const LOSS_FORECAST_CHART: ForecastChartData = {
  labels: LOSS_MONTHS,
  datasets: [
    { label: 'Actual', data: LOSS_ACTUAL, borderColor: NAVY, backgroundColor: 'rgba(27,79,114,.08)', fill: false, tension: 0.3, borderWidth: 2.5, pointRadius: 2 },
    { label: 'Forecast', data: LOSS_FORECAST, borderColor: PURPLE, borderDash: [6, 3], backgroundColor: 'rgba(124,58,237,.08)', fill: false, tension: 0.3, borderWidth: 2.5, pointRadius: 3 },
    { label: 'Upper bound', data: LOSS_UPPER, borderColor: PURPLE_BAND, borderDash: [2, 2], fill: '+1', backgroundColor: 'rgba(124,58,237,.08)', tension: 0.3, borderWidth: 1, pointRadius: 0 },
    { label: 'Lower bound', data: LOSS_LOWER, borderColor: PURPLE_BAND, borderDash: [2, 2], fill: false, tension: 0.3, borderWidth: 1, pointRadius: 0 },
  ],
}

// ── Chart 2: Revenue recovery forecast (bar, default) — 2 datasets ────────────
export const REV_FORECAST_CHART: ForecastChartData = {
  labels: ['Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026'],
  datasets: [
    { label: 'Actual (₹ Cr)', data: [1.8, 2.4, 2.9, 3.4, null, null], borderColor: NAVY, backgroundColor: NAVY },
    { label: 'Forecast (₹ Cr)', data: [null, null, null, 3.4, 4.2, 5.1], borderColor: 'rgba(124,58,237,.7)', backgroundColor: 'rgba(124,58,237,.7)' },
  ],
}

// ── Chart 3: Seasonal theft pattern (bar, default) — 1 dataset, per-bar colour ─
const SEASONAL_COLORS = [
  ...Array<string>(4).fill(GREEN),
  ...Array<string>(3).fill(RED),
  ...Array<string>(5).fill(GREEN),
]
export const SEASONAL_THEFT_CHART: ForecastChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Theft detections (avg)',
      data: [820, 780, 890, 920, 1180, 1320, 1280, 1020, 910, 870, 830, 800],
      borderColor: GREEN,
      backgroundColor: GREEN,
      barColors: SEASONAL_COLORS,
    },
  ],
}

// ── Chart 4: DT loading projection (line, default) — 3 DT lines + threshold ────
export const DT_CAPACITY_CHART: ForecastChartData = {
  labels: ['Now', '1mo', '2mo', '3mo', '4mo', '5mo', '6mo', '7mo', '8mo', '9mo', '10mo', '11mo', '12mo'],
  datasets: [
    { label: 'DT-0445', data: [94, 95, 96, 97, 99, 100, 101, 102, 103, 104, 105, 106, 107], borderColor: RED, backgroundColor: 'transparent', fill: false, tension: 0.2, borderWidth: 2.5, pointRadius: 2 },
    { label: 'DT-0234', data: [91, 91.8, 92.6, 93.4, 94.2, 95, 95.8, 96.6, 97.4, 98.2, 99, 99.8, 100.6], borderColor: AMBER, backgroundColor: 'transparent', fill: false, tension: 0.2, borderWidth: 2.5, pointRadius: 2 },
    { label: 'DT-0901', data: [82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94], borderColor: TEAL, backgroundColor: 'transparent', fill: false, tension: 0.2, borderWidth: 2.5, pointRadius: 2 },
    { label: 'Overload threshold', data: Array<number>(13).fill(90), borderColor: PURPLE, borderDash: [5, 3], fill: false, tension: 0, borderWidth: 1.5, pointRadius: 0 },
  ],
}

// ── At-risk DT table (4 hardcoded rows; independent of horizon) ───────────────
export const AT_RISK_DTS: AtRiskDtRow[] = [
  { dt: 'DT-0445', feeder: 'Feeder-14', currentLoading: '94%', currentColor: 'var(--red)', growthRate: '+1.2%/mo', growthColor: 'var(--red)', projected: '101%', projectedColor: 'var(--red)', daysToOverload: '45 days', daysColor: 'var(--red)', action: 'Urgent: augment now', actionBadge: 'confirmed' },
  { dt: 'DT-0234', feeder: 'Feeder-12', currentLoading: '91%', currentColor: 'var(--red)', growthRate: '+0.8%/mo', growthColor: 'var(--amber)', projected: '96%', projectedColor: 'var(--red)', daysToOverload: '90 days', daysColor: 'var(--amber)', action: 'Plan capacity add', actionBadge: 'assigned' },
  { dt: 'DT-0901', feeder: 'Feeder-8', currentLoading: '82%', currentColor: 'var(--amber)', growthRate: '+1.0%/mo', growthColor: 'var(--amber)', projected: '88%', projectedColor: 'var(--amber)', daysToOverload: '120 days', daysColor: 'var(--amber)', action: 'Monitor', actionBadge: 'new' },
  { dt: 'DT-0556', feeder: 'Feeder-5', currentLoading: '78%', currentColor: 'var(--amber)', growthRate: '+1.5%/mo', growthColor: 'var(--amber)', projected: '87%', projectedColor: 'var(--amber)', daysToOverload: '135 days', daysColor: 'var(--amber)', action: 'Monitor', actionBadge: 'new' },
]
