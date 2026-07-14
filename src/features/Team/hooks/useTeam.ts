// ── useTeam (Layer 3) ────────────────────────────────────────────────────────
// The sole API-integration seam for the Team module. Owns local state (filter,
// side-panel, modal, virtual load overrides from applied rebalances), reads
// role context (isReadOnly), and memoises every derivation.

import { useCallback, useMemo, useState } from 'react'
import { useRole } from '@/shared/context/RoleContext'
import { TEAM_INSPECTORS } from '../data/teamInspectors'
import {
  buildInsight,
  computeKpis,
  computeRebalanceSuggestions,
  filterInspectors,
  overloadedList,
  sortByCapacity,
} from '../logic/teamLogic'
import type { RebalanceMove, TeamFilter, TeamInspector } from '../types'

/** Per-inspector override applied after a successful rebalance. */
interface Override {
  openCases: number
  pastSla: number
}

export function useTeam() {
  const { isReadOnly } = useRole()

  const [filter, setFilter] = useState<TeamFilter>('all')
  const [overrides, setOverrides] = useState<Record<string, Override>>({})
  const [openInspectorId, setOpenInspectorId] = useState<string | null>(null)
  const [isRebalanceOpen, setRebalanceOpen] = useState(false)

  // Overlay the applied rebalance overrides on top of the base data.
  const inspectors = useMemo<TeamInspector[]>(() => {
    if (Object.keys(overrides).length === 0) return TEAM_INSPECTORS
    return TEAM_INSPECTORS.map((i) => {
      const o = overrides[i.id]
      return o ? { ...i, openCases: o.openCases, pastSla: o.pastSla } : i
    })
  }, [overrides])

  const kpis = useMemo(() => computeKpis(inspectors), [inspectors])
  const overloaded = useMemo(() => overloadedList(inspectors), [inspectors])
  const filtered = useMemo(() => filterInspectors(inspectors, filter), [inspectors, filter])
  const sorted = useMemo(() => sortByCapacity(filtered), [filtered])
  const suggestions = useMemo(() => computeRebalanceSuggestions(inspectors, 5), [inspectors])
  const insight = useMemo(() => buildInsight(inspectors, suggestions), [inspectors, suggestions])

  const readOnly = isReadOnly('team')

  // Filter helpers wired to the clickable KPIs
  const applyFilter = useCallback((f: TeamFilter) => setFilter(f), [])
  const clearFilter = useCallback(() => setFilter('all'), [])

  // Side-panel controls
  const openInspectorPanel = useCallback((id: string) => setOpenInspectorId(id), [])
  const closeInspectorPanel = useCallback(() => setOpenInspectorId(null), [])
  const openInspector = useMemo(
    () => inspectors.find((i) => i.id === openInspectorId) ?? null,
    [inspectors, openInspectorId],
  )

  // Rebalance-modal controls
  const openRebalanceModal = useCallback(() => setRebalanceOpen(true), [])
  const closeRebalanceModal = useCallback(() => setRebalanceOpen(false), [])

  /**
   * Apply a set of rebalance moves. Mirrors the prototype's applyRebalance():
   * decrement source, increment destination, reduce source's past-SLA.
   * Returns the total number of cases moved (for the success toast).
   */
  const applyRebalance = useCallback((moves: RebalanceMove[]) => {
    let totalMoved = 0
    setOverrides((prev) => {
      const next = { ...prev }
      const readState = (id: string) => {
        if (next[id]) return next[id]
        const base = TEAM_INSPECTORS.find((x) => x.id === id)!
        return { openCases: base.openCases, pastSla: base.pastSla }
      }
      for (const m of moves) {
        const src = readState(m.src.id)
        const dst = readState(m.dst.id)
        const newSrc = { ...src }
        const newDst = { ...dst }
        for (let i = 0; i < m.caseCount; i++) {
          newSrc.openCases = Math.max(0, newSrc.openCases - 1)
          newDst.openCases++
          totalMoved++
        }
        if (newSrc.pastSla > 0) {
          newSrc.pastSla = Math.max(0, newSrc.pastSla - Math.min(newSrc.pastSla, m.caseCount))
        }
        next[m.src.id] = newSrc
        next[m.dst.id] = newDst
      }
      return next
    })
    return totalMoved
  }, [])

  return {
    inspectors,
    filter,
    setFilter: applyFilter,
    clearFilter,
    kpis,
    overloaded,
    sorted,
    suggestions,
    insight,
    readOnly,
    // side panel
    openInspectorId,
    openInspector,
    openInspectorPanel,
    closeInspectorPanel,
    // rebalance modal
    isRebalanceOpen,
    openRebalanceModal,
    closeRebalanceModal,
    applyRebalance,
    // API-ready seam
    loading: false as const,
    error: null,
  }
}
