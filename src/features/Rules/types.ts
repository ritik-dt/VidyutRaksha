// ── Detection Rules module types ─────────────────────────────────────────────
// Faithful port of the prototype's renderRules() (lines 9505-9510). The AI
// rule-engine configuration screen. Rules is state-level and NOT scope-reactive.

/** Impact tier — drives the dot colour and the badge style. */
export type RuleImpact = 'High' | 'Medium'

/** A detection rule as authored in the prototype. */
export interface DetectionRule {
  id: string
  name: string
  impact: RuleImpact
  /** dot colour (CSS var expression). */
  dot: string
  desc: string
  /** label for the threshold slider, e.g. 'Drop threshold'. */
  thresh: string
  /** the threshold's displayed value, e.g. '40%', '10', '0.10'. */
  tVal: string
  /** signal weight, 1-10. */
  weight: number
  /** label for the third control, e.g. 'Min months'. */
  extra: string
  /** options for the third control. */
  eOpts: string[]
}

/**
 * A slider's numeric range, derived from the rule's displayed threshold.
 *
 * The prototype hardcodes `min=1 max=100 value=40` on EVERY threshold slider,
 * so on 7 of 8 cards the thumb contradicts the number printed beside it (R08's
 * 0.10 can't even be represented in a 1-100 range). We derive a real range from
 * the authored value instead; the displayed default stays byte-identical.
 */
export interface ThresholdSpec {
  value: number
  /** unit suffix to re-append when formatting, e.g. '%'. */
  suffix: string
  min: number
  max: number
  step: number
}

/** Mutable per-rule state (the prototype renders these controls but never wires them). */
export interface RuleState {
  enabled: boolean
  threshold: number
  weight: number
  extra: string
}

/** AI tuning recommendation + the changes "auto-tune" applies. */
export interface RulesAiInsight {
  title: string
  /** may contain <strong> emphasis. */
  bodyHtml: string
  /** the weight changes the banner recommends, applied by AI auto-tune. */
  autoTune: { ruleId: string; weight: number }[]
}
