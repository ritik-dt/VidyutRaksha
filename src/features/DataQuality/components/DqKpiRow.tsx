import type { DqFilterId, DqKpi } from '../types'

interface DqKpiRowProps {
  kpis: DqKpi[]
  onFilter: (f: DqFilterId) => void
}

/** 5 KPI cards; Stopped + Intermittent are clickable and set a filter. */
export function DqKpiRow({ kpis, onFilter }: DqKpiRowProps) {
  return (
    <div className="kpi-row">
      {kpis.map((k) => {
        const clickable = k.filter !== undefined
        return (
          <div
            key={k.id}
            className={`kpi-card${clickable ? ' clickable' : ''}`}
            onClick={clickable ? () => onFilter(k.filter as DqFilterId) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
          >
            <div className="kpi-accent" style={{ background: k.accent }} />
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={k.valueColor ? { color: k.valueColor } : undefined}>
              {k.value}
            </div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        )
      })}
    </div>
  )
}
