import { formatIndian } from '@/shared/utils/formatters'
import type { RevenueKpis } from '../data/revenue'

interface RevenueKpiStripProps {
  kpis: RevenueKpis
}

/** 5-KPI strip for the Revenue tab (matches prototype exactly). */
export function RevenueKpiStrip({ kpis }: RevenueKpiStripProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Billing efficiency</div>
        <div className="kpi-value">{kpis.billingEffPct}%</div>
        <div className="kpi-sub">Meters billed / total</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Unbilled meters</div>
        <div className="kpi-value">{formatIndian(kpis.unbilledMeters)}</div>
        <div className="kpi-sub">5.8% not billed</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Collection rate</div>
        <div className="kpi-value">{kpis.collectionRatePct}%</div>
        <div className="kpi-sub">Collected / billed</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Outstanding</div>
        <div className="kpi-value">₹{kpis.outstandingCr} Cr</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">PF penalty recoverable</div>
        <div className="kpi-value">₹{kpis.pfPenaltyCr} Cr</div>
        <div className="kpi-sub">PF &lt; 0.85</div>
      </div>
    </div>
  )
}
