export type AnalyticsTabId = 'audit' | 'reliability' | 'outage' | 'revenue' | 'pq'

export interface AuditKpis {
  feederLossPct: string
  dtLossPct: string
  collectionEffPct: string
  billingEffPct: string
  topFeederCount: number
  worstFeederCount: number
  worstDtCount: number
  outstandingCr: number
  theftPctOfLoss: number
}

export interface DtRow {
  dt: string
  cap: number
  load: number
  meters: number
  input: number
  billed: number
  loss: number
  div: string
  feeder: string
  phaseR: number
  phaseY: number
  phaseB: number
  alerts: number
}
