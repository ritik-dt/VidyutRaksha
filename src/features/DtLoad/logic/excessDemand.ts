import type { HierPath } from '@/shared/types/hierarchy'
import { hierData } from '@/data/hierarchy'
import { REAL_METERS_POOL } from '@/features/NetworkMap/data/realMetersPool'

/** A consumer whose peak load exceeds their sanctioned load. */
export interface ExcessDemandConsumer {
  meter: string
  name: string
  activity: string
  tariff: string
  sanctioned: number
  peak: number
  excessKW: number
  excessPct: number
  surcharge: number
  status: 'Notice issued' | 'Recovered' | 'Pending'
  dt: string
}

/**
 * Compute the excess-demand consumer list for the current scope.
 * Byte-identical port of prototype's IIFE in renderDtLoad:
 *   - Scope-aware target count via `scopeLevel.meters` ratio (state cap = 48)
 *   - Deterministic seed by scope id → same scope always yields same list
 *   - Filter REAL_METERS_POOL for sanctioned load >= 4 KW
 *   - Synthesize peak demand exceeding sanctioned by 10–79%
 *   - UPERC demand surcharge ≈ ₹120/KW/month
 *   - Status distribution: 25% Notice issued, 15% Recovered, 60% Pending
 *   - Sorted by excess % descending
 */
export function computeExcessDemand(hierPath: HierPath): ExcessDemandConsumer[] {
  if (!Array.isArray(REAL_METERS_POOL) || REAL_METERS_POOL.length === 0) return []

  const scopeId = hierPath && hierPath.length > 0 ? hierPath[hierPath.length - 1] : 'uppcl'
  const scopeLevel = hierData[scopeId as keyof typeof hierData] as unknown as { meters?: number } | null
  const scopeMeters = scopeLevel?.meters ?? 1500000
  const stateMeters = 1500000
  const baseCount = 48
  const targetCount = Math.max(2, Math.round(baseCount * Math.min(1, scopeMeters / stateMeters)))

  // Deterministic seed from scope id — same scope always yields same list
  let seed = 0
  for (const ch of scopeId || 'uppcl') {
    seed = (seed * 31 + ch.charCodeAt(0)) >>> 0
  }
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return (seed >>> 0) / 4294967296
  }

  // Filter + deterministically-order the pool by meter id
  const eligible = REAL_METERS_POOL.filter((p) => p && typeof p.load === 'number' && p.load >= 4)
  const pickFrom = [...eligible].sort((a, b) => {
    const ka = (a.m || '') + ''
    const kb = (b.m || '') + ''
    return ka.localeCompare(kb)
  })

  const picked: ExcessDemandConsumer[] = []
  for (let i = 0; i < pickFrom.length && picked.length < targetCount; i++) {
    const m = pickFrom[i]
    if (!m.name || m.name === '-' || m.name.length < 3) continue
    const excessPct = 10 + Math.floor(rand() * 70) // 10..79
    const sanctioned = m.load
    const peak = +(sanctioned * (1 + excessPct / 100)).toFixed(1)
    const excessKW = +(peak - sanctioned).toFixed(1)
    const surcharge = Math.round(excessKW * 120)
    const r = rand()
    const status: ExcessDemandConsumer['status'] =
      r < 0.25 ? 'Notice issued' : r < 0.40 ? 'Recovered' : 'Pending'
    picked.push({
      meter: m.m,
      name: m.name,
      activity: m.act || '—',
      tariff: (m.tariff || '—') + '',
      sanctioned,
      peak,
      excessKW,
      excessPct,
      surcharge,
      status,
      dt: '—',
    })
  }

  picked.sort((a, b) => b.excessPct - a.excessPct)
  return picked
}

/** Aggregate stats for the section header. */
export function computeExcessDemandStats(list: ExcessDemandConsumer[]) {
  return {
    totalSurcharge: list.reduce((s, e) => s + e.surcharge, 0),
    noticeIssued: list.filter((e) => e.status === 'Notice issued').length,
    recovered: list.filter((e) => e.status === 'Recovered').length,
    pending: list.filter((e) => e.status === 'Pending').length,
  }
}
