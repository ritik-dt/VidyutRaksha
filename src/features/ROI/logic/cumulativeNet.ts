// ── Cumulative-net computation (pure) ────────────────────────────────────────
// Byte-identical port of the prototype's inline reduce in Section 3:
//   const cum = arr.slice(0,i+1).reduce((a,x)=>a+x.net,0);
//   width = (cum/maxCum*100).toFixed(0)%
// Each row's cumulative net is the running sum of net values up to and including
// that row; the bar width is that cumulative value as a % of the fixed ceiling.

import type { CumulativeNetRow } from '../types'

export interface CumulativeNetComputed {
  year: string
  /** running cumulative net up to and including this row. */
  cum: number
  /** bar width percent (0-100, integer string) against the ceiling. */
  widthPct: string
  /** formatted "₹X,XXX Cr" label (en-IN grouping, matches prototype). */
  label: string
}

/** Compute cumulative net + bar widths for the 5-year chart. */
export function computeCumulativeNet(
  rows: CumulativeNetRow[],
  maxCum: number,
): CumulativeNetComputed[] {
  return rows.map((_row, i) => {
    const cum = rows.slice(0, i + 1).reduce((a, x) => a + x.net, 0)
    return {
      year: rows[i].year,
      cum,
      widthPct: ((cum / maxCum) * 100).toFixed(0),
      label: `₹${cum.toLocaleString('en-IN')} Cr`,
    }
  })
}
