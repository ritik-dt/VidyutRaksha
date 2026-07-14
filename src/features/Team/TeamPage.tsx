import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopePill } from '@/shared/components/ui/ScopePill'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { ReassignInspectorPanel } from '@/features/Cases/ReassignInspectorPanel'
import { CASES_LIST } from '@/features/Cases/data/cases'
import type { CaseRecord } from '@/features/Cases/types'
import { useTeam } from './hooks/useTeam'
import { TeamAiInsight } from './components/TeamAiInsight'
import { TeamKpiStrip } from './components/TeamKpiStrip'
import { OverloadBanner } from './components/OverloadBanner'
import { WorkloadGrid } from './components/WorkloadGrid'
import { TeamCharts } from './components/TeamCharts'
import { LeaderboardTable } from './components/LeaderboardTable'
import { CasesNeedingAttentionTable } from './components/CasesNeedingAttentionTable'
import { InspectorCasesPanel } from './components/InspectorCasesPanel'
import { RebalanceModal } from './components/RebalanceModal'
import type { InspectorGeneratedCase, RebalanceMove } from './types'

/**
 * Team & inspectors page. Faithful port of the prototype's renderTeamScreen()
 * (line 2848). Includes the workload distribution grid, two Chart.js charts,
 * the 11-column leaderboard table, the cases-needing-attention table, and
 * both the centered rebalance modal + the slide-in inspector cases panel.
 */
export default function TeamPage() {
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()
  const {
    inspectors,
    filter,
    setFilter,
    clearFilter,
    kpis,
    overloaded,
    sorted,
    suggestions,
    insight,
    readOnly,
    openInspector,
    openInspectorPanel,
    closeInspectorPanel,
    isRebalanceOpen,
    openRebalanceModal,
    closeRebalanceModal,
    applyRebalance,
  } = useTeam()

  // Reassign panel local state — used both by the bottom table and the
  // synthetic-case flow from the inspector-cases side panel.
  const [reassignFor, setReassignFor] = useState<CaseRecord | null>(null)

  const filterEntries: FilterPillEntry[] = []
  if (filter !== 'all') filterEntries.push({ label: 'Filter', value: filter })

  // Handlers -----------------------------------------------------------------

  const handleRebalanceClick = () => {
    if (suggestions.length === 0) {
      showToast({
        type: 'success',
        title: 'No rebalancing needed',
        message: 'Team load is well-distributed. All inspectors are between 50-89% capacity.',
        duration: 3500,
      })
      return
    }
    openRebalanceModal()
  }

  const handleApplyRebalance = (moves: RebalanceMove[]) => {
    const totalMoved = applyRebalance(moves)
    closeRebalanceModal()
    showToast({
      type: 'success',
      title: `✓ ${totalMoved} case${totalMoved === 1 ? '' : 's'} redistributed`,
      message: 'Team rebalanced via AI. Affected inspectors notified. Audit log entry created.',
      duration: 5000,
    })
    logActivity('Rebalanced team workload', 'team', `${totalMoved} case(s) redistributed`)
  }

  const handleReduceLoad = () => {
    if (suggestions.length === 0) {
      showToast({
        type: 'info',
        title: 'No reduce-load suggestions',
        message: 'No suitable target inspectors have capacity right now.',
        duration: 3000,
      })
      return
    }
    openRebalanceModal()
  }

  const handleReassignFromTable = (cs: CaseRecord) => {
    setReassignFor(cs)
  }

  // Synthetic case → CaseRecord adapter (faithfulness decision #1).
  const handleReassignFromPanel = (cs: InspectorGeneratedCase) => {
    if (!openInspector) return
    const adapted: CaseRecord = {
      id: cs.id,
      meter: cs.meter,
      consumer: cs.consumer,
      risk: cs.risk,
      area: cs.area,
      status: 'Assigned',
      assignee: openInspector.name,
      created: cs.created,
      due: cs.due,
      flags: 3,
      scopeId: 'synthetic',
    }
    closeInspectorPanel()
    // Delay so the slide-out completes before the reassign panel slides in
    setTimeout(() => setReassignFor(adapted), 250)
  }

  const handleBulkReassign = () => {
    closeInspectorPanel()
    setTimeout(() => openRebalanceModal(), 250)
  }

  return (
    <div className="pb-2">
      <PageHeader
        title="👥 Team & inspectors"
        subtitle="Workload, performance, and AI rebalancing for the inspection team"
        actions={
          readOnly ? (
            <span
              style={{
                padding: '5px 10px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-mid)',
                letterSpacing: 0.5,
              }}
            >
              👁 READ-ONLY
            </span>
          ) : (
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={handleRebalanceClick}
            >
              ✦ AI auto-rebalance{suggestions.length > 0 ? ` (${suggestions.length})` : ''}
            </button>
          )
        }
      />

      <ScopePill />

      {filterEntries.length > 0 && (
        <FilterPill
          entries={filterEntries}
          onClear={clearFilter}
          backLabel="Team"
          onBack={clearFilter}
        />
      )}

      <div className="mb-3.5" />
      <TeamAiInsight insight={insight} />

      <TeamKpiStrip kpis={kpis} activeFilter={filter} onFilterChange={setFilter} />

      <div className="mt-3.5" />
      <OverloadBanner overloaded={overloaded} />

      <WorkloadGrid
        sorted={sorted}
        filter={filter}
        readOnly={readOnly}
        onOpenInspector={openInspectorPanel}
        onReduceLoad={handleReduceLoad}
      />

      <TeamCharts />

      <LeaderboardTable inspectors={inspectors} />

      <CasesNeedingAttentionTable
        cases={CASES_LIST.slice(0, 6)}
        readOnly={readOnly}
        onReassign={handleReassignFromTable}
      />

      {openInspector && (
        <InspectorCasesPanel
          inspector={openInspector}
          onClose={closeInspectorPanel}
          onReassign={handleReassignFromPanel}
          onBulkReassign={handleBulkReassign}
        />
      )}

      {isRebalanceOpen && (
        <RebalanceModal
          suggestions={suggestions}
          inspectors={inspectors}
          onClose={closeRebalanceModal}
          onApply={handleApplyRebalance}
        />
      )}

      {reassignFor && (
        <ReassignInspectorPanel
          caseRecord={reassignFor}
          theftType="Earth Loading"
          onClose={() => setReassignFor(null)}
        />
      )}
    </div>
  )
}
