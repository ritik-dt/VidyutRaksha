import type { DtStats } from '../types'

interface DtLoadKpiStripProps {
  stats: DtStats
  excessDemandCount: number
}

/**
 * 4-KPI strip — Overloaded / Near-overload / Excess demand / Optimal %.
 * Replaces the prototype's `.kpi-row.dt-load-kpis` with a responsive Tailwind
 * grid (4-col desktop → 2-col ≤900px → 1-col ≤380px). Each tile keeps the
 * shared `.kpi-card` class for styling but drops the `dt-load-kpis` mobile
 * `!important` override, since the grid handles the responsive layout.
 */
export function DtLoadKpiStrip({ stats, excessDemandCount }: DtLoadKpiStripProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="grid grid-cols-4 gap-[12px] mb-[20px] max-[900px]:grid-cols-2 max-[380px]:grid-cols-1">
      <div
        className="kpi-card clickable !min-w-0"
        onClick={() => scrollTo('overloaded-dts-section')}
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Overloaded DTs</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>
          {stats.overloaded}
        </div>
        <div className="kpi-sub">&gt;100% loading</div>
      </div>
      <div
        className="kpi-card clickable !min-w-0"
        onClick={() => scrollTo('near-overload-dts-section')}
      >
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Near-overload DTs</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>
          {stats.nearOverload}
        </div>
        <div className="kpi-sub">85–100% loading</div>
      </div>
      <div
        className="kpi-card clickable !min-w-0"
        onClick={() => scrollTo('excess-demand-section')}
      >
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Excess demand cases</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>
          {excessDemandCount}
        </div>
        <div className="kpi-sub">Load &gt; sanctioned</div>
      </div>
      <div
        className="kpi-card clickable !min-w-0"
        onClick={() => scrollTo('optimal-dts-section')}
      >
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Optimal DTs</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>
          {stats.optimalPct}%
        </div>
        <div className="kpi-sub">55–85% loading (ideal)</div>
      </div>
    </div>
  )
}
