import { useToast } from '@/shared/context/ToastContext'
import { TOTAL_DTRS } from '../data/paretoData'

interface ParetoKpiStripProps {
  vitalCount: number
  vitalShare: number
  top3Total: number
}

/** 4-KPI strip for Pareto tab — all clickable per prototype. */
export function ParetoKpiStrip({ vitalCount, vitalShare, top3Total }: ParetoKpiStripProps) {
  const { showToast } = useToast()
  const vitalPct = (vitalCount / TOTAL_DTRS) * 100
  const effortMultiplier = vitalShare / vitalPct // 82 / 22.22 → 3.7

  return (
    <div className="kpi-row">
      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Vital few DTRs',
            message: `${vitalCount} DTRs (out of ${TOTAL_DTRS}) cause more than 80% of feeder loss. The Pareto principle in action — focus enforcement on these for maximum impact. Use Audit batch buttons in the table below to dispatch inspector teams.`,
            duration: 6500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Vital few DTRs</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{vitalCount}</div>
        <div className="kpi-sub">of {TOTAL_DTRS} ({vitalPct.toFixed(0)}%)</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Loss share concentration',
            message: `These ${vitalCount} DTRs cause ${vitalShare.toFixed(1)}% of all loss on Rathayatra Feeder. If we reduce their loss to feeder average, we cut Rathayatra AT&C from 24.8% to ~20%.`,
            duration: 6000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">Loss share they cause</div>
        <div className="kpi-value" style={{ color: 'var(--ai-purple)' }}>{vitalShare.toFixed(1)}%</div>
        <div className="kpi-sub">of feeder total</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Top 3 DTRs alone',
            message: `Shivpur Colony, Police Line, and Adampur DTRs alone account for ${top3Total.toFixed(1)}% of feeder loss — just 3 DTRs out of ${TOTAL_DTRS}. Highest priority for enforcement task force.`,
            duration: 6000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Top 3 alone</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{top3Total.toFixed(1)}%</div>
        <div className="kpi-sub">3 of {TOTAL_DTRS} = {((3 / TOTAL_DTRS) * 100).toFixed(0)}%</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'success',
            title: 'Effort multiplier',
            message: `Targeting the vital few delivers ${effortMultiplier.toFixed(1)}× the recovery vs uniform enforcement across all ${TOTAL_DTRS} DTRs. Same inspector hours, much higher recovery yield.`,
            duration: 6500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Effort multiplier</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>{effortMultiplier.toFixed(1)}×</div>
        <div className="kpi-sub">vs uniform enforcement</div>
      </div>
    </div>
  )
}
