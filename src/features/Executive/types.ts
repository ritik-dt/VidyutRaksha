// ── Executive module types ───────────────────────────────────────────────────
// Every data-carrying shape used by the Executive dashboard. The types are the
// contract for the whole feature — data files satisfy them, components consume
// them via props, hooks compose them. Swapping mock data for a real API means
// changing the hook's implementation; the types + component tree stay the same.

// ── Color tone system ────────────────────────────────────────────────────────
/** Semantic accent used across every number/badge/bar in the Executive view. */
export type Tone = 'jade' | 'amber' | 'crimson' | 'brand'

/** KPI-tile health status (drives left accent + value colour + rag emoji). */
export type KpiStatus = 'good' | 'warn' | 'bad'

// ── Detail-panel keys (one per slide-out) ────────────────────────────────────
export type DetailPanelKey =
  | 'atc' | 'billing' | 'collection' | 'peak' | 'supply' | 'saidi' | 'smart' | 'revenue'
  | 'alert1' | 'alert2' | 'alert3' | 'alert4'
  | 'discom-pvvnl' | 'discom-mvvnl' | 'discom-dvvnl' | 'discom-puvvnl' | 'discom-kesco'
  | 'dues-03' | 'dues-36' | 'dues-6p' | 'dues-never'

// ── Header sections ──────────────────────────────────────────────────────────
export interface TimeMode {
  mode: 'realtime' | 'monthly'
  activeMonth?: string
}

// ── Critical alerts (top section, 4 P1 cards) ────────────────────────────────
export interface CriticalAlert {
  id: string
  eyebrow: string           // "🔴 P1 Critical · AT&C Loss"
  title: string             // "High Loss Feeders"
  detail: string            // Long description
  impact: string            // "₹18.5 Cr/mo risk"
  actionLabel: string       // "Initiate Drive"
  actionToast: string       // "Anti-theft drive initiated"
  panelKey: DetailPanelKey  // which detail panel to open
  cardToast: string         // toast shown when the whole card is clicked
}

// ── KPI strip (8 tiles) ──────────────────────────────────────────────────────
export interface ExecutiveKpi {
  id: string
  label: string
  value: string
  unitOrTarget: string      // "Target: 17.5% ▲ +3.0pp"
  status: KpiStatus
  ragEmoji: string          // "🔴" | "🟠" | "🟢"
  urban: string
  rural: string
  panelKey: DetailPanelKey
}

// ── Energy flow panel ────────────────────────────────────────────────────────
export interface EnergyFlowData {
  input: { valueText: string; panelKey: DetailPanelKey }
  billed: {
    totalText: string
    okSegment: { valueText: string; flex: number; tag: string }
    provSegment: { valueText: string; flex: number; tag: string }
    panelKey: DetailPanelKey
  }
  collected: { valueText: string; panelKey: DetailPanelKey }
  lossGap: {
    valueText: string          // "10,832 MU"
    percentText: string        // "20.5% of Input"
    monetaryText: string       // "— ₹9,676 Cr"
    panelKey: DetailPanelKey
  }
}

// ── Demand vs Generation panel ───────────────────────────────────────────────
export interface DGRow {
  label: string
  valueText: string
  numericText: string
  percent: number             // 0-100 fill width
  gradient: 'crimson' | 'jade' | 'brand'
  panelKey: DetailPanelKey
}

export interface DGSummaryTile {
  valueText: string
  label: string
  tone: Tone
  panelKey: DetailPanelKey
}

export interface DemandGenerationData {
  balanceText: string          // "−560 MW"
  rows: DGRow[]
  deficitAlert: { text: string; valueText: string; panelKey: DetailPanelKey }
  summary: DGSummaryTile[]
}

// ── Reliability indices panel ────────────────────────────────────────────────
export interface ReliabilityMetric {
  id: string
  name: string
  subtitle: string
  valueText: string
  unit: string
  tone: 'good' | 'warn' | 'bad'
  panelKey: DetailPanelKey
}

export interface TransformerFailureBreakdown {
  totalText: string            // "2,084"
  fleetText: string            // "/ 4,82,000"
  percentText: string          // "0.43%"
  belowKva: { label: string; barPercent: number; valueText: string }
  aboveKva: { label: string; barPercent: number; valueText: string }
}

export interface ReliabilityPanelData {
  metrics: ReliabilityMetric[]
  transformerFailures: TransformerFailureBreakdown & { panelKey: DetailPanelKey }
}

// ── Consumer analytics (map-panel) ───────────────────────────────────────────
export interface TamperSummaryTile {
  eyebrow: string
  value: string
  detail: string
  tone: Tone
  panelKey: DetailPanelKey
}

export interface DiscomBar {
  id: string
  name: string
  cases: number
  percent: number              // 0-100
  tone: 'jade' | 'amber' | 'crimson'
  priority: string             // "P1🔴" etc
  toastMessage: string
  panelKey: DetailPanelKey
}

export interface PipelineStage {
  emoji: string
  label: string
  count: string
  tone: 'jade' | 'amber' | 'crimson'
}

export interface ConsumerAnalyticsData {
  tamperTiles: TamperSummaryTile[]
  discoms: DiscomBar[]
  pipeline: PipelineStage[]
  actionButtons: { label: string; tone: 'crimson' | 'amber' | 'brand' | 'jade'; toast: string }[]
}

// ── Metering health panel ────────────────────────────────────────────────────
export interface MeterStat {
  id: string
  name: string
  valueText: string
  barPercent: number
  tone: 'good' | 'warn' | 'bad'
  nameStyle?: 'emphasis'       // for "Never COM (Ever)" red bold
  panelKey: DetailPanelKey
}

export interface NonComAgeBucket {
  label: string
  barPercent: number
  valueText: string
  age: 'fresh' | 'mid' | 'old'
}

export interface MeteringHealthData {
  stats: MeterStat[]
  nonCom: {
    title: string
    countText: string
    buckets: NonComAgeBucket[]
  }
  tamperToday: { name: string; valueText: string }
}

// ── Prepaid non-recharge panel ───────────────────────────────────────────────
export interface PrepaidBucket {
  label: string
  consumersText: string
  sharePercent: number
  trendText: string
  trend: 'worse' | 'better'
  isEmphasis: boolean
  isSubtle?: boolean           // for "Never Recharged" bottom row
}

export interface PrepaidNonRechargeData {
  totalText: string
  subtitle: string
  trendPct: string             // "+12.4%"
  vsText: string               // "vs last month"
  buckets: PrepaidBucket[]
  alertText: string            // Alert body
  alertPanelKey: DetailPanelKey
}

// ── Revenue snapshot panel ───────────────────────────────────────────────────
export interface RevenueMetric {
  id: string
  name: string
  valueText: string
  unit: string
  tone?: Tone
  panelKey: DetailPanelKey
}

export interface DuesBucket {
  label: string
  percent: number
  valueText: string
  variant: 'young' | 'mid' | 'old' | 'never'
  panelKey: DetailPanelKey
}

export interface RevenueSnapshotData {
  metrics: RevenueMetric[]
  duesTotal: { valueText: string; unit: string; panelKey: DetailPanelKey }
  duesBuckets: DuesBucket[]
  neverPaidAlert: string
}

// ── P2 warnings ──────────────────────────────────────────────────────────────
export interface P2Warning {
  id: string
  eyebrow: string               // "🟠 P2 Warning · Transformers"
  title: string
  detail: string
  badge: string
  panelKey: DetailPanelKey
}

// ── 7-day trends ─────────────────────────────────────────────────────────────
export interface TrendChart {
  id: string
  title: string
  valueText: string
  valueTone: Tone | 'amber'
  points: number[]              // sparkline y-values (higher = up, prototype uses inverted for loss)
  labels: string[]              // per-point value label ("21.6%")
  finalTone: Tone
  color: string                 // sparkline hex
  panelKey: DetailPanelKey
}

// ── Auto insights ────────────────────────────────────────────────────────────
export interface Insight {
  id: string
  icon: string
  tag: string                   // "CRITICAL" | "WARNING" | "INFO" | "REVENUE" | "RELIABILITY"
  tagVariant: 'critical' | 'warning' | 'info'
  bodyHtml: string              // may contain <strong>
  meta: string                  // "2 hours ago · Auto-detected"
  panelKey: DetailPanelKey
}

// ── Detail side panel (opened by clicking anything) ──────────────────────────
export interface DetailSummaryItem {
  value: string
  label: string
  tone?: Tone
}

export interface DetailCell {
  text: string
  bold?: boolean
  tone?: Tone
}

export interface DetailRow {
  cells: DetailCell[]
}

export interface DetailTable {
  headers: string[]
  rows: DetailRow[]
}

export interface DetailSection {
  header?: string
  table?: DetailTable
}

export interface DetailAction {
  label: string
  variant: 'solid' | 'ghost'
  toastMessage: string
}

export interface DetailPanelData {
  sub: string
  title: string
  summary: DetailSummaryItem[]
  sections: DetailSection[]
  actions: DetailAction[]
  /** Note may contain simple <strong> tags — rendered as HTML in a controlled node. */
  note?: string
}
