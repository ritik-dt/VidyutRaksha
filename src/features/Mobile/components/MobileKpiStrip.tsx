import type { MobileStats } from '../types'

interface MobileKpiStripProps {
  stats: MobileStats
}

/** 5-KPI strip — exact port (Inspectors / Pending / Synced / Offline / Adoption). */
export function MobileKpiStrip({ stats }: MobileKpiStripProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #64748b)' }} />
        <div className="kpi-label">Inspectors in field</div>
        <div className="kpi-value">{stats.inspectorsInField}</div>
        <div className="kpi-sub">Live GPS tracked</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Pending inspections</div>
        <div className="kpi-value">{stats.pendingInspections}</div>
        <div className="kpi-sub">Today's schedule</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Synced today</div>
        <div className="kpi-value">{stats.syncedPhotosToday} photos</div>
        <div className="kpi-sub">{stats.syncedSignaturesToday} signatures</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Offline queue</div>
        <div className="kpi-value">{stats.offlineQueue}</div>
        <div className="kpi-sub">Awaiting sync</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">App adoption</div>
        <div className="kpi-value">{stats.appAdoptionPct}%</div>
        <div className="kpi-sub">
          {stats.activeInspectorCount} of {stats.totalInspectorCount} active
        </div>
      </div>
    </div>
  )
}
