import { hierData } from '@/data/hierarchy'
import type { HierPath } from '@/shared/types/hierarchy'
import { DT_GEO } from '../data/dtGeo'
import { FEEDER_GEO } from '../data/feederGeo'
import { REAL_METERS_POOL, type RealMeter } from '../data/realMetersPool'
import type { DT, EnrichedFeeder, Feeder, NetworkMapKpis } from '../types'

/** All known DISCOM IDs used for scope matching. */
const ALL_DISCOMS = ['kvvnl', 'dvvnl', 'mvvnl', 'pvvnl', 'puvvnl'] as const

/**
 * Filter FEEDER_GEO by current scope — matches prototype's getFeedersInScope().
 * Empty path → all feeders. If a feeder ID is directly in the path → that one.
 * Otherwise: require every hierarchy level in the path to match feeder's fields.
 */
export function getFeedersInScope(hierPath: HierPath): Feeder[] {
  if (!hierPath || hierPath.length === 0) return FEEDER_GEO
  const pathIds = new Set(hierPath)
  const feederMatch = FEEDER_GEO.find((f) => pathIds.has(f.id))
  if (feederMatch) return [feederMatch]

  const discomInPath = ALL_DISCOMS.find((d) => pathIds.has(d))

  return FEEDER_GEO.filter((f) => {
    if (discomInPath && f.discom !== discomInPath) return false
    let zoneInPath: string | null = null
    let circleInPath: string | null = null
    let divisionInPath: string | null = null
    let subdivInPath: string | null = null
    hierPath.forEach((id) => {
      const node = hierData[id as keyof typeof hierData]
      if (!node) return
      if (node.type === 'Zone') zoneInPath = id
      else if (node.type === 'Circle') circleInPath = id
      else if (node.type === 'Division') divisionInPath = id
      else if (node.type === 'Sub-division') subdivInPath = id
    })
    if (zoneInPath && f.zone !== zoneInPath) return false
    if (circleInPath && f.circle !== circleInPath) return false
    if (divisionInPath && f.division !== divisionInPath) return false
    if (subdivInPath && f.subdivision !== subdivInPath) return false
    return true
  })
}

/** DTs whose `feeder` is in the current scope's feeder set. */
export function getDtsInScope(hierPath: HierPath): DT[] {
  const inScopeFeederIds = new Set(getFeedersInScope(hierPath).map((f) => f.id))
  return DT_GEO.filter((d) => inScopeFeederIds.has(d.feeder))
}

/**
 * Enrich a feeder with aggregated metrics from its DTs.
 * Loss is weighted by meters (matches prototype).
 */
export function enrichFeeders(feeders: Feeder[], dts: DT[]): EnrichedFeeder[] {
  return feeders.map((f) => {
    const myDts = dts.filter((d) => d.feeder === f.id)
    const totalMeters = myDts.reduce((a, d) => a + (d.meters || 0), 0)
    const totalFlagged = myDts.reduce((a, d) => a + (d.flagged || 0), 0)
    const totalCritical = myDts.reduce((a, d) => a + (d.critical || 0), 0)
    const weightedLoss =
      totalMeters > 0
        ? myDts.reduce((a, d) => a + (d.loss || 0) * (d.meters || 0), 0) / totalMeters
        : 0
    return {
      ...f,
      name: f.name || f.area || f.id + ' Feeder',
      loss: weightedLoss,
      meters: totalMeters,
      consumers: totalMeters,
      flagged: totalFlagged,
      critical: totalCritical,
      dtCount: myDts.length,
    }
  })
}

/**
 * Compute the 5 KPI cards from enriched feeders + all DTs.
 * Matches prototype byte-for-byte, including the fallback that returns 100% coverage
 * when there are feeders in scope but no DTs mapped yet (prototype uses `(isEmpty ? 0 : 100)`).
 */
export function computeKpis(
  enrichedFeeders: EnrichedFeeder[],
  allDts: DT[],
): NetworkMapKpis {
  const isEmpty = enrichedFeeders.length === 0
  // 1. Theft hotspots = feeders with weighted-loss ≥ 22% (label reads ">24%", threshold is 22)
  const hotspots = enrichedFeeders.filter((f) => (f.loss || 0) >= 22)
  // 2. Highest-loss feeder — sorted desc by loss
  const sortedF = [...enrichedFeeders].sort((a, b) => (b.loss || 0) - (a.loss || 0))
  const topFeeder = sortedF[0]
  // 3. Under-billing DTs — DTs with loss ≥ 25%
  const underBilling = allDts.filter((d) => (d.loss || 0) >= 25)
  // 4. Confirmed theft — sum of critical consumers across scope DTs
  const confirmedTheft = allDts.reduce((a, d) => a + (d.critical || 0), 0)
  // 5. Asset coverage — % of scope DTs with geo-tags. When no DTs but scope has feeders, 100%.
  const dtsCoverage =
    allDts.length > 0
      ? Math.round((allDts.filter((d) => d.lat).length / allDts.length) * 100)
      : isEmpty
        ? 0
        : 100
  return {
    hotspotsCount: hotspots.length,
    topFeeder,
    underBillingCount: underBilling.length,
    confirmedTheft,
    dtsCoverage,
  }
}

/**
 * Real KVVNL meters filtered to the current scope. Matches prototype's
 * getRealMetersInScope() zone-name string matching.
 */
export function getRealMetersInScope(hierPath: HierPath): RealMeter[] {
  if (!hierPath || hierPath.length === 0) return REAL_METERS_POOL
  const pathIds = new Set(hierPath)

  // Non-KVVNL DISCOM → no real meters (all real data is KVVNL territory)
  const otherDiscoms = ['dvvnl', 'mvvnl', 'pvvnl', 'puvvnl']
  if (otherDiscoms.some((d) => pathIds.has(d))) return []

  // Zone narrowing
  const varanasiScopes = ['varanasi', 'eudc1', 'eudc2', 'bhelupur', 'sd_bhelupur', 'sd_badalalpur']
  if (varanasiScopes.some((v) => pathIds.has(v))) {
    return REAL_METERS_POOL.filter((m) => m.zone.toLowerCase().includes('varanasi'))
  }
  if (pathIds.has('azamgarh')) {
    return REAL_METERS_POOL.filter((m) => m.zone.toLowerCase().includes('azamgarh'))
  }
  if (pathIds.has('jaunpur')) {
    return REAL_METERS_POOL.filter((m) => m.zone.toLowerCase().includes('jaunpur'))
  }
  // Default (UPPCL / KVVNL) → all
  return REAL_METERS_POOL
}

/** Count-only convenience for the header label. */
export function getRealMetersCount(hierPath: HierPath): number {
  return getRealMetersInScope(hierPath).length
}
