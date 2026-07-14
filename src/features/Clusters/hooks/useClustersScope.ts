import { useMemo, useState } from 'react'
import { hierData } from '@/data/hierarchy'
import { enrichLevel } from '@/shared/utils/level'
import { useScope } from '@/shared/context/ScopeContext'
import {
  computeClusterStats,
  filterClustersByScope,
} from '../data/clusters'
import type { ClusterFilter } from '../types'

/**
 * Scope-aware Clusters state: filters the coordinated-theft cases to the current
 * hierarchy scope (same rule as the prototype) and derives the KPI stats. The
 * KPI-click filter drives the filter pill (matching the prototype).
 */
export function useClustersScope() {
  const { hierPath } = useScope()
  const [filter, setFilter] = useState<ClusterFilter>({})

  const scopeId = hierPath[hierPath.length - 1] ?? 'uppcl'
  const scopeNode = hierData[scopeId] ?? hierData.uppcl
  const enriched = useMemo(() => (scopeNode ? enrichLevel(scopeNode) : null), [scopeNode])

  const scopeName = enriched?.name ?? 'UPPCL'
  const scopeType = enriched?.type ?? 'State'
  const isStateLevel = !enriched || scopeType === 'State'

  const clusters = useMemo(
    () => filterClustersByScope(hierPath, scopeId, scopeType, scopeName),
    [hierPath, scopeId, scopeType, scopeName],
  )
  const stats = useMemo(() => computeClusterStats(clusters), [clusters])

  function clearFilter() {
    setFilter({})
  }

  return {
    hierPath,
    scopeId,
    scopeName,
    scopeType,
    isStateLevel,
    clusters,
    stats,
    filter,
    setFilter,
    clearFilter,
  }
}
