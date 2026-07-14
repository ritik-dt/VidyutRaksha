import { useToast } from '@/shared/context/ToastContext'
import type { AuditKpis } from '../types'

interface EnergyAuditKpiStripProps {
  kpis: AuditKpis
  levelName: string
  totalFeeders: number
}

/**
 * 6-KPI strip for the Energy Audit tab (screenshot 1):
 * Feeder loss · DT loss · Collection efficiency · Top feeders · Worst feeders · Worst DTs.
 */
export function EnergyAuditKpiStrip({ kpis, levelName, totalFeeders }: EnergyAuditKpiStripProps) {
  const { showToast } = useToast()

  return (
    <div className="kpi-row">
      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Feeder loss (avg)',
            message: `Average AT&C loss across all feeders in ${levelName}: ${kpis.feederLossPct}%. Click feeder ranking to drill.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Feeder loss</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{kpis.feederLossPct}%</div>
        <div className="kpi-sub">Avg across {totalFeeders} feeders</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'DT loss (avg)',
            message: `Average loss across distribution transformers: ${kpis.dtLossPct}%. ${kpis.worstDtCount} DTs above 22%.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">DT loss</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{kpis.dtLossPct}%</div>
        <div className="kpi-sub">Avg across all DTs</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Collection efficiency',
            message: `Amount collected / amount billed = ${kpis.collectionEffPct}%. UPERC target: 95%. Outstanding: ₹${kpis.outstandingCr} Cr.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Collection efficiency</div>
        <div
          className="kpi-value"
          style={{ color: parseFloat(kpis.collectionEffPct) >= 95 ? 'var(--green)' : 'var(--amber)' }}
        >
          {kpis.collectionEffPct}%
        </div>
        <div className="kpi-sub">Billing efficiency: {kpis.billingEffPct}%</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'success',
            title: 'Top performing feeders',
            message: `${kpis.topFeederCount} feeders performing well with loss < 12% in ${levelName}.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Top feeders</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>{kpis.topFeederCount}</div>
        <div className="kpi-sub">Loss &lt; 12%</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Worst performing feeders',
            message: `${kpis.worstFeederCount} feeders with loss > 18% in ${levelName} — priority for line-loss audit.`,
            duration: 5500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Worst feeders</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{kpis.worstFeederCount}</div>
        <div className="kpi-sub">Loss &gt; 18%</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Worst performing DTs',
            message: `${kpis.worstDtCount} DTs with loss > 22% in ${levelName} — replacement or theft inspection candidates.`,
            duration: 5500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">Worst DTs</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{kpis.worstDtCount}</div>
        <div className="kpi-sub">Loss &gt; 22%</div>
      </div>
    </div>
  )
}
