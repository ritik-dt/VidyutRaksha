import type { DtStats } from '../types'

interface DtLoadKpiStripProps {
  stats: DtStats
  excessDemandCount: number
}

/** 4-KPI strip — Overloaded / Near-overload / Excess demand / Optimal % */
export function DtLoadKpiStrip({ stats, excessDemandCount }: DtLoadKpiStripProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="kpi-row dt-load-kpis">
      <div className="kpi-card clickable" onClick={() => scrollTo('overloaded-dts-section')}>
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Overloaded DTs</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{stats.overloaded}</div>
        <div className="kpi-sub">&gt;100% loading</div>
      </div>
      <div className="kpi-card clickable" onClick={() => scrollTo('near-overload-dts-section')}>
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Near-overload DTs</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{stats.nearOverload}</div>
        <div className="kpi-sub">85–100% loading</div>
      </div>
      <div className="kpi-card clickable" onClick={() => scrollTo('excess-demand-section')}>
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Excess demand cases</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{excessDemandCount}</div>
        <div className="kpi-sub">Load &gt; sanctioned</div>
      </div>
      <div className="kpi-card clickable" onClick={() => scrollTo('optimal-dts-section')}>
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Optimal DTs</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>{stats.optimalPct}%</div>
        <div className="kpi-sub">55–85% loading (ideal)</div>
      </div>
    </div>
  )
}
