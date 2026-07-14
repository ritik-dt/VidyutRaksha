// ── Audit Trail module types ─────────────────────────────────────────────────
// Faithful port of the prototype's renderAudit() (lines 9369-9459) plus
// getVisibleAuditEntries() (line 2299).
//
// The screen carries TWO logs:
//   1. a static, compliance-styled audit log (SHA-256 signatures, IPs), and
//   2. a LIVE "Role activity log" fed from ActivityLogContext and filtered by
//      the active role's visibility scope — real RBAC on the audit feed.

/** Role label as recorded on a static audit row. */
export type AuditRole = 'Admin' | 'Inspector' | 'System'

/** One row of the static (compliance) audit log. */
export interface AuditLogEntry {
  ts: string
  user: string
  role: AuditRole
  /** machine action code, e.g. 'CASE_CONFIRMED'. */
  action: string
  entity: string
  details: string
  /** truncated SHA-256, e.g. 'SHA256:a8f3...'. */
  sig: string
  ip: string
}

// ── KPI row ──────────────────────────────────────────────────────────────────
/** Two KPIs navigate AWAY to the Cases screen rather than filtering Audit. */
export interface AuditKpiNav {
  screen: 'cases'
  status: string
}

export interface AuditKpi {
  id: string
  label: string
  value: string
  sub?: string
  /** accent bar colour (CSS var expression). */
  accent: string
  /** value colour, when the prototype tints it. */
  valueColor?: string
  /** clickable KPIs jump to another screen with a filter. */
  nav?: AuditKpiNav
}

// ── Evidence pack ────────────────────────────────────────────────────────────
export interface EvidenceTile {
  icon: string
  title: string
  detail: string
  /** left-border colour (CSS var expression). */
  color: string
}

// ── AI insight ───────────────────────────────────────────────────────────────
export interface AuditAiInsight {
  title: string
  /** may contain <strong> emphasis. */
  bodyHtml: string
}
