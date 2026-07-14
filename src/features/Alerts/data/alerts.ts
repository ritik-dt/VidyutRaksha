import type {
  AlertCategory,
  AlertCategoryId,
  AlertFilter,
  AlertItem,
  AlertStats,
} from '../types'

/**
 * Mock alert feed — mirrors the prototype's alertsData exactly.
 * API-ready: swap this array (and keep the shape) for a live feed later.
 */
export const ALERTS_DATA: AlertItem[] = [
  { id: 'A-2098', sev: 'Critical', time: '2 min ago', ageMin: 2, acked: false, entity: 'DT-0445', msg: 'DT loading exceeded 94% — potential transformer failure risk', rule: 'DT overload', action: 'Create case', cat: 'dt' },
  { id: 'A-2097', sev: 'Critical', time: '18 min ago', ageMin: 18, acked: false, entity: 'Feeder Bhelupur', msg: '12 meters showed synchronized zero consumption — organized theft pattern', rule: 'Cluster detection', action: 'Investigate', cat: 'feeder' },
  { id: 'A-2096', sev: 'Warning', time: '42 min ago', ageMin: 42, acked: false, entity: 'Meter #1849966', msg: 'Risk score crossed threshold (88 → from 72)', rule: 'Risk escalation', action: 'Assign inspector', cat: 'meter' },
  { id: 'A-2095', sev: 'Warning', time: '1h ago', ageMin: 60, acked: true, entity: 'DTR Vijaya Complex', msg: 'AT&C loss increased by 3.2pp this week — above alert threshold', rule: 'Loss spike', action: 'View analytics', cat: 'dt' },
  { id: 'A-2094', sev: 'Critical', time: '2h ago', ageMin: 120, acked: true, entity: 'Feeder Rathayatra', msg: 'SAIDI jumped from 14.2 to 22.8 hrs — reliability degradation', rule: 'SAIDI threshold', action: 'View reliability', cat: 'feeder' },
  { id: 'A-2093', sev: 'Info', time: '3h ago', ageMin: 180, acked: false, entity: 'MRI ingestion', msg: '851 new suspicious meters detected in nightly batch', rule: 'Batch summary', action: 'Review batch', cat: 'system' },
  { id: 'A-2092', sev: 'Warning', time: '5h ago', ageMin: 300, acked: false, entity: '8,420 meters', msg: 'Meters in Raghunath Nagar stopped reporting — communication issue', rule: 'Comm failure', action: 'Dispatch team', cat: 'meter' },
  { id: 'A-2091', sev: 'Info', time: 'Yesterday', ageMin: 1440, acked: true, entity: 'Model v2.5', msg: 'Model retrained overnight — false positives reduced by 8%', rule: 'Model update', action: 'View metrics', cat: 'system' },
]

/** Category tabs — order drives the tab order (matches prototype). */
export const ALERT_CATEGORIES: AlertCategory[] = [
  { id: 'all', label: 'All alerts', icon: '🔔' },
  { id: 'meter', label: 'Meter', icon: '🔌' },
  { id: 'dt', label: 'DT / transformer', icon: '⚡' },
  { id: 'feeder', label: 'Feeder / network', icon: '🔋' },
  { id: 'system', label: 'System', icon: '📊' },
]

export function getSevColor(sev: string): string {
  return sev === 'Critical' ? 'var(--red)' : sev === 'Warning' ? 'var(--amber)' : 'var(--teal, #17a2b8)'
}

export function getSevBg(sev: string): string {
  return sev === 'Critical'
    ? 'rgba(220,53,69,.1)'
    : sev === 'Warning'
      ? 'rgba(230,146,30,.1)'
      : 'rgba(23,162,184,.1)'
}

export function getCatCount(alerts: AlertItem[], catId: AlertCategoryId): number {
  return catId === 'all' ? alerts.length : alerts.filter((a) => a.cat === catId).length
}

export function computeAlertStats(
  alerts: AlertItem[],
  ackedMap: Record<string, boolean>,
): AlertStats {
  return {
    totalCritical: alerts.filter((a) => a.sev === 'Critical').length,
    totalWarning: alerts.filter((a) => a.sev === 'Warning').length,
    totalInfo: alerts.filter((a) => a.sev === 'Info').length,
    totalUnacked: alerts.filter((a) => !ackedMap[a.id]).length,
    totalStale: alerts.filter((a) => !ackedMap[a.id] && a.ageMin >= 60).length,
  }
}

/** Category + active-filter (severity/status) filtering — matches the prototype. */
export function filterAlerts(
  alerts: AlertItem[],
  activeCat: AlertCategoryId,
  filter: AlertFilter,
  ackedMap: Record<string, boolean>,
): AlertItem[] {
  let out = alerts
  if (activeCat !== 'all') out = out.filter((a) => a.cat === activeCat)
  if (filter.severity) out = out.filter((a) => a.sev === filter.severity)
  if (filter.status === 'Unacknowledged') out = out.filter((a) => !ackedMap[a.id])
  return out
}
