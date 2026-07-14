import type { HierPath } from '@/shared/types/hierarchy'
import { hierData } from '@/data/hierarchy'
import { DTS } from '../data/dts'
import type { DT, DtBuckets, DtStats } from '../types'

/** Utility — DT load ratio. */
export const ratio = (d: DT): number => d.currentLoad / d.capacity

/**
 * Scope filter — pragmatic version matching prototype exactly:
 *   - State-level or empty path → all DTs
 *   - Path contains 'kvvnl' | 'varanasi' | 'eudc1' → all DTs
 *   - Path contains 'bhelupur' → only Bhelupur-feeder DTs
 *   - Path scope is DTR → look up by id/name
 *   - Any other DISCOM path → empty (data doesn't exist)
 */
export function getDtsInScope(hierPath: HierPath): DT[] {
  const pathSet = new Set(hierPath || [])
  const scopeId = hierPath && hierPath.length > 0 ? hierPath[hierPath.length - 1] : 'uppcl'
  const scopeLevel = hierData[scopeId as keyof typeof hierData] ?? null
  const scopeType = scopeLevel?.type ?? 'State'
  const isStateLevel = !scopeLevel || scopeType === 'State'

  if (isStateLevel) return DTS
  if (pathSet.has('kvvnl') || pathSet.has('varanasi') || pathSet.has('eudc1')) {
    if (pathSet.has('bhelupur') || scopeId === 'bhelupur') {
      return DTS.filter((d) => d.feeder === 'Bhelupur')
    }
    if (scopeType === 'DTR') {
      return DTS.filter((d) => d.id === scopeId || (scopeLevel && d.id === scopeLevel.name))
    }
    return DTS
  }
  return []
}

/** Aggregate stats — used by KPI strip + AI insight. */
export function computeDtStats(dts: DT[]): DtStats {
  const total = dts.length
  const atCapacity = dts.filter((d) => ratio(d) >= 0.85).length
  const projOverload = dts.filter((d) => d.projectedLoad90 / d.capacity > 1).length
  const criticalLoss = dts.filter((d) => d.loss > 15).length
  const totalConsumers = dts.reduce((a, d) => a + d.consumers, 0)
  const avgLoss = total > 0 ? dts.reduce((a, d) => a + d.loss, 0) / total : 0
  const overloaded = dts.filter((d) => ratio(d) > 1).length
  const nearOverload = dts.filter((d) => {
    const r = ratio(d)
    return r >= 0.85 && r <= 1
  }).length
  const optimalDts = dts.filter((d) => {
    const r = ratio(d)
    return r >= 0.55 && r < 0.85
  }).length
  const optimalPct = total > 0 ? Math.round((optimalDts / total) * 100) : 0
  const underUtilised = dts.filter((d) => ratio(d) < 0.55).length
  return {
    total,
    atCapacity,
    projOverload,
    criticalLoss,
    totalConsumers,
    avgLoss,
    overloaded,
    nearOverload,
    optimalDts,
    optimalPct,
    underUtilised,
  }
}

/** Bucket the DTs by load band — used to render the four page sections. */
export function bucketDts(dts: DT[]): DtBuckets {
  const overloaded = dts.filter((d) => ratio(d) > 1).sort((a, b) => ratio(b) - ratio(a))
  const nearOverload = dts
    .filter((d) => {
      const r = ratio(d)
      return r >= 0.85 && r <= 1
    })
    .sort((a, b) => ratio(b) - ratio(a))
  const optimal = dts
    .filter((d) => {
      const r = ratio(d)
      return r >= 0.55 && r < 0.85
    })
    .sort((a, b) => ratio(b) - ratio(a))
  const underUtilised = dts.filter((d) => ratio(d) < 0.55).sort((a, b) => ratio(b) - ratio(a))
  const sortedAll = [...dts].sort((a, b) => ratio(b) - ratio(a))
  return { overloaded, nearOverload, optimal, underUtilised, sortedAll }
}

/**
 * Find a lightly-loaded DT that could absorb load from `d`.
 * Matches prototype's `findRedistributionCandidate(d)`.
 */
export function findRedistributionCandidate(d: DT, pool: DT[] = DTS): DT | null {
  const candidates = pool.filter((c) => c.id !== d.id && ratio(c) < 0.7).sort((a, b) => ratio(a) - ratio(b))
  return candidates[0] ?? null
}
