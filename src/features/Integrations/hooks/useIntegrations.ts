// ── useIntegrations (sole API seam) ──────────────────────────────────────────
// The 10 connected systems plus the KPI-driven filter. State-level, NOT
// scope-reactive (the prototype does no scope filtering here).
//
// Four of the five KPIs are DERIVED from the systems array rather than
// hardcoded, so adding or removing a system keeps the counts honest.

import { useCallback, useMemo, useState } from 'react'
import { INTEGRATIONS_AI_INSIGHT } from '../data/aiInsight'
import { INTEGRATION_SYSTEMS } from '../data/systems'
import { buildIntKpis, filterSystems } from '../logic/integrationStats'
import type { IntStatus } from '../types'

export function useIntegrations() {
  const [filter, setFilter] = useState<IntStatus | undefined>(undefined)

  const clearFilter = useCallback(() => setFilter(undefined), [])

  const kpis = useMemo(() => buildIntKpis(INTEGRATION_SYSTEMS), [])
  const systems = useMemo(() => filterSystems(INTEGRATION_SYSTEMS, filter), [filter])

  return {
    kpis,
    systems,
    allSystems: INTEGRATION_SYSTEMS,
    aiInsight: INTEGRATIONS_AI_INSIGHT,

    filter,
    setFilter,
    clearFilter,

    loading: false as const,
    error: null,
  }
}
