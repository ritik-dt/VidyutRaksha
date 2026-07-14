import { useToast } from '@/shared/context/ToastContext'
import {
  additionalCases,
  fmtCr,
  fmtLakh,
  type WhatIfResults as Results,
  type WhatIfState,
} from '../data/whatIfData'

interface WhatIfResultsProps {
  state: WhatIfState
  results: Results
  noChange: boolean
}

/** Placeholder + 5-KPI strip + AI interpretation + calculation footer. */
export function WhatIfResults({ state, results, noChange }: WhatIfResultsProps) {
  const { showToast } = useToast()

  if (noChange) {
    return (
      <div
        className="rounded-lg px-4 py-4 text-center text-[12px] text-text-dim"
        style={{ background: 'var(--bg)' }}
      >
        Move a slider to see the projected impact. All math is shown — no black-box formulas.
      </div>
    )
  }

  const r = results
  const w = state

  const recommendation =
    r.roi > 10
      ? `This is a strong scenario. ROI ${r.roi.toFixed(1)}× suggests every ₹1 spent recovers ₹${r.roi.toFixed(0)}. Worth proposing to the board.`
      : r.roi > 7
        ? `Healthy scenario. ROI ${r.roi.toFixed(1)}× exceeds the 7.9× baseline. Defensible business case.`
        : `Marginal scenario. ROI ${r.roi.toFixed(1)}× is below baseline — additional inspectors are eating into returns. Consider hit rate or feeder-fix levers instead.`

  const roiTrend = r.roi > 7.9 ? '↑' : '↓'

  return (
    <>
      <div className="kpi-row">
        {/* KPI 1: New AT&C loss */}
        <div
          className="kpi-card clickable"
          onClick={() =>
            showToast({
              type: 'success',
              title: 'New AT&C loss',
              message: `Projected loss after applying selected interventions: ${r.newLoss.toFixed(1)}% (down from ${r.baseLoss}% baseline). Reduction of ${r.lossReduction.toFixed(1)}pp from feeder fixes (${w.fixBottomFeeders} × 0.4pp) plus hit-rate boost effect.`,
              duration: 6000,
            })
          }
        >
          <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
          <div className="kpi-label">New AT&C loss</div>
          <div className="kpi-value" style={{ color: 'var(--green)' }}>
            {r.newLoss.toFixed(1)}%
          </div>
          <div className="kpi-sub">
            ↓ {r.lossReduction.toFixed(1)}pp from {r.baseLoss}%
          </div>
        </div>

        {/* KPI 2: New total recovery */}
        <div
          className="kpi-card clickable"
          onClick={() =>
            showToast({
              type: 'success',
              title: 'New total recovery',
              message: `Annual recovery in this scenario: ${fmtCr(r.newTotalRecovery)} (baseline ${fmtCr(r.baseRecovery)} + ${fmtCr(r.totalRecoveryDelta)} from interventions). Hit rate adds ${fmtCr(r.hitRateRecoveryDelta)}, feeders ${fmtCr(r.fixRecoveryDelta)}, inspectors ${fmtCr(r.inspectorRecoveryDelta)}.`,
              duration: 7000,
            })
          }
        >
          <div className="kpi-accent" style={{ background: 'var(--green)' }} />
          <div className="kpi-label">New total recovery</div>
          <div className="kpi-value" style={{ color: 'var(--green)' }}>
            {fmtCr(r.newTotalRecovery)}
          </div>
          <div className="kpi-sub">↑ {fmtCr(r.totalRecoveryDelta)} added</div>
        </div>

        {/* KPI 3: New hit rate */}
        <div
          className="kpi-card clickable"
          onClick={() =>
            showToast({
              type: 'info',
              title: 'New hit rate',
              message: `Projected hit rate: ${r.newHitRate}% (baseline 57%). Industry top quartile sits around 75%. Each +1pp adds approximately ₹30L annual recovery at current scale.`,
              duration: 5500,
            })
          }
        >
          <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
          <div className="kpi-label">New hit rate</div>
          <div className="kpi-value">{r.newHitRate}%</div>
          <div className="kpi-sub">
            {w.hitRateBoost > 0 ? `↑ ${w.hitRateBoost}pp` : 'unchanged'}
          </div>
        </div>

        {/* KPI 4: Annual program cost */}
        <div
          className="kpi-card clickable"
          onClick={() =>
            showToast({
              type: 'warning',
              title: 'Annual program cost',
              message: `Total annual cost: ${fmtCr(r.annualCost)}. Baseline ₹18L (platform + AI ops) + ${fmtLakh(w.inspectorBoost * 600000)} for ${w.inspectorBoost} new inspectors at ₹6L each (salary + equipment + travel).`,
              duration: 6000,
            })
          }
        >
          <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
          <div className="kpi-label">Annual program cost</div>
          <div className="kpi-value" style={{ fontSize: 14 }}>
            {fmtCr(r.annualCost)}
          </div>
          <div className="kpi-sub">
            {w.inspectorBoost > 0
              ? `+${fmtLakh(w.inspectorBoost * 600000)} from new inspectors`
              : 'baseline'}
          </div>
        </div>

        {/* KPI 5: New ROI */}
        <div
          className="kpi-card clickable"
          onClick={() =>
            showToast({
              type: 'success',
              title: 'New ROI',
              message: `Return on investment: ${r.roi.toFixed(1)}× (every ₹1 spent recovers ₹${r.roi.toFixed(0)}). Baseline 7.9×. ${r.roi > 10 ? 'Strong scenario worth proposing to board.' : r.roi > 7.9 ? 'Healthy improvement over baseline.' : 'Below baseline — additional inspectors eating into returns.'}`,
              duration: 7000,
            })
          }
        >
          <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
          <div className="kpi-label">New ROI</div>
          <div className="kpi-value" style={{ color: 'var(--ai-purple)' }}>
            {r.roi.toFixed(1)}×
          </div>
          <div className="kpi-sub">
            {roiTrend} from 7.9× baseline
          </div>
        </div>
      </div>

      {/* AI scenario interpretation */}
      <div className="ai-insight mt-3.5">
        <div className="ai-insight-header">✦ AI scenario interpretation</div>
        <div className="ai-insight-body">
          {w.hitRateBoost > 0 && (
            <div className="mb-1.5">
              <strong className="text-ai-purple">Hit rate +{w.hitRateBoost}pp</strong> →{' '}
              {fmtCr(r.hitRateRecoveryDelta)}/yr from better-targeted inspections (12,040
              inspections × {w.hitRateBoost}% × ₹25K avg recovery/case).
            </div>
          )}
          {w.fixBottomFeeders > 0 && (
            <div className="mb-1.5">
              <strong className="text-ai-purple">
                Fix {w.fixBottomFeeders} bottom feeder
                {w.fixBottomFeeders > 1 ? 's' : ''} to median (19.8%)
              </strong>{' '}
              → {fmtCr(r.fixRecoveryDelta)}/yr from closing the loss gap on ~
              {(w.fixBottomFeeders * 30000).toLocaleString('en-IN')} consumers (2.2pp gap ×
              consumption × tariff).
            </div>
          )}
          {w.inspectorBoost > 0 && (
            <div className="mb-1.5">
              <strong className="text-ai-purple">
                +{w.inspectorBoost} inspector{w.inspectorBoost > 1 ? 's' : ''}
              </strong>{' '}
              → {fmtCr(r.inspectorRecoveryDelta)}/yr from ~{additionalCases(w.inspectorBoost)}{' '}
              additional cases/yr at current hit rate.{' '}
              {w.inspectorBoost > 4 && (
                <strong style={{ color: 'var(--amber)' }}>
                  Diminishing returns past 4 — saturation in case pipeline.
                </strong>
              )}
            </div>
          )}
          <div
            className="mt-2 pt-2"
            style={{ borderTop: '1px solid var(--border-light)' }}
          >
            <strong className="text-ai-purple">Recommendation:</strong> {recommendation}
          </div>
        </div>
      </div>

      {/* Calculation method footer */}
      <div
        className="mt-3 rounded-md px-3 py-2.5 text-[10.5px] leading-relaxed text-text-dim"
        style={{ background: 'var(--bg)' }}
      >
        <strong>Calculation method:</strong> Hit-rate Δ uses ₹25K avg recovery × 12,040 annual
        inspections. Feeder fix uses 30K meters × 2.2pp gap × 200 kWh/mo × ₹6/kWh. Inspector boost:
        each new inspector handles ~150 cases/yr at 57% hit rate, with diminishing returns past 4
        hires (case-pipeline saturation). Cost: ₹6L/year per new inspector (salary + equipment +
        travel).
      </div>
    </>
  )
}
