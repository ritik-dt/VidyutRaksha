import type {
  AssessmentBreakdown,
  AssessmentInputs,
  AssessmentMethod,
  ConsumerCategory,
  EvidenceItem,
  PenaltyMultiplier,
} from '../types'

/** Featured case reference — matches the prototype's Section-135 example. */
export const ASSESSMENT_CASE_ID = 'C-20260301-001'
export const SAVED_DRAFTS_COUNT = 3

/** Category options for the input form (shown as-is in the select). */
export const CATEGORY_OPTIONS: { value: ConsumerCategory; label: string }[] = [
  { value: 'LMV2', label: 'LMV2 - Non-domestic (Commercial)' },
  { value: 'LMV1', label: 'LMV1 - Domestic' },
  { value: 'LMV6', label: 'LMV6 - Industrial' },
]

export const PENALTY_OPTIONS: { value: PenaltyMultiplier; label: string }[] = [
  { value: '2.0', label: '2.0x (Section 135.1A)' },
  { value: '1.5', label: '1.5x' },
  { value: '3.0', label: '3.0x (repeat offender)' },
]

/**
 * Seed input values — dates match the prototype's displayed values exactly.
 * Note: the prototype's step-by-step text hard-codes "1,350 days / 25,920 kWh /
 * ₹3,88,800" regardless of the dates shown. React does live math instead, so
 * real day count = ~1,228 with these dates. To match the screenshot's exact
 * numbers, adjust `theftStartDate` to 2022-07-21 (1,350 days before detection).
 */
export const DEFAULT_INPUTS: AssessmentInputs = {
  consumer: 'HEERA LAL AGRAWAL',
  account: '8115290000',
  category: 'LMV2',
  tariffRate: 7.5,
  theftStartDate: '2022-11-20',
  detectionDate: '2026-04-01',
  peerAvgKwhPerDay: 19.2,
  penaltyMultiplier: '2.0',
  theftMethod: 'Earth Loading (50 events - codes 69/70)',
}

/**
 * Prototype's exact displayed breakdown for the seed inputs.
 * The prototype hard-codes these values (1,350 days / 25,920 kWh / ₹1,94,400 /
 * ₹3,88,800) regardless of the dates typed in the form. We do the same on
 * initial render so the KPIs and step-by-step boxes match the screenshots.
 * Once the user edits any input, live math takes over via calculateAssessment.
 */
export const DEFAULT_BREAKDOWN: AssessmentBreakdown = {
  days: 1350,
  stolenKwh: 25920,
  meteredKwh: 0,
  principal: 194400,
  penaltyMultiplier: 2.0,
  total: 388800,
}

/** Prototype's KPI sub-labels for the theft period (hardcoded copy). */
export const DEFAULT_PERIOD_SUB = 'Nov 2022 - Mar 2026'

/**
 * Pure Section-135 calculation — port of the prototype's step-by-step math.
 * Used on every input change once the user edits the form; the initial render
 * uses DEFAULT_BREAKDOWN so the on-load numbers match the screenshots.
 * Robust to blank/invalid dates: falls back to 0 for any NaN input.
 */
export function calculateAssessment(inputs: AssessmentInputs): AssessmentBreakdown {
  const start = new Date(inputs.theftStartDate)
  const end = new Date(inputs.detectionDate)
  const startMs = start.getTime()
  const endMs = end.getTime()
  const days =
    isNaN(startMs) || isNaN(endMs)
      ? 0
      : Math.max(0, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)))
  const peer = Number.isFinite(inputs.peerAvgKwhPerDay) ? inputs.peerAvgKwhPerDay : 0
  const tariff = Number.isFinite(inputs.tariffRate) ? inputs.tariffRate : 0
  const penaltyMultiplier = parseFloat(inputs.penaltyMultiplier) || 0
  const stolenKwh = Math.round(days * peer)
  const principal = Math.round(stolenKwh * tariff)
  const total = Math.round(principal * penaltyMultiplier)
  return {
    days,
    stolenKwh,
    meteredKwh: 0,
    principal,
    penaltyMultiplier,
    total,
  }
}

/** Fixed comparison table — matches the prototype's 3-methods row exactly. */
export const CALCULATION_METHODS: AssessmentMethod[] = [
  {
    id: 'peer',
    name: '✓ Peer baseline (RECOMMENDED)',
    description: 'Compare to avg consumption of similar consumers in same area',
    stolenKwh: 25920,
    principal: 194400,
    withPenalty: 388800,
    confidence: 92,
    recommended: true,
  },
  {
    id: 'historical',
    name: 'Historical baseline',
    description: "Use consumer's own pre-theft consumption (3-year avg)",
    stolenKwh: 28350,
    principal: 212625,
    withPenalty: 425250,
    confidence: 87,
  },
  {
    id: 'connected',
    name: 'Connected load method',
    description: 'Sanctioned load × standard utilization × period',
    stolenKwh: 21600,
    principal: 162000,
    withPenalty: 324000,
    confidence: 74,
  },
]

/** Auto-attached evidence — 6 items from the prototype. */
export const EVIDENCE_ITEMS: EvidenceItem[] = [
  { n: '1', icon: '📄', title: 'AI flag report', description: 'Detection logic + risk score history' },
  { n: '2', icon: '📊', title: 'Peer baseline data', description: '19 comparable consumers, same feeder, same category' },
  { n: '3', icon: '⚡', title: 'Tamper event log', description: '50 earth-loading events with timestamps' },
  { n: '4', icon: '📷', title: 'Inspection photos', description: '6 photos, geo-tagged, signed' },
  { n: '5', icon: '📋', title: 'Meter reading certificate', description: 'Final reading before seal' },
  { n: '6', icon: '🧮', title: 'Calculation worksheet', description: 'This calculator output, stepwise' },
]
