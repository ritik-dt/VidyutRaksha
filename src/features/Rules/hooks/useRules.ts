// ── useRules (sole API seam) ─────────────────────────────────────────────────
// The 8 detection rules plus the mutable state behind their controls. Rules is
// state-level and NOT scope-reactive (the prototype does no scope filtering).
//
// The prototype renders the Enabled checkbox, both sliders and the dropdown but
// never wires them; we hold that state here so the controls actually work.

import { useCallback, useMemo, useState } from 'react'
import { RULES_AI_INSIGHT } from '../data/aiInsight'
import { DETECTION_RULES, RULE_ENGINE_VERSION } from '../data/rules'
import { thresholdSpec } from '../logic/threshold'
import type { RuleState, ThresholdSpec } from '../types'

/** Seed each rule's control state from its authored values. */
function initialState(): Record<string, RuleState> {
  const out: Record<string, RuleState> = {}
  for (const r of DETECTION_RULES) {
    out[r.id] = {
      enabled: true, // prototype ships every checkbox checked
      threshold: thresholdSpec(r.tVal).value,
      weight: r.weight,
      extra: r.eOpts[0],
    }
  }
  return out
}

export function useRules() {
  const [state, setState] = useState<Record<string, RuleState>>(initialState)

  /** Slider ranges are derived once — they depend only on the authored value. */
  const specs = useMemo<Record<string, ThresholdSpec>>(() => {
    const out: Record<string, ThresholdSpec> = {}
    for (const r of DETECTION_RULES) out[r.id] = thresholdSpec(r.tVal)
    return out
  }, [])

  const update = useCallback(
    <K extends keyof RuleState>(ruleId: string, key: K, value: RuleState[K]) => {
      setState((s) => ({ ...s, [ruleId]: { ...s[ruleId], [key]: value } }))
    },
    [],
  )

  /**
   * Apply the weight changes the AI insight recommends (R02 → 10, R05 → 4).
   * The button does exactly what the banner says it will — no surprises.
   */
  const autoTune = useCallback(() => {
    setState((s) => {
      const next = { ...s }
      for (const { ruleId, weight } of RULES_AI_INSIGHT.autoTune) {
        if (next[ruleId]) next[ruleId] = { ...next[ruleId], weight }
      }
      return next
    })
    return RULES_AI_INSIGHT.autoTune
  }, [])

  return {
    rules: DETECTION_RULES,
    version: RULE_ENGINE_VERSION,
    aiInsight: RULES_AI_INSIGHT,
    state,
    specs,
    update,
    autoTune,

    loading: false as const,
    error: null,
  }
}
