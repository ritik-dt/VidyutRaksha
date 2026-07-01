import { fmtINR } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import type { CasesStats } from './types'

interface Props { stats: CasesStats; onChangeFilter: (f: string) => void }

export function CasesKpiStrip({ stats, onChangeFilter }: Props) {
  return (
    <div className="kpi-row">
      <div className="kpi-card clickable" onClick={() => onChangeFilter('Past SLA')} title="Cases past their due date — urgent">
        <div className="kpi-accent bg-red" />
        <div className="kpi-label">Past SLA</div>
        <div className="kpi-value text-red">{formatIndian(stats.pastSla)}</div>
        <div className="kpi-sub">{stats.active > 0 ? `${((stats.pastSla / stats.active) * 100).toFixed(1)}% of active` : 'no active cases'}</div>
      </div>
      <div className="kpi-card clickable" onClick={() => onChangeFilter('Assigned')} title="Cases assigned to inspector but not yet in progress">
        <div className="kpi-accent bg-[#0EA5E9]" />
        <div className="kpi-label">Open</div>
        <div className="kpi-value text-[#0EA5E9]">{formatIndian(stats.open)}</div>
        <div className="kpi-sub">awaiting inspection</div>
      </div>
      <div className="kpi-card clickable" onClick={() => onChangeFilter('In Progress')} title="Cases under active investigation">
        <div className="kpi-accent bg-amber" />
        <div className="kpi-label">In progress</div>
        <div className="kpi-value text-amber">{formatIndian(stats.inProgress)}</div>
        <div className="kpi-sub">includes {formatIndian(stats.escalated)} escalated</div>
      </div>
      <div className="kpi-card clickable" onClick={() => onChangeFilter('Confirmed Theft')} title="Theft confirmed — assessment generated">
        <div className="kpi-accent bg-green" />
        <div className="kpi-label">Confirmed</div>
        <div className="kpi-value text-green">{formatIndian(stats.confirmed)}</div>
        <div className="kpi-sub">cumulative this fiscal</div>
      </div>
      <div className="kpi-card" title="Average days from case creation to closure">
        <div className="kpi-accent bg-[var(--navy-light)]" />
        <div className="kpi-label">Avg time-to-close</div>
        <div className={`kpi-value ${stats.avgClose > 3.5 ? 'text-amber' : 'text-text'}`}>
          {stats.avgClose} d
        </div>
        <div className="kpi-sub">target: 3.0 d {stats.avgClose > 3 ? '⚠' : '✓'}</div>
      </div>
      <div className="kpi-card" title="Recovered amount this fiscal year">
        <div className="kpi-accent bg-ai-purple" />
        <div className="kpi-label">Recovery</div>
        <div className="kpi-value text-[18px] text-ai-purple">{fmtINR(stats.recovery)}</div>
        <div className="kpi-sub">YTD · 62% realization</div>
      </div>
    </div>
  )
}
