import type { HierNode } from '@/shared/types/hierarchy'
import type { AuditKpis } from '../types'
import { DT_DATA } from './dtData'
import { SAIDI_DATA } from './reliability'

/** Total feeder count used in KPI subs — from prototype's saidiData.length. */
export const TOTAL_FEEDERS = SAIDI_DATA.length

/**
 * Scope-aware Energy Audit KPI computation — port of the prototype's inline
 * calculation. Feeder/DT loss are derived from the node's overall loss;
 * top/worst counts pivot on SAIDI_DATA per prototype (filters saidi <12 / >18);
 * DT counts pivot on DT_DATA (filters loss >22 / <12).
 */
export function computeAuditKpis(level: HierNode | undefined): AuditKpis {
  const feederLossPct = level?.loss ? Math.max(2, level.loss - 12).toFixed(1) : '8.4'
  const dtLossPct = level?.loss ? Math.max(2, level.loss - 14).toFixed(1) : '6.2'
  const topFeederCount = SAIDI_DATA.filter((f) => f.saidi < 12).length
  const worstFeederCount = SAIDI_DATA.filter((f) => f.saidi > 18).length
  const worstDtCount = DT_DATA.filter((d) => d.loss > 22).length
  const outstandingCr = level?.meters ? Math.round((level.meters * 0.0012) / 100) : 18
  const theftPctOfLoss = level?.loss ? Math.round((level.loss - 8.2) * 0.6) : 7

  return {
    feederLossPct,
    dtLossPct,
    collectionEffPct: '88.4',
    billingEffPct: '94.2',
    topFeederCount,
    worstFeederCount,
    worstDtCount,
    outstandingCr,
    theftPctOfLoss,
  }
}

/** AT&C waterfall — 7 bars, exact prototype values + colors. */
export const WATERFALL_DATA = {
  labels: ['Energy input', 'Technical loss', 'Commercial loss', 'Energy billed', 'Unbilled', 'Collection gap', 'Revenue collected'],
  values: [100, -8.2, -12.3, 79.5, -4.6, -8.8, 66.1],
  colors: ['#1B4F72', '#17A2B8', '#DC3545', '#28A745', '#E6921E', '#8B95A5', '#7C3AED'],
}

/** Loss split — 4 bars. */
export const LOSS_SPLIT_DATA = {
  labels: ['Technical (line + DT)', 'Theft (AI-detected)', 'Billing gaps', 'Collection gap'],
  values: [8.2, 7.0, 3.1, 2.2],
  colors: ['#17A2B8', '#DC3545', '#E6921E', '#8B95A5'],
}

/** Colored loss-split stat tiles under the chart (matches prototype pattern). */
export const LOSS_SPLIT_STATS = [
  { label: 'Technical (line + DT)', value: '8.2%', color: 'var(--teal, #17a2b8)' },
  { label: 'Theft (AI-detected)',   value: '7.0%', color: 'var(--red)' },
  { label: 'Billing gaps',          value: '3.1%', color: 'var(--amber)' },
  { label: 'Collection gap',        value: '2.2%', color: 'var(--text-dim)' },
]

/** Loading color helper — matches the prototype's `ldc(load)` function. */
export function loadingColor(load: number): string {
  if (load >= 90) return 'var(--red)'
  if (load >= 75) return 'var(--amber)'
  if (load >= 60) return 'var(--green)'
  return 'var(--teal, #17a2b8)'
}

/** Loss-% color — matches prototype's `lc(loss)`. */
export function lossColor(loss: number): string {
  if (loss > 22) return 'var(--red)'
  if (loss > 15) return 'var(--amber)'
  return 'var(--green)'
}
