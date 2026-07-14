// ── ROI & Business Case module types ─────────────────────────────────────────
// Faithful port of the prototype's renderROI() (lines 12095-12357). ROI is a
// procurement-grade financial business case — a long-form scrolling document,
// state-level (UPPCL-wide) and NOT scope-reactive (the prototype computes scope
// values from hierData['uppcl'] but discards them; every displayed number is
// static). The types below are the contract; data files satisfy them, the hook
// exposes them, components consume them via props.

// ── Section 1 · The opportunity ──────────────────────────────────────────────
/** One of the 4 severity-tinted opportunity KPI cards. */
export interface OpportunityCard {
  id: string
  label: string
  value: string
  /** value colour: 'ink' = default text, else a semantic tone. */
  valueTone: 'ink' | 'red' | 'amber'
  /** sub-line may contain <strong> emphasis markup. */
  subHtml: string
  /** card tint — 'red' or 'amber' gradient background. */
  tint: 'red' | 'amber'
}

/** AI-addressable flag for a loss bucket. */
export type Addressable = 'yes' | 'partial' | 'no'

/** One row in the "Where the ₹9,676 Cr goes" table. */
export interface LossBucket {
  bucket: string
  value: string
  share: string
  addressable: Addressable
  note: string
}

/** The purple total row under the loss-bucket table. */
export interface LossTotal {
  label: string
  value: string
  share: string
  note: string
}

// ── Section 2 · AI-attributable recovery ─────────────────────────────────────
/** Accent colour key for a scenario card. */
export type ScenarioTone = 'amber' | 'purple' | 'green'

export interface RecoveryScenario {
  id: string
  label: string
  recovery: string
  pct: string
  tone: ScenarioTone
  desc: string
  assumptions: string[]
}

// ── Section 3 · Implementation cost & payback ────────────────────────────────
export interface CostRow {
  cost: string
  y1: string
  y2: string
  y3: string
}

export interface CostTotal {
  label: string
  y1: string
  y2: string
  y3: string
}

export interface PaybackStat {
  id: string
  label: string
  value: string
  sub: string
  /** tile tint — 'green' or 'purple'. */
  tone: 'green' | 'purple'
}

/** A row of the 5-year cumulative-net chart (pre-cum values; cum computed in logic). */
export interface CumulativeNetRow {
  year: string
  rec: number
  cost: number
  net: number
}

// ── Section 4 · Non-financial value ──────────────────────────────────────────
export interface BenefitCard {
  id: string
  icon: string
  title: string
  value: string
  desc: string
}

// ── Section 5 · What could go wrong ──────────────────────────────────────────
export type RiskLikelihood = 'Low' | 'Medium' | 'High'

export interface RiskRow {
  risk: string
  likelihood: RiskLikelihood
  /** likelihood badge colour. */
  likelihoodTone: 'green' | 'amber' | 'red'
  impact: string
  mitigation: string
}

// ── Section 6 · Recommendation ───────────────────────────────────────────────
export interface Recommendation {
  /** approval paragraph — may contain <strong> markup. */
  approveHtml: string
  /** bottom-line paragraph — may contain <strong> markup. */
  bottomLineHtml: string
}

// ── Toast action payloads (fired by header + footer buttons) ─────────────────
export interface RoiToast {
  type: 'success' | 'ai' | 'info'
  title: string
  message: string
  duration: number
}
