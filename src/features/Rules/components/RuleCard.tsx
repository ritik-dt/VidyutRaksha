import { formatThreshold } from '../logic/threshold'
import type { DetectionRule, RuleState, ThresholdSpec } from '../types'
import { SliderGroup } from './SliderGroup'

interface RuleCardProps {
  rule: DetectionRule
  state: RuleState
  spec: ThresholdSpec
  onChange: <K extends keyof RuleState>(key: K, value: RuleState[K]) => void
}

/** One detection rule: header (dot, id — name, impact badge, Enabled) +
 *  description + a 3-column control row (threshold, weight, extra).
 *
 *  Matches prototype's `.rule-card`, `.rule-header`, `.rule-name`, `.rule-dot`,
 *  `.rule-desc`, `.rule-controls` styling byte-for-byte. Enabled label and
 *  checkbox use browser-default accent colours (prototype does not set them).
 *
 *  Responsive @media breakpoints kept per project standing instruction:
 *   - header stacks vertically at ≤480px
 *   - 3-col controls collapse to 1 column at ≤720px */
export function RuleCard({ rule, state, spec, onChange }: RuleCardProps) {
  return (
    <div className="bg-[var(--card)] rounded-[12px] border border-[var(--border)] py-[14px] px-[18px] mb-[10px]">
      <div className="flex justify-between items-center mb-2 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-2">
        <div className="flex items-center gap-2 font-medium text-[13px]">
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: rule.dot }}
          />
          {rule.id} — {rule.name}
          <span
            className={`badge text-[9px] py-[2px] px-[6px] ${
              rule.impact === 'High' ? 'badge-confirmed' : 'badge-assigned'
            }`}
          >
            {rule.impact}
          </span>
        </div>

        <label className="flex items-center gap-[5px] text-[11px] text-[var(--text-dim)]">
          Enabled
          <input
            type="checkbox"
            checked={state.enabled}
            onChange={(e) => onChange('enabled', e.target.checked)}
            aria-label={`${rule.id} enabled`}
          />
        </label>
      </div>

      <div className="text-[11px] text-[var(--text-mid)] mb-[10px]">{rule.desc}</div>

      <div className="grid grid-cols-3 gap-[10px] max-[720px]:grid-cols-1">
        <SliderGroup
          label={rule.thresh}
          value={state.threshold}
          display={formatThreshold(state.threshold, spec)}
          min={spec.min}
          max={spec.max}
          step={spec.step}
          onChange={(v) => onChange('threshold', v)}
          disabled={!state.enabled}
        />

        <SliderGroup
          label="Weight"
          value={state.weight}
          display={`${state.weight}/10`}
          min={1}
          max={10}
          step={1}
          onChange={(v) => onChange('weight', v)}
          disabled={!state.enabled}
        />

        <div>
          <label className="text-[10px] font-medium text-[var(--text-dim)] block mb-[3px]">
            {rule.extra}
          </label>
          <select
            className="form-select !py-[5px] !px-[6px] !text-[11px]"
            value={state.extra}
            disabled={!state.enabled}
            onChange={(e) => onChange('extra', e.target.value)}
            aria-label={`${rule.id} ${rule.extra}`}
          >
            {rule.eOpts.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
