// ── Reports module types ─────────────────────────────────────────────────────
// Faithful port of the prototype's renderReports() (lines 10500-10771) plus its
// report-viewer subsystem (_REPORT_DEFS / _REPORT_STUB_INFO / _renderFullReport
// / _renderStubReport). Reports is state-level and NOT scope-reactive — the
// prototype does no scope filtering here.

// ── Section A · Statutory & regulatory (file-or-fine) ────────────────────────
export interface StatutoryReport {
  id: ReportId
  name: string
  regulator: string
  basis: string
  frequency: string
  deadline: string
  daysLeft: number
  lastFiled: string
  status: string
  /** CSS var expression for the status pill background, e.g. 'var(--amber)'. */
  statusColor: string
  owner: string
  penalty: string
}

// ── Section B · Scheduled internal reports ───────────────────────────────────
export type InternalStatus = 'Active' | 'Paused'

export interface InternalReport {
  id: ReportId
  name: string
  icon: string
  freq: string
  channel: string
  recipients: string
  last: string
  next: string
  status: InternalStatus
}

// ── Section C · Ad-hoc saved NL-queries ──────────────────────────────────────
export interface AdhocReport {
  id: ReportId
  query: string
  author: string
  lastRun: string
  uses: number
}

// ── Section D · Templates library ────────────────────────────────────────────
export interface ReportTemplate {
  id: ReportId
  name: string
  uses: number
  lastUsed: string
}

// ── At-a-glance strip (all 4 values are COMPUTED, not hardcoded) ─────────────
export type GlanceTone = 'green' | 'purple' | 'red' | 'teal'

export interface GlanceTile {
  id: string
  label: string
  value: string
  sub: string
  tone: GlanceTone
}

// ── Report viewer · document model ───────────────────────────────────────────
// The 12 full reports are long-form regulatory documents. Rather than storing
// opaque HTML blobs, their bodies are modelled as typed blocks so they stay
// structured, readable, and API-swappable.

/** A table column header. */
export interface ReportTableCol {
  label: string
  align?: 'left' | 'right'
}

/** A single table cell. Mirrors the inline styling the prototype puts on <td>. */
export interface ReportTableCell {
  text: string
  align?: 'left' | 'right'
  /** monospace the value (used for figures/dates in the prototype). */
  mono?: boolean
  bold?: boolean
  /** semantic colour, e.g. 'var(--red)'. */
  color?: string
  /** explicit column width the prototype sets on the cell, e.g. '55%'. */
  width?: string
  /** cells the prototype renders smaller/larger, e.g. '10px'. */
  fontSize?: string
  /** inline mini progress-bar rendered before the cell text (score columns). */
  bar?: { percent: number; tone: ReportTone }
}

/** Colour applied to a metric-tile value / table cell inside a report. */
export type ReportTone = 'green' | 'purple' | 'red' | 'teal' | 'amber'

/** A tile in a report metric grid. Two shapes exist in the prototype: a flat
 *  label/value/sub tile, and one where the value carries a trailing unit
 *  (e.g. "180  min/customer" with a "Target: <120 min" sub-line). */
export interface ReportMetricTile {
  label: string
  value: string
  /** unit rendered inline after the value, e.g. "min/customer". */
  unit?: string
  sub?: string
  tone?: ReportTone
}

/** Body blocks a report section can contain. */
/** Row-level emphasis (total rows and highlighted rows are tinted + bold). */
export interface ReportTableRow {
  cells: ReportTableCell[]
  /** tinted + bold row — used for totals and highlights. */
  variant?: ReportTone
  /** heavier (2px) top border, as on the strongest total rows. */
  strongTop?: boolean
}

export type ReportBlock =
  | { kind: 'paragraph'; html: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; cols: ReportTableCol[]; rows: ReportTableRow[] }
  /** Small dim line under a table/paragraph. The prototype renders these as
   *  plain <p> text — NOT as a boxed callout. */
  | { kind: 'caption'; html: string }
  /** cols mirrors the prototype's grid-template-columns (4 or 3). */
  | { kind: 'metricGrid'; cols: number; tiles: ReportMetricTile[] }

export interface ReportSection {
  heading: string
  blocks: ReportBlock[]
}

/** A full regulatory report document (12 of these). */
export interface ReportDef {
  title: string
  subtitle: string
  docNo: string
  classification: string
  regulator: string
  legalCite: string
  footer: string
  sections: ReportSection[]
}

/** A lightweight preview for reports that aren't fully authored (10 of these). */
export interface ReportStub {
  title: string
  subtitle: string
  sectionTitles: string[]
}

/** Discriminated result of resolving a report id. */
export type ResolvedReport =
  | { kind: 'full'; def: ReportDef }
  | { kind: 'stub'; stub: ReportStub }
  | { kind: 'missing' }

// ── AI insight footer ────────────────────────────────────────────────────────
export interface ReportsAiInsightData {
  title: string
  /** body may contain <strong> emphasis. */
  bodyHtml: string
}

// ── Report ids (all 22) ──────────────────────────────────────────────────────
export type ReportId =
  // statutory (6) — all have full defs
  | 'rep-uperc-arr'
  | 'rep-uperc-true-up'
  | 'rep-rdss-quarterly'
  | 'rep-bee-audit'
  | 'rep-cea-reliability'
  | 'rep-companies-act'
  // internal scheduled (7) — 6 full defs + 1 stub
  | 'rep-daily-theft'
  | 'rep-weekly-recovery'
  | 'rep-monthly-dt-audit'
  | 'rep-board-pack'
  | 'rep-aen-weekly'
  | 'rep-sec135-status'
  | 'rep-cluster-digest'
  // ad-hoc saved (4) — stubs
  | 'rep-adhoc-1'
  | 'rep-adhoc-2'
  | 'rep-adhoc-3'
  | 'rep-adhoc-4'
  // templates (5) — stubs
  | 'rep-tmpl-court'
  | 'rep-tmpl-board'
  | 'rep-tmpl-aen'
  | 'rep-tmpl-dt'
  | 'rep-tmpl-disconnect'
