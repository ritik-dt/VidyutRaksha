import { fmtINRFull, formatIndian } from '@/shared/utils/formatters'
import type { AssessmentBreakdown, AssessmentInputs } from '../types'

interface AssessmentKpiStripProps {
  breakdown: AssessmentBreakdown
  inputs: AssessmentInputs
  periodSub: string
}

/** 5-KPI strip — matches the prototype's hardcoded values on load. */
export function AssessmentKpiStrip({ breakdown, inputs, periodSub }: AssessmentKpiStripProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Total assessment</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{fmtINRFull(breakdown.total)}</div>
        <div className="kpi-sub">Principal + penalty</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Theft period</div>
        <div className="kpi-value">{formatIndian(breakdown.days)} days</div>
        <div className="kpi-sub">{periodSub}</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #64748b)' }} />
        <div className="kpi-label">Stolen energy</div>
        <div className="kpi-value">{formatIndian(breakdown.stolenKwh)} kWh</div>
        <div className="kpi-sub">vs peer baseline</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">Tariff applied</div>
        <div className="kpi-value">₹{inputs.tariffRate.toFixed(2)}</div>
        <div className="kpi-sub">/unit ({inputs.category})</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">Multiplier</div>
        <div className="kpi-value">{breakdown.penaltyMultiplier.toFixed(1)}x</div>
        <div className="kpi-sub">Per Sec 135(1A)</div>
      </div>
    </div>
  )
}
