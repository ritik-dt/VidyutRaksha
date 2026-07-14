// ── Data Quality logic (pure) ────────────────────────────────────────────────

import type { AttentionRow, DqFilterId } from '../types'

/**
 * Filter the attention table by the bucket a KPI card selected.
 *
 * The prototype wires kpiClick('dataQuality', {filter:'stopped'|'intermittent'})
 * and renders a filter pill, but never actually filters anything — the pill
 * appears and the table stays put. We make the filter real, consistent with the
 * Users module.
 */
export function filterAttention(rows: AttentionRow[], filter?: DqFilterId): AttentionRow[] {
  if (!filter) return rows
  return rows.filter((r) => r.bucket === filter)
}
