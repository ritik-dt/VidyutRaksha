import type { TeamKpis } from '../logic/teamLogic'
import type { TeamFilter } from '../types'

interface TeamKpiStripProps {
  kpis: TeamKpis
  activeFilter: TeamFilter
  onFilterChange: (f: TeamFilter) => void
}

/**
 * 5-KPI strip. Port of the prototype's Team KPI row. "Overloaded" and
 * "Available" cards act as self-filters into the workload-distribution grid
 * (matches `kpiClick('team', {filter:'…'})` in the prototype).
 */
export function TeamKpiStrip({ kpis, activeFilter, onFilterChange }: TeamKpiStripProps) {
  const utilColor =
    kpis.utilPct < 70 ? 'var(--green)' : kpis.utilPct < 90 ? 'var(--amber)' : 'var(--red)'

  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--navy-light)' }} />
        <div className="kpi-label">Total open cases</div>
        <div className="kpi-value">{kpis.totalOpen}</div>
        <div className="kpi-sub">across {kpis.inspectorCount} inspectors</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: utilColor }} />
        <div className="kpi-label">Team capacity</div>
        <div className="kpi-value" style={{ color: utilColor }}>{kpis.utilPct}%</div>
        <div className="kpi-sub">
          {kpis.totalOpen} of {kpis.totalCap}
        </div>
      </div>

      <div
        className={`kpi-card clickable${activeFilter === 'overloaded' ? ' selected' : ''}`}
        onClick={() => onFilterChange(activeFilter === 'overloaded' ? 'all' : 'overloaded')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onFilterChange(activeFilter === 'overloaded' ? 'all' : 'overloaded')
          }
        }}
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Overloaded</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{kpis.overloaded}</div>
        <div className="kpi-sub">≥ 90% capacity</div>
      </div>

      <div
        className={`kpi-card clickable${activeFilter === 'available' ? ' selected' : ''}`}
        onClick={() => onFilterChange(activeFilter === 'available' ? 'all' : 'available')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onFilterChange(activeFilter === 'available' ? 'all' : 'available')
          }
        }}
      >
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Available</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>{kpis.underutil}</div>
        <div className="kpi-sub">&lt; 50% capacity</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Past SLA total</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{kpis.totalPastSla}</div>
        <div className="kpi-sub">across team</div>
      </div>
    </div>
  )
}
