import type { AlertCategory } from '../types'

/** The 5 configurable alert categories. */
export const ALERT_CATEGORIES: AlertCategory[] = [
  { id: 'high-risk',  label: 'High-risk meter detected', icon: '⚠️', desc: 'New meter crosses risk score 80' },
  { id: 'sla-breach', label: 'Case SLA breach',          icon: '⏰', desc: 'Case approaches or exceeds SLA' },
  { id: 'overload',   label: 'DT overload',              icon: '⚡', desc: 'DT loading exceeds 85%' },
  { id: 'approval',   label: 'Approval pending',         icon: '📋', desc: 'Assessment awaits your approval' },
  { id: 'kpi-alert',  label: 'KPI threshold breach',     icon: '📊', desc: 'Loss/hit-rate crosses target' },
]
