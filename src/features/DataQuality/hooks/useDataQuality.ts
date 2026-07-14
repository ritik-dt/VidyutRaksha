// ── useDataQuality (sole API seam) ───────────────────────────────────────────
// All Data Quality data plus the filter state driven by the two clickable KPI
// cards. State-level, NOT scope-reactive (the prototype does no scope filtering).

import { useCallback, useMemo, useState } from 'react'
import { DQ_AI_INSIGHT } from '../data/aiInsight'
import { ATTENTION_ROWS, ATTENTION_TITLE } from '../data/attention'
import { COMM_HEALTH_CHART, FRESHNESS_CHART } from '../data/charts'
import { COMPLETENESS_ROWS } from '../data/completeness'
import { DQ_KPIS } from '../data/kpis'
import { PIPELINE_STATS } from '../data/pipeline'
import { filterAttention } from '../logic/dqFilters'
import type { DqFilterId } from '../types'

export function useDataQuality() {
  const [filter, setFilter] = useState<DqFilterId | undefined>(undefined)

  const clearFilter = useCallback(() => setFilter(undefined), [])

  const attention = useMemo(() => filterAttention(ATTENTION_ROWS, filter), [filter])

  return {
    kpis: DQ_KPIS,
    freshnessChart: FRESHNESS_CHART,
    commHealthChart: COMM_HEALTH_CHART,
    pipeline: PIPELINE_STATS,
    attention,
    attentionTitle: ATTENTION_TITLE,
    completeness: COMPLETENESS_ROWS,
    aiInsight: DQ_AI_INSIGHT,

    filter,
    setFilter,
    clearFilter,

    loading: false as const,
    error: null,
  }
}
