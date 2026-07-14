// ── Integrations logic (pure) ────────────────────────────────────────────────

import type { IntKpi, IntStatus, IntegrationSystem } from '../types'

/**
 * Avg-uptime source of truth.
 *
 * The prototype hardcodes "99.29%", but the mean of its own ten uptimes is
 * 99.19% — an arithmetic error in the source, not a rounding artifact. Its four
 * sibling KPIs (10 / 8 / 1 / 1) are all correctly derivable from the data, so
 * leaving this one stale and wrong would be the odd one out; we compute it.
 *
 * Flip this to `false` to render the prototype's literal 99.29% instead.
 */
const COMPUTE_AVG_UPTIME = true

/** The value the prototype prints, retained so the choice above is reversible. */
const PROTOTYPE_AVG_UPTIME = '99.29%'

/** Count systems in a given health state. */
export function countByStatus(systems: IntegrationSystem[], status: IntStatus): number {
  return systems.filter((s) => s.status === status).length
}

/** Mean uptime across all systems, formatted to 2dp. */
export function averageUptime(systems: IntegrationSystem[]): string {
  if (systems.length === 0) return '—'
  const mean =
    systems.reduce((total, s) => total + parseFloat(s.uptime), 0) / systems.length
  return `${mean.toFixed(2)}%`
}

/**
 * Uptime colour, exactly as the prototype computes it:
 *   > 99  → green
 *   > 95  → amber
 *   else  → red
 */
export function uptimeColor(uptime: string): string {
  const v = parseFloat(uptime)
  if (v > 99) return 'var(--green)'
  if (v > 95) return 'var(--amber)'
  return 'var(--red)'
}

/** Build the 5 KPI cards. Four are derived from the systems array. */
export function buildIntKpis(systems: IntegrationSystem[]): IntKpi[] {
  return [
    {
      id: 'connected',
      label: 'Connected systems',
      value: String(systems.length),
      accent: 'var(--navy-light)',
      filter: null, // clears the filter, matching kpiClick('integrations', {})
    },
    {
      id: 'healthy',
      label: 'Healthy',
      value: String(countByStatus(systems, 'Healthy')),
      accent: 'var(--green)',
      valueColor: 'var(--green)',
      filter: 'Healthy',
    },
    {
      id: 'warnings',
      label: 'Warnings',
      value: String(countByStatus(systems, 'Warning')),
      accent: 'var(--amber)',
      valueColor: 'var(--amber)',
      filter: 'Warning',
    },
    {
      id: 'errors',
      label: 'Errors',
      value: String(countByStatus(systems, 'Error')),
      accent: 'var(--red)',
      valueColor: 'var(--red)',
      filter: 'Error',
    },
    {
      id: 'uptime',
      label: 'Avg uptime',
      value: COMPUTE_AVG_UPTIME ? averageUptime(systems) : PROTOTYPE_AVG_UPTIME,
      accent: 'var(--teal)',
    },
  ]
}

/** Filter the system cards by health status. */
export function filterSystems(
  systems: IntegrationSystem[],
  status?: IntStatus,
): IntegrationSystem[] {
  if (!status) return systems
  return systems.filter((s) => s.status === status)
}
