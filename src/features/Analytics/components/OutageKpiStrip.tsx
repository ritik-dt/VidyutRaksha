import { OUTAGE_KPIS } from '../data/outage'

/** 4-KPI strip for the Outage tab (screenshot 1). */
export function OutageKpiStrip() {
  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #64748b)' }} />
        <div className="kpi-label">Feeder outages</div>
        <div className="kpi-value">{OUTAGE_KPIS.feederPct}%</div>
        <div className="kpi-sub">Of total outage hours</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">DTR outages</div>
        <div className="kpi-value">{OUTAGE_KPIS.dtrPct}%</div>
        <div className="kpi-sub">Transformer issues</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Consumer-only</div>
        <div className="kpi-value">{OUTAGE_KPIS.consumerOnlyPct}%</div>
        <div className="kpi-sub">⚠ Potential theft signal</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">Suspicious patterns</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{OUTAGE_KPIS.suspiciousPct}%</div>
        <div className="kpi-sub">Of consumer-only outages flagged</div>
      </div>
    </div>
  )
}
