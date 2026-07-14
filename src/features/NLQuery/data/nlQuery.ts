// ── NLQuery data pool (Layer 1) ──────────────────────────────────────────────
// Every string and row copied verbatim from the prototype's renderNLQuery().
// Today these are static; tomorrow they become the return values of an async
// fetcher — nothing else in the module changes.

import type { NlResultMeta, NlResultRow, NlSuggestion } from '../types'

/** The example query pre-populated in the input on first paint. */
export const DEFAULT_QUERY =
  'Show me all domestic meters in Chowk Division with consumption drop > 40% and earth loading events'

/**
 * The three "Try:" suggestion chips. Quotes are part of the prototype content
 * (they show as literal " marks inside the chip).
 */
export const NL_SUGGESTIONS: NlSuggestion[] = [
  { label: '"High-risk unassigned meters"' },
  { label: '"DTs with loss > 20%"' },
  { label: '"Last month\'s recovery"' },
]

/** The SQL block shown in the result card. `\n` renders as `<br>` in prototype. */
export const NL_SQL_TEXT = [
  'SELECT m.meter_id, m.category, b.kwh_drop_pct, e.earth_loading_count',
  "FROM meters m JOIN billing b ... WHERE m.division = 'Chowk' AND b.kwh_drop_pct > 40 AND e.earth_loading_count > 0",
].join('\n')

/** Header + footer meta for the result card. */
export const NL_RESULT_META: NlResultMeta = {
  headerTitle: 'AI found 23 meters',
  headerLatency: 'in 0.4s',
  footerCount: '3 of 23',
}

/** The 3 example rows in the result table. Verbatim from prototype. */
export const NL_RESULT_ROWS: NlResultRow[] = [
  { meter: '1849966', area: 'Feeder-7', drop: '-54%', events: 50, risk: 94, confidence: 87 },
  { meter: '1923445', area: 'Feeder-9', drop: '-48%', events: 12, risk: 78, confidence: 83 },
  { meter: '1334890', area: 'Feeder-6', drop: '-45%', events: 8,  risk: 71, confidence: 75 },
]
