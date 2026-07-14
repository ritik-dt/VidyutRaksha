import type { UserKpi, UsersFilter } from '../types'

interface UsersKpiRowProps {
  kpis: UserKpi[]
  onFilter: (filter: UsersFilter) => void
}

/** 5 KPI cards. The two with a `filter` are clickable — the prototype wires
 *  them via kpiClick('users', …), which targets this same screen. */
export function UsersKpiRow({ kpis, onFilter }: UsersKpiRowProps) {
  return (
    <div className="kpi-row">
      {kpis.map((k) => {
        const clickable = k.filter !== undefined
        return (
          <div
            key={k.id}
            className={`kpi-card${clickable ? ' clickable' : ''}`}
            onClick={clickable ? () => onFilter(k.filter as UsersFilter) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
          >
            <div className="kpi-accent" style={{ background: k.accent }} />
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={k.valueColor ? { color: k.valueColor } : undefined}>
              {k.value}
            </div>
            {k.sub && <div className="kpi-sub">{k.sub}</div>}
          </div>
        )
      })}
    </div>
  )
}
