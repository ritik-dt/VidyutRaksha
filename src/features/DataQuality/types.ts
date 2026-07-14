// ── Data Quality module types ────────────────────────────────────────────────
// Faithful port of the prototype's renderDataQuality() (lines 9081-9132) plus
// initDataQualityCharts() (9134-9149). Monitors the MRI ingestion pipeline,
// meter communication health, and data completeness. State-level, NOT
// scope-reactive.

/** KPI filter set by clicking a KPI card (kpiClick('dataQuality', …)). */
export type DqFilterId = 'stopped' | 'intermittent'

export interface DqFilter {
  filter?: DqFilterId
}

// ── KPI row ──────────────────────────────────────────────────────────────────
export interface DqKpi {
  id: string
  label: string
  value: string
  sub: string
  /** accent bar colour (CSS var expression). */
  accent: string
  /** value colour, when the prototype tints it. */
  valueColor?: string
  /** clickable KPIs carry the filter they apply. */
  filter?: DqFilterId
}

// ── Ingestion pipeline strip ─────────────────────────────────────────────────
export interface PipelineStat {
  label: string
  val: string
  /** left-border + value colour (CSS var expression). */
  color: string
  icon: string
}

// ── Meters requiring attention ───────────────────────────────────────────────
/** Which comm-health bucket a row belongs to — drives the KPI filter. */
export type AttentionBucket = 'stopped' | 'intermittent'

export interface AttentionRow {
  area: string
  stopped: string
  pct: string
  lastComm: string
  cause: string
  /** badge class for the cause. */
  causeBadge: string
  action: string
  /** badge class for the action. */
  actionBadge: string
  /** value colour for the stopped count. */
  countColor: string
  bucket: AttentionBucket
}

// ── Data completeness (MRI file sections) ────────────────────────────────────
export interface CompletenessRow {
  section: string
  complete: string
  partial: string
  missing: string
  pct: string
  /** completeness colour — green above the threshold, amber below. */
  pctColor: string
}

// ── AI insight ───────────────────────────────────────────────────────────────
export interface DqAiInsight {
  title: string
  /** may contain <strong> emphasis. */
  bodyHtml: string
}
