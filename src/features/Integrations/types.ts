// ── Integrations module types ────────────────────────────────────────────────
// Faithful port of the prototype's renderIntegrations() (lines 9460-9499).
// Connected systems, sync status, and health monitoring. State-level, NOT
// scope-reactive.

/** Health status of a connected system. */
export type IntStatus = 'Healthy' | 'Warning' | 'Error'

/** One connected system. */
export interface IntegrationSystem {
  name: string
  /** transport / protocol, e.g. 'REST API'. */
  type: string
  status: IntStatus
  icon: string
  /** status colour (CSS var expression) — drives the left border and badge. */
  color: string
  lastSync: string
  /** volume processed today; free-form ('Continuous', 'Connection timeout'). */
  recordsToday: string
  /** uptime as authored, e.g. '99.98%'. */
  uptime: string
  vendor: string
}

// ── KPI row ──────────────────────────────────────────────────────────────────
export interface IntKpi {
  id: string
  label: string
  value: string
  /** accent bar colour (CSS var expression). */
  accent: string
  /** value colour, when the prototype tints it. */
  valueColor?: string
  /** clickable KPIs carry the filter they apply; `null` clears the filter. */
  filter?: IntStatus | null
}

// ── AI insight ───────────────────────────────────────────────────────────────
export interface IntAiInsight {
  title: string
  /** may contain <strong> emphasis. */
  bodyHtml: string
}
