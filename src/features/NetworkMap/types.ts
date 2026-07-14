import type { RealMeter } from './data/realMetersPool'

/** A feeder on the network map (with lat/lng + ancestor references). */
export interface Feeder {
  id: string
  name?: string
  lat: number
  lng: number
  area: string
  discom: string
  zone: string
  circle: string | null
  division: string | null
  subdivision: string | null
  _synthetic?: boolean
}

/** A distribution transformer (DT/DTR) on the map. */
export interface DT {
  id: string
  feeder: string
  lat: number
  lng: number
  loss: number
  load: number
  meters: number
  flagged: number
  critical: number
  area: string
  _synthetic?: boolean
}

/** Aggregated per-feeder metrics computed from its DTs. */
export interface EnrichedFeeder extends Feeder {
  loss: number
  meters: number
  consumers: number
  flagged: number
  critical: number
  dtCount: number
}

/** Synthetic consumer generated deterministically per DT. */
export interface MapConsumer {
  id: string
  dt: string
  feeder: string
  cat: 'Domestic' | 'Commercial' | 'Industrial' | 'Agricultural'
  risk: number
  drop: number
  events: number
  kwh: number
  isTheft: boolean
  isCritical: boolean
  lat: number
  lng: number
  theftType: string | null
  sl: string
  isReal?: boolean
  // Real-meter-specific fields (present only when isReal === true)
  name?: string
  activity?: string
  tariff?: string
  zone?: string
  account?: string
  /** Full underlying RealMeter row — used by ConsumerDetail for zero_pct / pf / avg_kwh_d. */
  _ref?: RealMeter
}

/** Currently-open detail entity chain: feeder → dt → consumer. */
export interface NavContext {
  feeder: Feeder | null
  dt: DT | null
  consumer: MapConsumer | null
}

/** Layer toggle identifiers — one per prototype control. */
export type MapLayerId = 'feeders' | 'dts' | 'consumers' | 'real' | 'lines' | 'heat'

/** Boolean state of every toggle. */
export type LayerVisibility = Record<MapLayerId, boolean>

/** Header actions for KPI cards, computed once per scope. */
export interface NetworkMapKpis {
  hotspotsCount: number
  topFeeder: EnrichedFeeder | undefined
  underBillingCount: number
  confirmedTheft: number
  dtsCoverage: number
}
