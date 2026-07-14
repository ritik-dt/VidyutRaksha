import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import type { ClusterFilter, ClusterStats } from '../types'

interface ClustersKpiStripProps {
  stats: ClusterStats
  isStateLevel: boolean
  scopeName: string
  onFilter: (filter: ClusterFilter) => void
}

/** 5 coordinated-theft KPIs — exact port of the prototype. */
export function ClustersKpiStrip({ stats, isStateLevel, scopeName, onFilter }: ClustersKpiStripProps) {
  const hasGroups = stats.totalGroups > 0

  return (
    <div className="kpi-row">
      <div className="kpi-card clickable" onClick={() => onFilter({ status: 'active' })}>
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">
          Active cases
          <ChartInfoButton chartId="ctc-active-groups" />
        </div>
        <div className="kpi-value" style={{ color: hasGroups ? 'var(--red)' : 'var(--text-dim)' }}>
          {stats.totalGroups}
        </div>
        <div className="kpi-sub">
          {stats.totalConsumers} consumers{isStateLevel ? '' : ` at ${scopeName}`}
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">
          Est. revenue exposure
          <ChartInfoButton chartId="ctc-revenue-exposure" />
        </div>
        <div className="kpi-value" style={{ color: hasGroups ? 'var(--text)' : 'var(--text-dim)' }}>
          {stats.totalExposureStr}
        </div>
        <div className="kpi-sub">If all confirmed</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">
          Confirmed members
          <ChartInfoButton chartId="ctc-confirmed" />
        </div>
        <div className="kpi-value">{stats.totalConfirmed}</div>
        <div className="kpi-sub">of {stats.totalConsumers}</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ status: 'pending' })}>
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #64748b)' }} />
        <div className="kpi-label">
          Pending inspection
          <ChartInfoButton chartId="ctc-pending" />
        </div>
        <div className="kpi-value">{stats.totalPending}</div>
        <div className="kpi-sub">Awaiting field visit</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">
          Largest case
          <ChartInfoButton chartId="ctc-largest" />
        </div>
        <div className="kpi-value">{stats.largestGroup}</div>
        <div className="kpi-sub">{stats.largestGroup > 0 ? 'consumers · priority raid' : '—'}</div>
      </div>
    </div>
  )
}
