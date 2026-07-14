// ── Team logic (Layer 2) ─────────────────────────────────────────────────────
// Pure functions on plain data. No React, no DOM, no side effects.

import type { RebalanceMove, TeamFilter, TeamInspector } from '../types'

// ── Bucket helpers ──────────────────────────────────────────────────────────
export function overloadedList(insps: TeamInspector[]): TeamInspector[] {
  return insps.filter((i) => i.openCases / i.capacity >= 0.9 && i.status !== 'leave')
}
export function underutilList(insps: TeamInspector[]): TeamInspector[] {
  return insps.filter((i) => i.openCases / i.capacity < 0.5 && i.status !== 'leave')
}
export function onLeaveList(insps: TeamInspector[]): TeamInspector[] {
  return insps.filter((i) => i.status === 'leave')
}

// ── Filter + sort for the workload-distribution grid ────────────────────────
export function filterInspectors(insps: TeamInspector[], filter: TeamFilter): TeamInspector[] {
  if (filter === 'overloaded') return overloadedList(insps)
  if (filter === 'available') return underutilList(insps)
  if (filter === 'onleave') return onLeaveList(insps)
  return insps
}

/** Sort by capacity-utilization descending. */
export function sortByCapacity(insps: TeamInspector[]): TeamInspector[] {
  return [...insps].sort((a, b) => b.openCases / b.capacity - a.openCases / a.capacity)
}

// ── Small helpers used by both suggestions and insight ──────────────────────
function areaMatch(a: TeamInspector, b: TeamInspector): boolean {
  return a.areas.some((x) => b.areas.includes(x))
}
function skillMatch(a: TeamInspector, b: TeamInspector): boolean {
  return a.skills.some((x) => b.skills.includes(x))
}

/** Does the inspector's `areas` cover the given case area? */
export function inspectorCoversArea(insp: TeamInspector, caseArea: string): boolean {
  if (!caseArea) return false
  const area = caseArea.toLowerCase()
  return insp.areas.some((a) => area.includes(a.toLowerCase()) || a.toLowerCase().includes(area))
}

// ── Rebalance suggestions — byte-identical port of prototype's function ─────
/**
 * Build up to `maxMoves` case-move suggestions to balance the team. Mirrors
 * the prototype's computeRebalanceSuggestions() including its virtual-mutation
 * / restore / group-by-pair pattern.
 */
export function computeRebalanceSuggestions(
  input: TeamInspector[],
  maxMoves = 5,
): RebalanceMove[] {
  // Work on a mutable clone so we can virtually apply moves without changing input.
  const insps: TeamInspector[] = input.map((i) => ({ ...i }))

  const overloaded = insps.filter((i) => i.openCases / i.capacity >= 0.9 && i.status !== 'leave')
  const leave = insps.filter((i) => i.status === 'leave')
  const targets = insps.filter((i) => i.openCases / i.capacity < 0.55 && i.status !== 'leave')

  if (targets.length === 0 || (overloaded.length === 0 && leave.length === 0)) return []

  const sources = [...overloaded, ...leave]
  const moves: RebalanceMove[] = []

  for (const src of sources) {
    if (moves.length >= maxMoves) break
    const needToMove =
      src.status === 'leave'
        ? Math.min(src.openCases, 4)
        : Math.max(1, src.openCases - Math.floor(src.capacity * 0.75))

    for (let n = 0; n < needToMove && moves.length < maxMoves; n++) {
      const ranked = targets
        .map((t) => {
          const cap = (t.capacity - t.openCases) / t.capacity
          const aMatch = areaMatch(t, src) ? 1 : 0
          const sMatch = skillMatch(t, src) ? 1 : 0
          return { insp: t, fitScore: cap * 40 + aMatch * 20 + sMatch * 10 }
        })
        .sort((a, b) => b.fitScore - a.fitScore)
      if (ranked.length === 0) break

      const dst = ranked[0].insp
      // Guard: destination still has room after prior virtual moves
      if (dst.openCases >= dst.capacity * 0.85) continue

      moves.push({
        src,
        dst,
        reason:
          src.status === 'leave'
            ? 'On leave — redistribute coverage'
            : (areaMatch(src, dst) ? 'Same area' : 'Capacity available') +
              (skillMatch(src, dst) ? ' · skill match' : ''),
        caseCount: 1,
      })
      // Virtual apply — so the next iteration's "capacity available" reflects reality
      src.openCases--
      dst.openCases++
    }
  }

  // Restore virtual loads on the mutable clones (kept identical to prototype
  // even though we're returning the mutated clones — the src/dst refs on each
  // move are to those same objects, which the caller then treats as read-only).
  for (const m of moves) {
    m.src.openCases++
    m.dst.openCases--
  }

  // Group consecutive same-pair moves — sum their caseCount
  const grouped: RebalanceMove[] = []
  for (const m of moves) {
    const existing = grouped.find((g) => g.src.id === m.src.id && g.dst.id === m.dst.id)
    if (existing) existing.caseCount++
    else grouped.push({ ...m })
  }
  return grouped
}

// ── Insight text — three-branch decision matching the prototype ─────────────
/** Build the raw AI-insight sentence. Contains inline <strong> markup (as
 *  React elements are constructed by the presentation layer, this returns
 *  the resolved plain text pieces + colors as an object). */
export interface InsightModel {
  kind: 'rebalance' | 'sla' | 'balanced'
  utilPct: number
  suggestionsCount: number
  totalPastSla: number
  /** For 'rebalance' branch only. */
  overloaded?: TeamInspector
  overloadedPct?: number
  underutil?: TeamInspector
  underutilPct?: number
  sameArea?: boolean
}

export function buildInsight(
  insps: TeamInspector[],
  suggestions: RebalanceMove[],
): InsightModel {
  const overloaded = overloadedList(insps)
  const underutil = underutilList(insps)
  const totalCap = insps.reduce((s, i) => s + i.capacity, 0)
  const totalOpen = insps.reduce((s, i) => s + i.openCases, 0)
  const utilPct = Math.round((totalOpen / totalCap) * 100)
  const totalPastSla = insps.reduce((s, i) => s + i.pastSla, 0)

  if (overloaded.length > 0 && underutil.length > 0) {
    const o = overloaded[0]
    const u = underutil[0]
    return {
      kind: 'rebalance',
      utilPct,
      suggestionsCount: suggestions.length,
      totalPastSla,
      overloaded: o,
      overloadedPct: Math.round((o.openCases / o.capacity) * 100),
      underutil: u,
      underutilPct: Math.round((u.openCases / u.capacity) * 100),
      sameArea: inspectorCoversArea(u, o.areas[0]),
    }
  }
  if (totalPastSla > 0) {
    return { kind: 'sla', utilPct, suggestionsCount: suggestions.length, totalPastSla }
  }
  return { kind: 'balanced', utilPct, suggestionsCount: suggestions.length, totalPastSla }
}

// ── KPI aggregates ──────────────────────────────────────────────────────────
export interface TeamKpis {
  totalOpen: number
  totalCap: number
  utilPct: number
  overloaded: number
  underutil: number
  totalPastSla: number
  inspectorCount: number
}
export function computeKpis(insps: TeamInspector[]): TeamKpis {
  const totalCap = insps.reduce((s, i) => s + i.capacity, 0)
  const totalOpen = insps.reduce((s, i) => s + i.openCases, 0)
  return {
    totalOpen,
    totalCap,
    utilPct: Math.round((totalOpen / totalCap) * 100),
    overloaded: overloadedList(insps).length,
    underutil: underutilList(insps).length,
    totalPastSla: insps.reduce((s, i) => s + i.pastSla, 0),
    inspectorCount: insps.length,
  }
}

// ── Load-card derived values ────────────────────────────────────────────────
export type CapacityTier = 'ok' | 'mid' | 'high'
export function capacityTier(util: number): CapacityTier {
  if (util < 0.6) return 'ok'
  if (util < 0.85) return 'mid'
  return 'high'
}

export type CardAction =
  | { kind: 'leave' }
  | { kind: 'available' }
  | { kind: 'reduce' }
  | { kind: 'balanced' }
export function cardAction(insp: TeamInspector): CardAction {
  if (insp.status === 'leave') return { kind: 'leave' }
  const util = insp.openCases / insp.capacity
  if (util < 0.7) return { kind: 'available' }
  if (util >= 0.9) return { kind: 'reduce' }
  return { kind: 'balanced' }
}
