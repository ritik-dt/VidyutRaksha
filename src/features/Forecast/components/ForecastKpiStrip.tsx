import type { ForecastKpi } from '../types'

interface ForecastKpiStripProps {
  kpis: ForecastKpi[]
  /** Fired by the clickable "DTs at risk" card (self-filter → atrisk pill). */
  onAtRiskClick: () => void
}

/** 5-KPI strip. Mirrors the prototype's Forecast KPI row order + colours. */
export function ForecastKpiStrip({ kpis, onAtRiskClick }: ForecastKpiStripProps) {
  return (
    <div className="kpi-row">
      {kpis.map((k) => {
        const clickable = k.clickFilter === 'atrisk'
        return (
          <div
            key={k.key}
            className={`kpi-card${clickable ? ' clickable' : ''}`}
            onClick={clickable ? onAtRiskClick : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onAtRiskClick()
                    }
                  }
                : undefined
            }
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
