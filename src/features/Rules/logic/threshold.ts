// ── Threshold logic (pure) ───────────────────────────────────────────────────
// The prototype hardcodes `min="1" max="100" value="40"` on every threshold
// slider, so the thumb only matches the printed value on R01. On the other seven
// it visibly contradicts it — and R08's 0.10 can't be represented in a 1-100
// range at all. We derive a real range from the value the rule actually declares.
//
// The DISPLAYED default stays byte-identical to the prototype; only the thumb
// position (and the range it can move through) becomes correct.

import type { ThresholdSpec } from '../types'

/** Split an authored threshold like '40%' or '0.10' into a number + suffix. */
function parseValue(tVal: string): { value: number; suffix: string } {
  const m = /^([\d.]+)(.*)$/.exec(tVal.trim())
  if (!m) return { value: 0, suffix: '' }
  return { value: parseFloat(m[1]), suffix: m[2] }
}

/** Derive a sensible, usable slider range for a rule's threshold. */
export function thresholdSpec(tVal: string): ThresholdSpec {
  const { value, suffix } = parseValue(tVal)

  // Percentages run 0-100 in whole steps.
  if (suffix === '%') {
    return { value, suffix, min: 0, max: 100, step: 1 }
  }

  // Fractional values (e.g. load factor 0.10) need a fine-grained 0-1 range —
  // the prototype's 1-100 range cannot express them.
  if (!Number.isInteger(value) && value < 1) {
    return { value, suffix, min: 0, max: 1, step: 0.01 }
  }

  // Plain counts (occurrences, kWh, off-hours). Give headroom above the default.
  const max = Math.max(50, Math.ceil(value * 5))
  return { value, suffix, min: 0, max, step: 1 }
}

/** Re-format a slider value back into its displayed form (keeps the unit). */
export function formatThreshold(value: number, spec: ThresholdSpec): string {
  // Preserve the authored precision for fractional thresholds (0.10, not 0.1).
  const text = spec.step < 1 ? value.toFixed(2) : String(value)
  return `${text}${spec.suffix}`
}
