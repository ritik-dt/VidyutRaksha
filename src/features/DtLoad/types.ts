/** A distribution transformer for the Load Management page. */
export interface DT {
  id: string
  name: string
  feeder: string
  capacity: number
  currentLoad: number
  peakLoad: number
  projectedLoad90: number
  consumers: number
  loss: number
  phaseImbalance: number
  age: number
  health: 'critical' | 'warning' | 'healthy'
  outagesYr: number
  note: string
  status?: string
}

/** Aggregated stats used by the KPI strip + AI insight. */
export interface DtStats {
  total: number
  atCapacity: number
  projOverload: number
  criticalLoss: number
  totalConsumers: number
  avgLoss: number
  overloaded: number
  nearOverload: number
  optimalDts: number
  optimalPct: number
  underUtilised: number
}

/** Health-band bucketed views of the DT list. */
export interface DtBuckets {
  overloaded: DT[]
  nearOverload: DT[]
  optimal: DT[]
  underUtilised: DT[]
  sortedAll: DT[]
}

/** Filter keys — mirrors prototype's `getActiveFilter('dtload')`. */
export type DtLoadFilter = null | 'dt-atcapacity' | 'dt-overload' | 'dt-loss'
