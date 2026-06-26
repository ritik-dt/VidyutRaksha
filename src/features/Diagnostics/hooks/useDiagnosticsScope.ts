import { useMemo } from 'react'
import { hierData } from '@/data/hierarchy'
import { enrichLevel } from '@/features/Dashboard/adapter'
import { useRole } from '@/shared/context/RoleContext'
import { useScope } from '@/shared/context/ScopeContext'
import { getDiagnosticScopeStats } from '../data/diagnostics'

export function useDiagnosticsScope() {
  const { hierPath } = useScope()
  const { currentRole } = useRole()

  const scopeId = hierPath[hierPath.length - 1] ?? 'uppcl'
  const scopeNode = hierData[scopeId] ?? hierData.uppcl
  const enrichedScope = useMemo(() => {
    if (!scopeNode) {
      return null
    }
    return enrichLevel(scopeNode)
  }, [scopeNode])

  const scopeName = enrichedScope?.name ?? 'UPPCL'
  const isStateLevel = !enrichedScope || enrichedScope.type === 'State'
  const scopeStats = useMemo(() => getDiagnosticScopeStats(scopeId), [scopeId])

  return {
    scopeId,
    scopeName,
    scopeNode: enrichedScope,
    isStateLevel,
    currentRole,
    ...scopeStats,
  }
}
