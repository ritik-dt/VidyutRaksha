/** Prototype's percentile-badge classes → semantic color keys. */
export type PercentileBadge = 'ai' | 'assigned' | 'new' | 'confirmed'

export interface PercentileRow {
  rank: number
  medal?: '🥇' | '🥈' | '🥉'
  rankColor?: 'green' | 'red'
  feeder: string
  atcLossPct: number
  lossColor: 'green' | 'amber' | 'red'
  percentile: number
  percentileBadge: PercentileBadge
  vsMedianPp: string        // e.g. "-3.6pp", "median"
  vsMedianColor: 'green' | 'red' | 'dim'
  vsTopPp: string           // e.g. "baseline", "+0.8pp"
  vsTopColor: 'green' | 'amber' | 'red' | 'dim'
  action: string
  actionColor?: 'green' | 'amber' | 'red'
  rowTint?: 'green' | 'red'
}

/** 10-row ranking table — direct port from prototype. */
export const PERCENTILE_ROWS: PercentileRow[] = [
  { rank: 1,  medal: '🥇', rankColor: 'green', feeder: 'Central Jail',   atcLossPct: 16.4, lossColor: 'green', percentile: 90, percentileBadge: 'ai',        vsMedianPp: '-3.6pp',  vsMedianColor: 'green', vsTopPp: 'baseline', vsTopColor: 'dim',   action: 'Share best practices', actionColor: 'green', rowTint: 'green' },
  { rank: 2,  medal: '🥈', rankColor: 'green', feeder: 'Kerakatpur',      atcLossPct: 17.2, lossColor: 'green', percentile: 80, percentileBadge: 'ai',        vsMedianPp: '-2.8pp',  vsMedianColor: 'green', vsTopPp: '+0.8pp',   vsTopColor: 'amber', action: 'Maintain trajectory' },
  { rank: 3,  medal: '🥉', rankColor: 'green', feeder: 'Bhelupur',        atcLossPct: 18.2, lossColor: 'green', percentile: 70, percentileBadge: 'ai',        vsMedianPp: '-1.8pp',  vsMedianColor: 'green', vsTopPp: '+1.8pp',   vsTopColor: 'amber', action: 'Continue' },
  { rank: 4,                                    feeder: 'Ganesh Pur',      atcLossPct: 19.0, lossColor: 'amber', percentile: 60, percentileBadge: 'ai',        vsMedianPp: '-1.0pp',  vsMedianColor: 'green', vsTopPp: '+2.6pp',   vsTopColor: 'amber', action: 'Continue' },
  { rank: 5,                                    feeder: 'Ramarepur',       atcLossPct: 19.8, lossColor: 'amber', percentile: 50, percentileBadge: 'assigned',  vsMedianPp: 'median', vsMedianColor: 'dim',   vsTopPp: '+3.4pp',   vsTopColor: 'amber', action: 'Baseline' },
  { rank: 6,                                    feeder: 'Chauk',           atcLossPct: 19.6, lossColor: 'amber', percentile: 40, percentileBadge: 'assigned',  vsMedianPp: '+0.2pp',  vsMedianColor: 'red',   vsTopPp: '+3.2pp',   vsTopColor: 'red',   action: 'Monitor' },
  { rank: 7,                                    feeder: 'Shaktipeeth',     atcLossPct: 20.2, lossColor: 'amber', percentile: 30, percentileBadge: 'assigned',  vsMedianPp: '+0.4pp',  vsMedianColor: 'red',   vsTopPp: '+3.8pp',   vsTopColor: 'red',   action: 'Review' },
  { rank: 8,                                    feeder: 'Kabir Nagar',     atcLossPct: 21.2, lossColor: 'red',   percentile: 20, percentileBadge: 'new',       vsMedianPp: '+1.4pp',  vsMedianColor: 'red',   vsTopPp: '+4.8pp',   vsTopColor: 'red',   action: 'Intervention needed', actionColor: 'amber' },
  { rank: 9,                    rankColor: 'red', feeder: 'Raghunath Nagar', atcLossPct: 22.3, lossColor: 'red',   percentile: 10, percentileBadge: 'confirmed', vsMedianPp: '+2.5pp',  vsMedianColor: 'red',   vsTopPp: '+5.9pp',   vsTopColor: 'red',   action: 'Urgent intervention', actionColor: 'red' },
  { rank: 10,                   rankColor: 'red', feeder: 'Rathayatra',      atcLossPct: 24.8, lossColor: 'red',   percentile: 0,  percentileBadge: 'confirmed', vsMedianPp: '+5.0pp',  vsMedianColor: 'red',   vsTopPp: '+8.4pp',   vsTopColor: 'red',   action: 'Critical — task force', actionColor: 'red', rowTint: 'red' },
]

/** Chart data — bar order matches the pctData array in the prototype (rank order minus prototype's typo). */
export const PERCENTILE_CHART_ROWS: Array<{ feeder: string; atcLossPct: number; percentile: number }> = [
  { feeder: 'Central Jail',    atcLossPct: 16.4, percentile: 90 },
  { feeder: 'Kerakatpur',      atcLossPct: 17.2, percentile: 80 },
  { feeder: 'Bhelupur',        atcLossPct: 18.2, percentile: 70 },
  { feeder: 'Ganesh Pur',      atcLossPct: 19.0, percentile: 60 },
  { feeder: 'Ramarepur',       atcLossPct: 19.8, percentile: 50 },
  { feeder: 'Chauk',           atcLossPct: 19.6, percentile: 40 },
  { feeder: 'Shaktipeeth',     atcLossPct: 20.2, percentile: 30 },
  { feeder: 'Kabir Nagar',     atcLossPct: 21.2, percentile: 20 },
  { feeder: 'Raghunath',       atcLossPct: 22.3, percentile: 10 },
  { feeder: 'Rathayatra',      atcLossPct: 24.8, percentile: 0  },
]

/** Zone median line value used as the horizontal dashed overlay. */
export const ZONE_MEDIAN = 19.8

/** Bar color per prototype: p≥70 green, p≥40 amber, else red. */
export function percentileBarColor(percentile: number): string {
  if (percentile >= 70) return '#28A745'
  if (percentile >= 40) return '#E6921E'
  return '#DC3545'
}
