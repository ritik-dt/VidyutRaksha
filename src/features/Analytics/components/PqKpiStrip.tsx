import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import type { PqKpis } from '../data/pq'

interface PqKpiStripProps {
  kpis: PqKpis
  levelName: string
}

/** 6-KPI strip for Power quality (screenshot 1). All clickable with prototype toasts. */
export function PqKpiStrip({ kpis, levelName }: PqKpiStripProps) {
  const { showToast } = useToast()

  return (
    <div className="kpi-row">
      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'VDI — Voltage Deviation Index',
            message: `Average percentage by which voltage deviates from nominal (240V) across all consumers. Current ${kpis.vdiPct}%. UPERC target: < 10%. Higher = more nodes outside acceptable band.`,
            duration: 5500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">VDI (avg)</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{kpis.vdiPct}%</div>
        <div className="kpi-sub">Voltage Deviation Index</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'V deviations — R-phase',
            message: `${kpis.vDeviations} half-hourly measurement slots showed R-phase voltage > ±10% from nominal in the last 30 days at ${levelName}. Concentrated on Rathayatra and Raghunath Nagar feeders.`,
            duration: 5500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">V deviations</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{kpis.vDeviations}</div>
        <div className="kpi-sub">Slots &gt; ±10% (R-phase)</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'System Power Factor',
            message: `Weighted average PF across all metered consumers in ${levelName}. Current ${kpis.powerFactor}. UPERC target: > 0.95 for industrial; > 0.85 for commercial. Low PF = reactive power burden + penalty.`,
            duration: 5500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Power factor</div>
        <div className="kpi-value">{kpis.powerFactor}</div>
        <div className="kpi-sub">System average PF</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Low PF consumers (PF < 0.85)',
            message: `${formatIndian(kpis.lowPfConsumers)} consumers operating below 0.85 PF. Each is liable for UPERC PF penalty surcharge. Total recoverable: ₹${kpis.pfPenaltyCr} Cr/month.`,
            duration: 6000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Low PF consumers</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{formatIndian(kpis.lowPfConsumers)}</div>
        <div className="kpi-sub">PF &lt; 0.85</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Voltage Unbalance',
            message: `Maximum 3-phase voltage differential (V) averaged across DTRs at ${levelName}. Current ${kpis.vUnbalanceV} V. NEMA limit: 5% of nominal (~12V). Above limit = motor heating, equipment damage risk.`,
            duration: 5500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">V unbalance (avg)</div>
        <div className="kpi-value">{kpis.vUnbalanceV} V</div>
        <div className="kpi-sub">Max phase differential</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'success',
            title: 'Current Unbalance',
            message: `Phase current imbalance averaged across DTRs. Current ${kpis.currentUnbalancePct}%. Below 10% threshold (acceptable). Sustained > 10% indicates load distribution issues — review DT phase loading.`,
            duration: 5500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Current unbalance</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>{kpis.currentUnbalancePct}%</div>
        <div className="kpi-sub">Below 10% threshold</div>
      </div>
    </div>
  )
}
