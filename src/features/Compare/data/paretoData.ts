export interface ParetoItem {
  name: string
  loss: number    // DTR loss %
  share: number   // % of feeder loss
}

export interface ParetoEnriched extends ParetoItem {
  cumulative: number
  isVital: boolean
}

/** 12 DTR items in Rathayatra Feeder — exact port from renderParetoTab. */
export const PARETO_ITEMS: ParetoItem[] = [
  { name: 'Shivpur Colony DTR',     loss: 18.2, share: 24.5 },
  { name: 'Police Line DTR',        loss: 14.8, share: 19.9 },
  { name: 'Adampur DTR',            loss: 11.2, share: 15.0 },
  { name: 'Gandhi Nagar DTR',       loss:  7.6, share: 10.2 },
  { name: 'Kashmir Mohalla DTR',    loss:  5.4, share:  7.3 },
  { name: 'Awas Vikas DTR',         loss:  3.8, share:  5.1 },
  { name: 'Dhupchandi DTR',         loss:  2.9, share:  3.9 },
  { name: 'Madanpura DTR',          loss:  2.1, share:  2.8 },
  { name: 'Sanskrit Vidyalaya DTR', loss:  1.6, share:  2.2 },
  { name: 'Ramghat DTR',            loss:  1.2, share:  1.6 },
  { name: 'Baradeo DTR',            loss:  0.9, share:  1.2 },
  { name: 'Other 16 DTRs',          loss:  4.7, share:  6.3 },
]

/** Total DTRs represented by the last "Other 16 DTRs" row — same as prototype (27). */
export const TOTAL_DTRS = 27

/** Compute cumulative + vital-few flag using the 80% Pareto rule (matches prototype). */
export function enrichPareto(items: ParetoItem[]): {
  enriched: ParetoEnriched[]
  vitalCount: number
  vitalShare: number
  top3Total: number
} {
  let cum = 0
  const withCum = items.map((i) => {
    cum += i.share
    return { ...i, cumulative: cum, isVital: false }
  })
  const cutoffIdx = withCum.findIndex((i) => i.cumulative >= 80)
  const vitalCount = cutoffIdx + 1
  const vitalShare = withCum[cutoffIdx].cumulative
  const enriched = withCum.map((r, i) => ({ ...r, isVital: i < vitalCount }))
  const top3Total = enriched.slice(0, 3).reduce((s, i) => s + i.share, 0)
  return { enriched, vitalCount, vitalShare, top3Total }
}

/** Feeder selector options (prototype shows a select on the card title). */
export const PARETO_FEEDER_OPTIONS = [
  'Rathayatra Feeder (current)',
  'Raghunath Nagar Feeder',
  'Chauk Feeder',
  'Bhelupur Feeder',
  'Whole zone (all DTRs)',
]
