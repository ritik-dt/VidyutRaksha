import type { CostRow, CostTotal, CumulativeNetRow, PaybackStat } from '../types'

/** 5-year cost stack — 7 cost heads. */
export const COST_ROWS: CostRow[] = [
  { cost: 'Pilot setup (1 zone)', y1: '4.2', y2: '—', y3: '—' },
  { cost: 'Statewide rollout (5 DISCOMs)', y1: '—', y2: '18.4', y3: '—' },
  { cost: 'AI/cloud OpEx (AWS + GPU)', y1: '1.8', y2: '4.2', y3: '4.8/yr' },
  { cost: 'AMISP integration & data pipes', y1: '2.4', y2: '3.6', y3: '2.0/yr' },
  { cost: 'Mobile app + training', y1: '1.2', y2: '2.8', y3: '1.2/yr' },
  { cost: 'Vigilance team augmentation', y1: '0.8', y2: '2.4', y3: '2.4/yr' },
  { cost: 'Vendor support + SLA', y1: '1.6', y2: '2.6', y3: '3.0/yr' },
]

/** Red total row. */
export const COST_TOTAL: CostTotal = {
  label: 'Total cost',
  y1: '12.0',
  y2: '34.0',
  y3: '~13.4/yr',
}

/** Note under the cost stack. */
export const COST_NOTE =
  '<strong style="color:var(--text)">5-year total cost:</strong> ₹86 Cr (excl. RDSS-funded DT meters which are out-of-scope of this pitch but unlock optimistic-case numbers)'

/** 4 payback stat tiles. */
export const PAYBACK_STATS: PaybackStat[] = [
  {
    id: 'year1',
    label: 'Year 1 recovery',
    value: '₹185 Cr',
    sub: '25% of steady-state during pilot ramp',
    tone: 'green',
  },
  {
    id: 'steady',
    label: 'Steady-state recovery',
    value: '₹740 Cr/yr',
    sub: 'from Year 3 onwards',
    tone: 'green',
  },
  {
    id: 'payback',
    label: 'Payback period',
    value: '3.8 months',
    sub: 'from go-live · pilot self-funds rollout',
    tone: 'purple',
  },
  {
    id: 'roi-multiple',
    label: '5-year ROI multiple',
    value: '38×',
    sub: 'cumulative recovery ÷ total cost',
    tone: 'purple',
  },
]

/** 5-year cumulative-net rows (rec/cost/net per year; cum computed in logic). */
export const CUMULATIVE_NET_ROWS: CumulativeNetRow[] = [
  { year: 'Yr 1', rec: 185, cost: 12, net: 173 },
  { year: 'Yr 2', rec: 520, cost: 34, net: 486 },
  { year: 'Yr 3', rec: 740, cost: 13.4, net: 727 },
  { year: 'Yr 4', rec: 740, cost: 13.4, net: 727 },
  { year: 'Yr 5', rec: 740, cost: 13.4, net: 727 },
]

/** Hardcoded scale ceiling for the cumulative-net bars (matches prototype). */
export const CUMULATIVE_NET_MAX = 2840
