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
 *  description + a 3-column control row (threshold, weight, extra). */
export function RuleCard({ rule, state, spec, onChange }: RuleCardProps) {
  return (
    <div className="rule-card">
      <div className="rule-header">
        <div className="rule-name">
          <span className="rule-dot" style={{ background: rule.dot }} />
          {rule.id} — {rule.name}
          <span
            className={`badge rule-impact-badge ${
              rule.impact === 'High' ? 'badge-confirmed' : 'badge-assigned'
            }`}
          >
            {rule.impact}
          </span>
        </div>

        <label className="rule-enable">
          Enabled
          <input
            type="checkbox"
            checked={state.enabled}
            onChange={(e) => onChange('enabled', e.target.checked)}
            aria-label={`${rule.id} enabled`}
          />
        </label>
      </div>

      <div className="rule-desc">{rule.desc}</div>

      <div className="rule-controls">
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

        <div className="slider-group">
          <label>{rule.extra}</label>
          <select
            className="form-select rule-extra-select"
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
