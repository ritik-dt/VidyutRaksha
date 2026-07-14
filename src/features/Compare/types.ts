export type CompareTabId = 'peer' | 'yoy' | 'ba' | 'pct' | 'pareto' | 'whatif'

export type PeerScopeId = 'feeders' | 'dtrs' | 'divisions' | 'circles' | 'discoms'

export interface PeerFeeder {
  id: string
  name: string
  meters: number
  flagged: number
  flagRatePct: string
  hitRatePct: number
  atcLossPct: number
  saidiHrs: number
  recoveredKwh: number
  color: string        // matches prototype's peerLossChart colors
}

export interface WaterfallComponent {
  label: string
  /** value = absolute for start/end bars; delta = relative for add bars. */
  value?: number
  delta?: number
  type: 'start' | 'add' | 'end'
  color: string
  detail?: string
}
