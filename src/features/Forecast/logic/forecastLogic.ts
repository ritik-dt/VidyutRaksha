// ── Forecast logic (Layer 2) ─────────────────────────────────────────────────
// Pure functions on plain data. No React, no DOM, no side effects.

import { HORIZON_DATA } from '../data/forecast'
import type { ForecastHorizon, ForecastKpi, HorizonData } from '../types'

/** Resolve the horizon's KPI/insight/table values. */
export function getHorizonData(horizon: ForecastHorizon): HorizonData {
  return HORIZON_DATA[horizon]
}

/**
 * Build the 5 KPI cards from the active horizon. Mirrors the prototype's KPI row
 * order: Projected AT&C · DTs at risk (clickable) · Seasonal spike · Revenue · Confidence.
 */
export function buildKpis(hd: HorizonData): ForecastKpi[] {
  return [
    { key: 'atc', label: hd.atcLabel, value: hd.atc, sub: hd.atcSub, accent: 'var(--green)', valueColor: 'var(--green)' },
    { key: 'dtRisk', label: 'DTs at risk', value: String(hd.dtRisk), sub: hd.dtRiskSub, accent: 'var(--red)', valueColor: 'var(--red)', clickFilter: 'atrisk' },
    { key: 'seasonal', label: 'Seasonal spike', value: 'May-Jul', sub: '+18% theft expected', accent: 'var(--amber)' },
    { key: 'rev', label: 'Revenue forecast', value: hd.rev, sub: hd.revSub, accent: 'var(--teal)' },
    { key: 'confidence', label: 'Confidence', value: '87%', sub: 'Model accuracy', accent: 'var(--ai-purple)' },
  ]
}
