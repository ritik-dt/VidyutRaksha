// ── Forecast module types (Layer 0) ──────────────────────────────────────────
// Faithful port of the prototype's renderForecast()/initForecastCharts().
// Forecast is a STATIC, horizon-driven module — no scope dependency.

/** The four prediction horizons the toggle exposes. Default is '3m'. */
export type ForecastHorizon = '1m' | '3m' | '6m' | '12m'

/**
 * Per-horizon values that drive the KPI cards + AI-insight text + table labels.
 * Mirrors the prototype's `horizonData` map exactly.
 */
export interface HorizonData {
  /** Human label, e.g. "next quarter" — used in insight text + table title. */
  label: string
  /** Revenue-forecast KPI value, e.g. "₹4.2 Cr". */
  rev: string
  /** Revenue-forecast KPI sub-label, e.g. "Next quarter". */
  revSub: string
  /** Projected AT&C KPI value, e.g. "18.2%". */
  atc: string
  /** Projected AT&C KPI sub-label, e.g. "↓ 2.3pp vs now". */
  atcSub: string
  /** Projected AT&C KPI label (changes per horizon), e.g. "Projected AT&C Q3". */
  atcLabel: string
  /** DTs-at-risk KPI value. */
  dtRisk: number
  /** DTs-at-risk KPI sub-label. */
  dtRiskSub: string
}

/** One KPI card in the Forecast strip. */
export interface ForecastKpi {
  key: string
  label: string
  value: string
  sub: string
  accent: string
  valueColor?: string
  /** Present only on the clickable "DTs at risk" card (self-filter → atrisk). */
  clickFilter?: 'atrisk'
}

/** One Chart.js-style dataset in a multi-series forecast chart. */
export interface ForecastDataset {
  label: string
  data: (number | null)[]
  borderColor: string
  backgroundColor?: string
  borderDash?: number[]
  fill?: boolean | string
  tension?: number
  borderWidth?: number
  pointRadius?: number
  /** Bar-only: per-bar colours (seasonal theft). */
  barColors?: string[]
}

/** A labelled, multi-dataset series feeding a ForecastChartCard. */
export interface ForecastChartData {
  labels: string[]
  datasets: ForecastDataset[]
}

/** One row of the "DTs predicted to exceed 90% capacity" table. */
export interface AtRiskDtRow {
  dt: string
  feeder: string
  currentLoading: string
  currentColor: string
  growthRate: string
  growthColor: string
  projected: string
  projectedColor: string
  daysToOverload: string
  daysColor: string
  action: string
  /** Badge class suffix: 'confirmed' | 'assigned' | 'new'. */
  actionBadge: 'confirmed' | 'assigned' | 'new'
}
