import { useMemo, useState } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { hierData } from '@/data/hierarchy'
import { bucketDts, computeDtStats, getDtsInScope, ratio } from '../logic/dtLogic'
import type { DtLoadFilter } from '../types'

/** Composed state + derived data for the DT Load page. */
export function useDtLoad() {
  const scope = useScope()
  const [filter, setFilter] = useState<DtLoadFilter>(null)

  const scopeId = scope.hierPath.length > 0 ? scope.hierPath[scope.hierPath.length - 1] : 'uppcl'
  const scopeLevel = hierData[scopeId as keyof typeof hierData] ?? null
  const scopeName = scopeLevel?.name ?? 'UPPCL'
  const scopeType = scopeLevel?.type ?? 'State'
  const isStateLevel = !scopeLevel || scopeType === 'State'

  const allDts = useMemo(() => getDtsInScope(scope.hierPath), [scope.hierPath])
  const stats = useMemo(() => computeDtStats(allDts), [allDts])

  // Apply the active filter to produce the DTs actually shown in the buckets.
  const filteredDts = useMemo(() => {
    if (!filter) return allDts
    if (filter === 'dt-atcapacity') return allDts.filter((d) => ratio(d) >= 0.85)
    if (filter === 'dt-overload') return allDts.filter((d) => d.projectedLoad90 / d.capacity > 1)
    if (filter === 'dt-loss') return allDts.filter((d) => d.loss > 15)
    return allDts
  }, [allDts, filter])

  const buckets = useMemo(() => bucketDts(filteredDts), [filteredDts])
  const isFilteredEmpty =
    !!filter &&
    buckets.overloaded.length === 0 &&
    buckets.nearOverload.length === 0 &&
    buckets.optimal.length === 0 &&
    buckets.underUtilised.length === 0

  return {
    scope,
    scopeId,
    scopeName,
    scopeType,
    isStateLevel,
    allDts,
    filteredDts,
    stats,
    buckets,
    isFilteredEmpty,
    filter,
    setFilter,
  }
}
