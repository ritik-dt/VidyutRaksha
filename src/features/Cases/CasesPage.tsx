import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScope } from '@/shared/context/ScopeContext'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { formatIndian } from '@/shared/utils/formatters'
import { getPathForScreen } from '@/shared/utils/navigation'
import { fmtINR } from '@/features/Dashboard/adapter'
import { hierData } from '@/data/hierarchy'
import { getCasesScopeStats, getCaseListRows } from './data/cases'
import { useCasesScope } from './useCasesScope'
import { CasesKpiStrip } from './CasesKpiStrip'
import { CasesHierarchyTable } from './CasesHierarchyTable'
import { CasesSlaWatchlist } from './CasesSlaWatchlist'
import { CasesAnalyticsSection } from './CasesAnalyticsSection'
import { CasesListDrawer } from './CasesListDrawer'

interface DrawerState {
  scopeId: string
  statusFilter?: string
}

export default function CasesPage() {
  const navigate = useNavigate()
  const { toggleScopePicker, drillToChild } = useScope()
  const {
    scopeId,
    scopeName,
    childLabel,
    stats,
    hierarchyRows,
    watchlist,
    trend,
    realCount,
    isLeafScope,
  } = useCasesScope()
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null)

  const safeStats = stats ?? {
    total: 0,
    pastSla: 0,
    open: 0,
    inProgress: 0,
    escalated: 0,
    confirmed: 0,
    closed: 0,
    avgClose: 0,
    recovery: 0,
    active: 0,
  }

  function openDrawer(targetScopeId = scopeId, statusFilter = 'all') {
    setDrawerState({ scopeId: targetScopeId, statusFilter })
  }

  const drawerScope = drawerState ? hierData[drawerState.scopeId] : null
  const drawerStats = drawerState ? getCasesScopeStats(drawerState.scopeId) : null
  const drawerRecords = drawerState ? getCaseListRows(drawerState.scopeId) : []

  return (
    <div className="pb-8">
      <PageHeader
        title="📋 Inspection cases"
        subtitle={
          <>
        Hierarchical view · drill into any {childLabel} or scope down to see actual cases
            {realCount > 0 ? (
              <span className="font-semibold text-green-600"> · {formatIndian(realCount)} from real Mar-2026 KVVNL tamper report</span>
            ) : null}
        </>
        }
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate(getPathForScreen('dashboard'))}
              className="btn btn-outline btn-sm"
            >
              ← Overview
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => openDrawer(scopeId, 'Past SLA')}
            >
              ✦ AI auto-assign
            </button>
          </>
        }
      />

      <ScopeBreadcrumb
        rightActions={
          <span className="flex items-center gap-2">
            <span className="text-[10.5px] font-semibold text-text-mid">
              {formatIndian(safeStats.total)} total · {formatIndian(safeStats.active)} active
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '10px', padding: '3px 9px', color: 'var(--ai-purple)', borderColor: 'rgba(124,58,237,0.3)' }}
              onClick={toggleScopePicker}
            >
              ↕ Change scope
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '10px', padding: '3px 9px' }}
              onClick={() => openDrawer(scopeId)}
            >
              📋 View {formatIndian(safeStats.total)} cases →
            </button>
          </span>
        }
      />

      <AiInsightBanner title="AI case advisor">
        Across <strong>{scopeName}</strong>, <strong style={{ color: 'var(--red)' }}>
          {formatIndian(safeStats.pastSla)} cases are past SLA
        </strong> - recommend immediate escalation. <strong>{formatIndian(safeStats.confirmed)}</strong> confirmed theft cases have generated assessments worth <strong>{fmtINR(safeStats.recovery)}</strong> (at 62% realization). Closure rate is <strong>{safeStats.avgClose} days</strong>{' '}
        {safeStats.avgClose > 3 ? '(above 3-day target - investigate inspector load)' : '(within 3-day target ✓)'}.{' '}
        {isLeafScope ? 'You are at the deepest scope - the case list is below.' : `Drill into any ${childLabel} below to narrow scope.`}
      </AiInsightBanner>

      <CasesKpiStrip
        stats={safeStats}
        activeFilter={drawerState?.statusFilter ?? 'all'}
        onChangeFilter={(filter) => openDrawer(scopeId, filter)}
      />

      {hierarchyRows.length > 0 && (
        <CasesHierarchyTable
          childLabel={childLabel}
          scopeName={scopeName}
          stats={safeStats}
          rows={hierarchyRows}
          onDrill={(childId) => drillToChild(childId)}
          onViewCases={(childId) => openDrawer(childId)}
        />
      )}

      <CasesSlaWatchlist scopeName={scopeName} items={watchlist} />

      <CasesAnalyticsSection scopeName={scopeName} stats={safeStats} trend={trend} />

      {drawerState && drawerStats && drawerScope && (
        <CasesListDrawer
        key={`${drawerState.scopeId}:${drawerState.statusFilter ?? 'all'}`}
          scopeName={drawerScope.name}
          scopeType={drawerScope.type}
          stats={drawerStats}
          records={drawerRecords}
          initialStatusFilter={drawerState.statusFilter}
          onClose={() => setDrawerState(null)}
        />
      )}
    </div>
  )
}
