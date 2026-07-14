// ── Team inspectors data (Layer 1) ───────────────────────────────────────────
// Extends the base INSPECTOR_DIRECTORY (already ported in Cases) with the 7
// leaderboard fields the Team screen adds. Every field is copied verbatim from
// the prototype's INSPECTORS array (lines 2613–2637).

import { INSPECTOR_DIRECTORY } from '@/features/Cases/data/inspectors'
import type { TeamInspector } from '../types'

/** Per-inspector leaderboard fields, keyed by inspector id. Verbatim. */
const LEADERBOARD_FIELDS: Record<
  string,
  Pick<
    TeamInspector,
    'assigned' | 'inspected' | 'confirmed' | 'falsePositive' | 'pending' | 'recovered' | 'rank'
  >
> = {
  rk: { assigned: 42, inspected: 38, confirmed: 26, falsePositive: 2, pending: 4, recovered: 182400, rank: 1 },
  as: { assigned: 38, inspected: 35, confirmed: 22, falsePositive: 3, pending: 3, recovered: 154200, rank: 2 },
  sv: { assigned: 45, inspected: 40, confirmed: 24, falsePositive: 6, pending: 5, recovered: 148800, rank: 3 },
  vy: { assigned: 36, inspected: 31, confirmed: 18, falsePositive: 4, pending: 5, recovered: 126000, rank: 4 },
  pm: { assigned: 28, inspected: 24, confirmed: 13, falsePositive: 4, pending: 4, recovered: 89600,  rank: 5 },
  rt: { assigned: 32, inspected: 26, confirmed: 12, falsePositive: 7, pending: 6, recovered: 74400,  rank: 6 },
  nd: { assigned: 22, inspected: 19, confirmed: 11, falsePositive: 2, pending: 3, recovered: 98200,  rank: 7 },
  // Note: Shalini Sharma has rank 3 in the prototype (a shared podium spot).
  ss: { assigned: 26, inspected: 22, confirmed: 14, falsePositive: 1, pending: 3, recovered: 118600, rank: 3 },
}

/**
 * The Team screen's inspector list: base directory + leaderboard fields, in
 * the prototype's declared order.
 */
export const TEAM_INSPECTORS: TeamInspector[] = INSPECTOR_DIRECTORY.map((i) => ({
  ...i,
  ...LEADERBOARD_FIELDS[i.id],
}))

// ── Chart data (verbatim from prototype's initTeamCharts, line 9267) ────────
export const INSP_HIT_LABELS = ['Rajesh K', 'Amit S', 'Sunita V', 'Vikram Y', 'Priya M', 'Ramesh T']
export const INSP_HIT_VALUES = [68.4, 62.9, 60.0, 58.1, 54.2, 46.2]
export const INSP_LOAD_LABELS = INSP_HIT_LABELS
export const INSP_LOAD_VALUES = [42, 38, 45, 36, 28, 32]

/** Per-bar colouring rules — matches prototype's inline ternaries. */
export function hitRateColor(v: number): string {
  if (v > 60) return '#28A745' // green
  if (v > 50) return '#E6921E' // amber
  return '#DC3545' // red
}
export function assignedColor(v: number): string {
  if (v > 40) return '#DC3545'
  if (v > 35) return '#E6921E'
  return '#28A745'
}
