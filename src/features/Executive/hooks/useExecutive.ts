// ── useExecutive (sole API seam) ─────────────────────────────────────────────
// Returns every data slice the Executive dashboard needs. Today values come from
// the typed mock-data files in ./data; swapping to a real API means replacing
// the imports with fetch calls (or wiring TanStack Query) — the type surface
// and the components stay identical.

import { AUTO_INSIGHTS } from '../data/autoInsights'
import { CONSUMER_ANALYTICS } from '../data/consumerAnalytics'
import { CRITICAL_ALERTS } from '../data/criticalAlerts'
import { DEMAND_GENERATION } from '../data/demandGeneration'
import { DETAIL_PANELS } from '../data/detailPanels'
import { ENERGY_FLOW } from '../data/energyFlow'
import { EXECUTIVE_KPIS } from '../data/executiveKpis'
import { METERING_HEALTH } from '../data/meteringHealth'
import { P2_WARNINGS } from '../data/p2Warnings'
import { PREPAID_NON_RECHARGE } from '../data/prepaidNonRecharge'
import { RELIABILITY } from '../data/reliability'
import { REVENUE_SNAPSHOT } from '../data/revenueSnapshot'
import { TRENDS } from '../data/trends'
import type { DetailPanelData, DetailPanelKey } from '../types'

export function useExecutive() {
  return {
    // Header sections
    kpis: EXECUTIVE_KPIS,
    criticalAlerts: CRITICAL_ALERTS,

    // Dashboard panels
    energyFlow: ENERGY_FLOW,
    demandGeneration: DEMAND_GENERATION,
    reliability: RELIABILITY,
    consumerAnalytics: CONSUMER_ANALYTICS,
    meteringHealth: METERING_HEALTH,
    prepaidNonRecharge: PREPAID_NON_RECHARGE,
    revenueSnapshot: REVENUE_SNAPSHOT,
    p2Warnings: P2_WARNINGS,
    trends: TRENDS,
    autoInsights: AUTO_INSIGHTS,

    /** Look up detail-panel content by key. */
    getPanel: (key: DetailPanelKey): DetailPanelData => DETAIL_PANELS[key],

    loading: false as const,
    error: null,
  }
}
