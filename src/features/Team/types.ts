// ── Team module types (Layer 0) ──────────────────────────────────────────────
// Faithful port of the prototype's renderTeamScreen() (line 2848) and its
// helpers (renderLoadCard, computeRebalanceSuggestions, showInspectorCases,
// openRebalanceModal). Extends the base Inspector already ported in
// Cases/data/inspectors.ts with the seven "leaderboard" fields the Team screen
// adds on top.

import type { Inspector } from '@/features/Cases/data/inspectors'

/**
 * Team-screen inspector: the base directory record plus the 7 leaderboard
 * fields that appear only on this screen.
 */
export interface TeamInspector extends Inspector {
  /** Total cases ever assigned to this inspector. */
  assigned: number
  /** Total cases they've completed an inspection on. */
  inspected: number
  /** Confirmed-theft outcomes. */
  confirmed: number
  /** False-positive outcomes. */
  falsePositive: number
  /** Currently pending outcomes (inspected but not resolved). */
  pending: number
  /** Total rupees recovered from confirmed cases (in ₹). */
  recovered: number
  /** Their leaderboard rank (1 = best). */
  rank: number
}

/** Filter for the workload-distribution grid subset. */
export type TeamFilter = 'all' | 'overloaded' | 'available' | 'onleave'

/** One AI rebalance suggestion — move `caseCount` cases from `src` → `dst`. */
export interface RebalanceMove {
  src: TeamInspector
  dst: TeamInspector
  reason: string
  caseCount: number
}

/**
 * A synthetic case generated for the inspector-cases side panel. Deterministic
 * (seeded from inspector.id) so re-renders produce the same list.
 */
export interface InspectorGeneratedCase {
  id: string
  meter: string
  consumer: string
  area: string
  theftType: string
  risk: number
  status: string
  due: string
  created: string
  isOverdue: boolean
}
