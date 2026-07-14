import type { AppealsFilter, AppealsStats } from '../types'

interface AppealsKpiStripProps {
  stats: AppealsStats
  onFilter: (filter: AppealsFilter) => void
}

/** 5-KPI strip — exact port (Active / Hearing this week / Resolved MTD / Upheld rate / Avg resolution). */
export function AppealsKpiStrip({ stats, onFilter }: AppealsKpiStripProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card clickable" onClick={() => onFilter({ status: 'Active' })}>
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Active appeals</div>
        <div className="kpi-value">{stats.activeAppeals}</div>
        <div className="kpi-sub">{stats.disputedAmountFmt} disputed</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ status: 'Scheduled' })}>
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #64748b)' }} />
        <div className="kpi-label">Hearing this week</div>
        <div className="kpi-value">{stats.hearingThisWeek}</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Resolved MTD</div>
        <div className="kpi-value">{stats.resolvedMtd}</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Upheld rate</div>
        <div className="kpi-value">{stats.upheldRatePct}%</div>
        <div className="kpi-sub">Theft confirmed</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">Avg resolution</div>
        <div className="kpi-value">{stats.avgResolutionDays} days</div>
      </div>
    </div>
  )
}
