// ── useRoi (sole API seam) ───────────────────────────────────────────────────
// Returns every data slice the ROI business case needs. ROI is state-level and
// NOT scope-reactive — the prototype's renderROI() computes values from
// hierData['uppcl'] but discards them, so this hook takes no scope and returns
// static data. Swapping mock data for a real API is a one-file change here; the
// type surface and component tree stay identical.

import {
  COST_NOTE,
  COST_ROWS,
  COST_TOTAL,
  CUMULATIVE_NET_MAX,
  CUMULATIVE_NET_ROWS,
  PAYBACK_STATS,
} from '../data/costPayback'
import { BENEFIT_CARDS } from '../data/nonFinancial'
import {
  LOSS_BUCKETS,
  LOSS_TOTAL,
  OPPORTUNITY_CARDS,
} from '../data/opportunity'
import {
  RECOMMENDATION,
  TOAST_DRAFT_TENDER,
  TOAST_EXPORT_MODEL,
  TOAST_LOCK_SCOPE,
  TOAST_SEND_BOARD,
} from '../data/recommendation'
import { RISK_ROWS } from '../data/risks'
import { RECOVERY_SCENARIOS } from '../data/scenarios'
import { computeCumulativeNet } from '../logic/cumulativeNet'

export function useRoi() {
  const cumulativeNet = computeCumulativeNet(CUMULATIVE_NET_ROWS, CUMULATIVE_NET_MAX)

  return {
    // Section 1
    opportunityCards: OPPORTUNITY_CARDS,
    lossBuckets: LOSS_BUCKETS,
    lossTotal: LOSS_TOTAL,

    // Section 2
    scenarios: RECOVERY_SCENARIOS,

    // Section 3
    costRows: COST_ROWS,
    costTotal: COST_TOTAL,
    costNote: COST_NOTE,
    paybackStats: PAYBACK_STATS,
    cumulativeNet,

    // Section 4
    benefits: BENEFIT_CARDS,

    // Section 5
    risks: RISK_ROWS,

    // Section 6
    recommendation: RECOMMENDATION,

    // Toast payloads
    toasts: {
      exportModel: TOAST_EXPORT_MODEL,
      draftTender: TOAST_DRAFT_TENDER,
      lockScope: TOAST_LOCK_SCOPE,
      sendBoard: TOAST_SEND_BOARD,
    },

    loading: false as const,
    error: null,
  }
}
