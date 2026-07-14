import { useMemo, useState } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { computeAuditKpis } from '../data/audit'
import { computeReliabilityAverages } from '../data/reliability'
import { computeRevenueKpis, computeUnbilledReasons } from '../data/revenue'
import { computePqKpis } from '../data/pq'
import type { AnalyticsTabId } from '../types'

/** Analytics state — active tab + scope-derived KPIs. */
export function useAnalytics() {
  const scope = useScope()
  const [activeTab, setActiveTab] = useState<AnalyticsTabId>('audit')

  const auditKpis = useMemo(
    () => computeAuditKpis(scope.currentNode ?? undefined),
    [scope.currentNode],
  )

  const reliabilityAvgs = useMemo(() => computeReliabilityAverages(), [])

  const revenueKpis = useMemo(
    () => computeRevenueKpis(scope.currentNode ?? undefined),
    [scope.currentNode],
  )

  const unbilledRows = useMemo(
    () => computeUnbilledReasons(scope.currentNode ?? undefined),
    [scope.currentNode],
  )

  const pqKpis = useMemo(
    () => computePqKpis(scope.currentNode ?? undefined),
    [scope.currentNode],
  )

  return {
    activeTab,
    setActiveTab,
    scope,
    auditKpis,
    reliabilityAvgs,
    revenueKpis,
    unbilledRows,
    pqKpis,
  }
}
