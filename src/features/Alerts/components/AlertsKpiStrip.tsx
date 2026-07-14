import type { AlertFilter, AlertStats } from '../types'

interface AlertsKpiStripProps {
  stats: AlertStats
  onFilter: (filter: AlertFilter) => void
}

/** 4 triage KPIs — exact port of the prototype (Critical/Warning/Info/Unacknowledged). */
export function AlertsKpiStrip({ stats, onFilter }: AlertsKpiStripProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card clickable" onClick={() => onFilter({ severity: 'Critical' })}>
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Critical</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{stats.totalCritical}</div>
        <div className="kpi-sub">Needs immediate action</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ severity: 'Warning' })}>
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Warning</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{stats.totalWarning}</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ severity: 'Info' })}>
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">Info</div>
        <div className="kpi-value">{stats.totalInfo}</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ status: 'Unacknowledged' })}>
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">Unacknowledged</div>
        <div className="kpi-value">{stats.totalUnacked}</div>
        <div className="kpi-sub">No officer touched yet</div>
      </div>
    </div>
  )
}
