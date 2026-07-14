import type { AuditKpi, AuditKpiNav } from '../types'

interface AuditKpiRowProps {
  kpis: AuditKpi[]
  onNavigate: (nav: AuditKpiNav) => void
}

/** 5 KPI cards. The two clickable ones NAVIGATE to Cases (they don't filter
 *  Audit) — matching kpiClick('cases', {status:…}) in the prototype. */
export function AuditKpiRow({ kpis, onNavigate }: AuditKpiRowProps) {
  return (
    <div className="kpi-row">
      {kpis.map((k) => {
        const clickable = k.nav !== undefined
        return (
          <div
            key={k.id}
            className={`kpi-card${clickable ? ' clickable' : ''}`}
            onClick={clickable ? () => onNavigate(k.nav as AuditKpiNav) : undefined}
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
