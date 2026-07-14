import { useMemo } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { enrichLevel, getChildLabel } from '@/shared/utils/level'
import {
  getCaseListRows,
  getCasesChartData,
  getCasesClosureTrend,
  getCasesHierarchyRows,
  getCasesScopeStats,
  getCasesWatchlist,
} from './data/cases'

export function useCasesScope() {
  const { currentNode, hierPath } = useScope()

  return useMemo(() => {
    const level = currentNode ? enrichLevel(currentNode) : null
    const scopeId = hierPath[hierPath.length - 1] ?? 'uppcl'
    const scopeName = level?.name ?? 'UPPCL'
    const scopeType = level?.type ?? 'State'
    const childLabel = getChildLabel(scopeType)
    const hasChildren = Boolean(level?.children?.length)
    const isLeafScope = !hasChildren || scopeType === 'DTR'
    const stats = getCasesScopeStats(scopeId)
    const hierarchyRows = getCasesHierarchyRows(scopeId)
    const watchlist = getCasesWatchlist(scopeId, 5)
    const chartData = stats ? getCasesChartData(stats) : []
    const trend = stats ? getCasesClosureTrend(scopeId, stats.avgClose) : []
    const listRows = getCaseListRows(scopeId)
    const realCount = listRows.filter((record) => record._real).length

    return {
      level,
      scopeId,
      scopeName,
      scopeType,
      childLabel,
      hasChildren,
      isLeafScope,
      stats,
      hierarchyRows,
      watchlist,
      chartData,
      trend,
      listRows,
      realCount,
    }
  }, [currentNode, hierPath])
}

