import type { PeerFeeder, PeerScopeId, WaterfallComponent } from '../types'

/** Prototype-exact peer feeder set (default selected chips). */
export const DEFAULT_PEER_FEEDERS: PeerFeeder[] = [
  { id: 'rathayatra', name: 'Rathayatra', meters: 32400, flagged: 1820, flagRatePct: '5.62%', hitRatePct: 52, atcLossPct: 24.8, saidiHrs: 22.8, recoveredKwh: 482000, color: '#DC3545' },
  { id: 'raghunath',  name: 'Raghunath',  meters: 28600, flagged: 1540, flagRatePct: '5.38%', hitRatePct: 55, atcLossPct: 22.3, saidiHrs: 20.4, recoveredKwh: 396000, color: '#E6921E' },
  { id: 'chauk',      name: 'Chauk',      meters: 24800, flagged: 980,  flagRatePct: '3.95%', hitRatePct: 61, atcLossPct: 19.6, saidiHrs: 18.4, recoveredKwh: 324000, color: '#17A2B8' },
  { id: 'bhelupur',   name: 'Bhelupur',   meters: 22100, flagged: 720,  flagRatePct: '3.26%', hitRatePct: 64, atcLossPct: 18.2, saidiHrs: 14.2, recoveredKwh: 226000, color: '#28A745' },
]

/** Options for the scope select. */
export const PEER_SCOPE_OPTIONS: Array<{ id: PeerScopeId; label: string }> = [
  { id: 'feeders',   label: 'Feeders'   },
  { id: 'dtrs',      label: 'DTRs'      },
  { id: 'divisions', label: 'Divisions' },
  { id: 'circles',   label: 'Circles'   },
  { id: 'discoms',   label: 'DISCOMs'   },
]

/** Variance decomposition waterfall — exact port of prototype's 5 components. */
export const VARIANCE_WATERFALL: WaterfallComponent[] = [
  { label: 'Bhelupur baseline',       value: 18.2, type: 'start', color: '#28A745' },
  { label: 'Technical loss gap',      delta:  1.2, type: 'add',   color: '#17A2B8', detail: 'Older feeders, copper cable losses, transformer no-load losses' },
  { label: 'Commercial loss gap',     delta:  4.8, type: 'add',   color: '#DC3545', detail: 'Theft (earth loading, bypass), unbilled meters, tampered CTs' },
  { label: 'Collection efficiency gap', delta: 0.6, type: 'add',  color: '#E6921E', detail: 'Outstanding bills, write-offs, slower payment cycles' },
  { label: 'Rathayatra actual',       value: 24.8, type: 'end',   color: '#DC3545' },
]

/** Scoped label — "4 feeders in Varanasi Zone" derived from selection. */
export function peerContextLabel(feeders: PeerFeeder[], scopeName: string): string {
  const count = feeders.length
  const scope = scopeName || 'Varanasi Zone'
  const unit = count === 1 ? 'feeder' : 'feeders'
  return `${count} ${unit} in ${scope}`
}

/** Total recovered energy across the selected peers (used in AI banner). */
export function totalRecoveredKwh(feeders: PeerFeeder[]): number {
  return feeders.reduce((s, f) => s + f.recoveredKwh, 0)
}
