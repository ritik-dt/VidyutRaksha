// ── Daily-theft report metrics (pure) ────────────────────────────────────────
// Byte-identical port of the two dynamic sections in the prototype's
// 'rep-daily-theft' report def. The prototype derives these from
// hierData['uppcl'] (state-level — it does NOT use the active scope), enriching
// the node first. Keeping this computed (rather than freezing constants) is what
// makes the report API-ready: swap the hierarchy source and the numbers follow.

import { hierData } from '@/shared/utils/hierarchy'
import { enrichLevel } from '@/shared/utils/level'

export interface DailyTheftMetrics {
  newCriticals: number
  closedYesterday: number
  /** formatted recovery, e.g. "₹10.48 Cr" */
  recoveredDisp: string
  confHighCount: number
  /** aggregate exposure in Cr, 2dp, e.g. "7.02" */
  aggExposureCr: string
}

/** Format an absolute rupee figure the way the prototype does. */
function formatRecovered(v: number): string {
  if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)} Cr`
  if (v >= 100_000) return `₹${(v / 100_000).toFixed(0)}L`
  return `₹${v}`
}

export function computeDailyTheftMetrics(): DailyTheftMetrics {
  const lvl = enrichLevel(hierData['uppcl'])

  const newCriticals = Math.max(1, Math.round((lvl.critical ?? 0) * 0.024))
  const closedYesterday =
    lvl.closedYesterday != null
      ? lvl.closedYesterday
      : Math.max(0, Math.round((lvl.confirmed ?? 0) * 0.014))
  // 252 working days
  const recoveredYesterday = Math.max(0, Math.round((lvl.realized ?? 0) / 252))
  const confHighCount = Math.round(newCriticals * 0.66)
  // avg ₹6L per case × top critical count
  const aggExposureCr = ((newCriticals * 600_000) / 10_000_000).toFixed(2)

  return {
    newCriticals,
    closedYesterday,
    recoveredDisp: formatRecovered(recoveredYesterday),
    confHighCount,
    aggExposureCr,
  }
}
