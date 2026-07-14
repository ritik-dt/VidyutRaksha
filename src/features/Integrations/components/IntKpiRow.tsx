import type { IntKpi, IntStatus } from '../types'

interface IntKpiRowProps {
  kpis: IntKpi[]
  onFilter: (status?: IntStatus) => void
}

/** 5 KPI cards; the first four are clickable and drive the status filter.
 *  "Connected systems" carries filter=null, which clears it (kpiClick(…, {})). */
export function IntKpiRow({ kpis, onFilter }: IntKpiRowProps) {
  return (
    <div className="kpi-row">
      {kpis.map((k) => {
        const clickable = k.filter !== undefined
        return (
          <div
            key={k.id}
            className={`kpi-card${clickable ? ' clickable' : ''}`}
            onClick={clickable ? () => onFilter(k.filter ?? undefined) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
          >
            <div className="kpi-accent" style={{ background: k.accent }} />
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={k.valueColor ? { color: k.valueColor } : undefined}>
              {k.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
