/** Slider state — same shape as prototype's `window._whatIf`. */
export interface WhatIfState {
  hitRateBoost: number      // 0-18 pp
  fixBottomFeeders: number  // 0-5 feeders
  inspectorBoost: number    // 0-8 inspectors
}

export const WHAT_IF_INITIAL: WhatIfState = {
  hitRateBoost: 0,
  fixBottomFeeders: 0,
  inspectorBoost: 0,
}

/** Diminishing-returns curve — matches prototype exactly. */
function dimReturn(n: number): number {
  return n <= 4 ? n : 4 + (n - 4) * 0.6
}

/** Computed simulation results — mirrors prototype's whatIfCompute() return shape. */
export interface WhatIfResults {
  baseHitRate: number
  newHitRate: number
  baseLoss: number
  newLoss: number
  lossReduction: number
  baseRecovery: number
  newTotalRecovery: number
  totalRecoveryDelta: number
  hitRateRecoveryDelta: number
  fixRecoveryDelta: number
  inspectorRecoveryDelta: number
  baseInspectors: number
  newInspectors: number
  annualCost: number
  roi: number
  effectiveInspectors: number
}

/** Direct port of prototype's whatIfCompute() — every constant + formula preserved. */
export function whatIfCompute(w: WhatIfState): WhatIfResults {
  const baseHitRate = 57
  const baseLoss = 20.5
  const baseRecovery = 14200000
  const baseInspectors = 8

  const newHitRate = Math.min(85, baseHitRate + w.hitRateBoost)
  const hitRateRecoveryDelta = w.hitRateBoost * 250000 * 12

  const fixRecoveryDelta = w.fixBottomFeeders * 8000000
  const fixLossDelta = w.fixBottomFeeders * 0.4

  const effectiveInspectors = dimReturn(w.inspectorBoost)
  const inspectorRecoveryDelta = effectiveInspectors * 4200000
  const newInspectors = baseInspectors + w.inspectorBoost

  const totalRecoveryDelta = hitRateRecoveryDelta + fixRecoveryDelta + inspectorRecoveryDelta
  const newTotalRecovery = baseRecovery + totalRecoveryDelta
  const newLoss = Math.max(15, baseLoss - fixLossDelta - w.hitRateBoost * 0.06)

  const annualCost = 1800000 + w.inspectorBoost * 600000
  const roi = newTotalRecovery / annualCost

  return {
    baseHitRate,
    newHitRate,
    baseLoss,
    newLoss,
    lossReduction: baseLoss - newLoss,
    baseRecovery,
    newTotalRecovery,
    totalRecoveryDelta,
    hitRateRecoveryDelta,
    fixRecoveryDelta,
    inspectorRecoveryDelta,
    baseInspectors,
    newInspectors,
    annualCost,
    roi,
    effectiveInspectors,
  }
}

/** Preset scenario configs — direct port of prototype's 4 preset buttons. */
export const WHAT_IF_PRESETS: Array<{
  id: string
  emoji: string
  title: string
  desc: string
  state: WhatIfState
}> = [
  { id: 'ai-only',    emoji: '🤖', title: 'AI-only path:',      desc: '+5pp hit rate, no new hires',    state: { hitRateBoost:  5, fixBottomFeeders: 0, inspectorBoost: 0 } },
  { id: 'infra',      emoji: '🔨', title: 'Infra path:',        desc: 'Fix bottom 3 feeders',           state: { hitRateBoost:  0, fixBottomFeeders: 3, inspectorBoost: 0 } },
  { id: 'aggressive', emoji: '🎯', title: 'Aggressive plan:',   desc: 'All levers, modest scale',       state: { hitRateBoost:  8, fixBottomFeeders: 3, inspectorBoost: 4 } },
  { id: 'best-case',  emoji: '🚀', title: 'Best-case:',         desc: 'Industry top + 2× team',         state: { hitRateBoost: 15, fixBottomFeeders: 5, inspectorBoost: 8 } },
]

/* ── Formatters (match prototype's fmtCr / fmtLakh) ── */

export function fmtCr(v: number): string {
  return '₹' + (v / 10000000).toFixed(2) + ' Cr'
}

export function fmtLakh(v: number): string {
  return '₹' + (v / 100000).toFixed(1) + 'L'
}

/** True when all sliders are at 0 — used to show the "move a slider" placeholder. */
export function isBaseline(w: WhatIfState): boolean {
  return w.hitRateBoost === 0 && w.fixBottomFeeders === 0 && w.inspectorBoost === 0
}

/** Number of additional cases handled by extra inspectors (matches prototype's formula). */
export function additionalCases(inspectorBoost: number): number {
  return Math.round(
    inspectorBoost <= 4 ? inspectorBoost * 150 : 600 + (inspectorBoost - 4) * 90,
  )
}
