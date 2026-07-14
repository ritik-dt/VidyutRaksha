import {
  CATEGORY_OPTIONS,
  PENALTY_OPTIONS,
} from '../data/assessment'
import type { AssessmentInputs, ConsumerCategory, PenaltyMultiplier } from '../types'

interface InputParametersCardProps {
  inputs: AssessmentInputs
  onChange: <K extends keyof AssessmentInputs>(key: K, value: AssessmentInputs[K]) => void
  onRecalculate: () => void
  onSaveDraft: () => void
}

const LABEL_CLASS =
  'mb-[3px] text-[11px] font-semibold uppercase tracking-[0.5px] text-text-dim'
const INPUT_CLASS =
  'w-full rounded-md border border-border bg-card px-2 py-2 text-[12px] text-text focus:border-ai-purple focus:outline-none'
const READONLY_INPUT_CLASS =
  'w-full rounded-md border border-border bg-bg px-2 py-2 text-[12px] text-text focus:outline-none'

/** Left card in grid-2 — controlled form for the Section-135 calculation. */
export function InputParametersCard({
  inputs,
  onChange,
  onRecalculate,
  onSaveDraft,
}: InputParametersCardProps) {
  return (
    <div className="card">
      <div className="card-title">Input parameters</div>
      <div className="flex flex-col gap-2.5">
        {/* Consumer (readonly) */}
        <div>
          <div className={LABEL_CLASS}>Consumer</div>
          <input
            type="text"
            value={`${inputs.consumer} (Account #${inputs.account})`}
            readOnly
            className={READONLY_INPUT_CLASS}
          />
        </div>

        {/* Category + Tariff */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div>
            <div className={LABEL_CLASS}>Category</div>
            <select
              value={inputs.category}
              onChange={(e) => onChange('category', e.target.value as ConsumerCategory)}
              className={INPUT_CLASS}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className={LABEL_CLASS}>Tariff rate (₹/unit)</div>
            <input
              type="number"
              step="0.01"
              value={inputs.tariffRate}
              onChange={(e) => onChange('tariffRate', parseFloat(e.target.value) || 0)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {/* Start + Detection dates */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div>
            <div className={LABEL_CLASS}>Theft start date</div>
            <input
              type="date"
              value={inputs.theftStartDate}
              onChange={(e) => onChange('theftStartDate', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <div className={LABEL_CLASS}>Detection date</div>
            <input
              type="date"
              value={inputs.detectionDate}
              onChange={(e) => onChange('detectionDate', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {/* Peer avg + Penalty multiplier */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div>
            <div className={LABEL_CLASS}>Peer avg (kWh/day)</div>
            <input
              type="number"
              step="0.1"
              value={inputs.peerAvgKwhPerDay}
              onChange={(e) => onChange('peerAvgKwhPerDay', parseFloat(e.target.value) || 0)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <div className={LABEL_CLASS}>Penalty multiplier</div>
            <select
              value={inputs.penaltyMultiplier}
              onChange={(e) => onChange('penaltyMultiplier', e.target.value as PenaltyMultiplier)}
              className={INPUT_CLASS}
            >
              {PENALTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Theft method (readonly) */}
        <div>
          <div className={LABEL_CLASS}>Theft method detected</div>
          <input type="text" value={inputs.theftMethod} readOnly className={READONLY_INPUT_CLASS} />
        </div>
      </div>

      <div className="mt-3.5 flex gap-1.5 max-sm:flex-col">
        <button type="button" className="btn btn-ai btn-sm flex-1" onClick={onRecalculate}>
          🔄 Recalculate
        </button>
        <button type="button" className="btn btn-outline btn-sm flex-1" onClick={onSaveDraft}>
          💾 Save draft
        </button>
      </div>
    </div>
  )
}
