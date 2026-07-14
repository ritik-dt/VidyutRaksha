/**
 * Shared hierarchy/level helpers — used by Dashboard, Meters, and future
 * modules. Extracted from the Dashboard adapter so features don't depend on
 * each other. Pure functions over hierarchy nodes; no feature coupling.
 */
import type { HierChildRef, HierNode, HierNodeType } from '@/shared/types'
import type { EnrichedChildRef, EnrichedLevel } from '@/shared/types/hierarchy'

const CHILD_LABELS: Record<string, string> = {
  State: 'DISCOM',
  DISCOM: 'Zone',
  Zone: 'Circle',
  Circle: 'Division',
  Division: 'Sub-division',
  'Sub-division': 'Feeder',
  Feeder: 'DTR',
  DTR: 'Consumer',
}

/** Label for the immediate children of a level (e.g. a DISCOM's children are Zones). */
export function getChildLabel(type: string | undefined): string {
  return CHILD_LABELS[type ?? ''] ?? 'Children'
}

/** True at the terminal (consumer) level. */
export function isConsumerLevel(
  type: HierNodeType | string | undefined,
): boolean {
  return type === 'DTR'
}

/** AT&C loss → RAG color token. */
export function getLossColor(loss: number): string {
  if (loss > 22) return 'var(--red)'
  if (loss > 18) return 'var(--amber)'
  return 'var(--green)'
}

/** Inspection hit-rate → RAG color token. */
export function getHitRateColor(hitRate: number): string {
  if (hitRate > 60) return 'var(--green)'
  if (hitRate > 50) return 'var(--amber)'
  return 'var(--red)'
}

/** Derive risk bands + assessment/recovery on a child ref if not pre-set. */
function enrichChild(child: HierChildRef): EnrichedChildRef {
  const enriched: EnrichedChildRef = { ...child }

  if (enriched.flagged != null) {
    if (enriched.critical == null)
      enriched.critical = Math.round(enriched.flagged * 0.12)
    if (enriched.high == null)
      enriched.high = Math.round(enriched.flagged * 0.33)
    if (enriched.medium == null)
      enriched.medium =
        enriched.flagged - (enriched.critical ?? 0) - (enriched.high ?? 0)
    if (enriched.openCases == null)
      enriched.openCases = Math.round(enriched.flagged * 0.18)
    if (enriched.newToday == null)
      enriched.newToday = Math.round(enriched.flagged * 0.021)
    if (enriched.overdueInspections == null)
      enriched.overdueInspections = Math.round(enriched.flagged * 0.018)
  }

  if (enriched.confirmed != null) {
    if (enriched.assessed == null)
      enriched.assessed = enriched.confirmed * 600_000
    if (enriched.realized == null)
      enriched.realized = Math.round((enriched.assessed ?? 0) * 0.62)
    if (enriched.closedYesterday == null)
      enriched.closedYesterday = Math.max(
        0,
        Math.round(enriched.confirmed * 0.014),
      )
  }

  return enriched
}

/** Derive risk bands + assessment/recovery (and enrich children) on a level. */
export function enrichLevel(level: HierNode): EnrichedLevel {
  const enriched: EnrichedLevel = { ...level }

  if (enriched.flagged != null) {
    if (enriched.critical == null)
      enriched.critical = Math.round(enriched.flagged * 0.12)
    if (enriched.high == null)
      enriched.high = Math.round(enriched.flagged * 0.33)
    if (enriched.medium == null)
      enriched.medium =
        enriched.flagged - (enriched.critical ?? 0) - (enriched.high ?? 0)
    if (enriched.openCases == null)
      enriched.openCases = Math.round(enriched.flagged * 0.18)
    if (enriched.newToday == null)
      enriched.newToday = Math.round(enriched.flagged * 0.021)
    if (enriched.overdueInspections == null)
      enriched.overdueInspections = Math.round(enriched.flagged * 0.018)
  }

  if (enriched.confirmed != null) {
    if (enriched.assessed == null)
      enriched.assessed = enriched.confirmed * 600_000
    if (enriched.realized == null)
      enriched.realized = Math.round((enriched.assessed ?? 0) * 0.62)
    if (enriched.closedYesterday == null)
      enriched.closedYesterday = Math.max(
        0,
        Math.round(enriched.confirmed * 0.014),
      )
  }

  if (Array.isArray(enriched.children)) {
    enriched.children = enriched.children.map(enrichChild)
  }

  return enriched
}
