// ── useForecast (Layer 3) ────────────────────────────────────────────────────
// The sole API-integration seam for the Forecast module. Owns horizon state and
// the self-referential "DTs at risk" filter, memoises every derivation, and
// returns an API-ready shape (loading/error) so callers won't change when the
// static data pool becomes an async fetcher.

import { useCallback, useMemo, useState } from 'react'
import {
  AT_RISK_DTS,
  DT_CAPACITY_CHART,
  HORIZON_PILLS,
  LOSS_FORECAST_CHART,
  REV_FORECAST_CHART,
  SEASONAL_THEFT_CHART,
} from '../data/forecast'
import { buildKpis, getHorizonData } from '../logic/forecastLogic'
import type { ForecastHorizon } from '../types'

export function useForecast() {
  const [horizon, setHorizon] = useState<ForecastHorizon>('3m')
  // Prototype: kpiClick('forecast',{filter:'atrisk'}) navigates forecast → forecast
  // and shows the FILTERED pill. Cosmetic (the DT table is not actually filtered).
  const [atRiskFilter, setAtRiskFilter] = useState(false)

  const horizonData = useMemo(() => getHorizonData(horizon), [horizon])
  const kpis = useMemo(() => buildKpis(horizonData), [horizonData])

  const applyAtRiskFilter = useCallback(() => setAtRiskFilter(true), [])
  const clearFilter = useCallback(() => setAtRiskFilter(false), [])

  return {
    horizon,
    setHorizon,
    horizonPills: HORIZON_PILLS,
    horizonData,
    kpis,
    // chart pools (static today, fetched tomorrow)
    lossForecast: LOSS_FORECAST_CHART,
    revForecast: REV_FORECAST_CHART,
    seasonalTheft: SEASONAL_THEFT_CHART,
    dtCapacity: DT_CAPACITY_CHART,
    atRiskDts: AT_RISK_DTS,
    // self-filter
    atRiskFilter,
    applyAtRiskFilter,
    clearFilter,
    // API-ready seam
    loading: false as const,
    error: null,
  }
}
