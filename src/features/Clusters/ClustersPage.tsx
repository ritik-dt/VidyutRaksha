import { useScope } from '@/shared/context/ScopeContext'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import { useClustersScope } from './hooks/useClustersScope'
import { ClustersKpiStrip } from './components/ClustersKpiStrip'
import { ClusterCharts } from './components/ClusterCharts'
import { ClustersTable } from './components/ClustersTable'
import { ClusterCaseDetail } from './components/ClusterCaseDetail'
import { ALL_CLUSTERS, FEATURED_CASE_ID } from './data/clusters'
import type { Cluster } from './types'

export default function ClustersPage() {
  const { toggleScopePicker } = useScope()
  const { showToast } = useToast()
  const { scopeName, isStateLevel, clusters, stats, filter, setFilter, clearFilter } = useClustersScope()

  const scopeSuffix = isStateLevel ? '' : ` · ${scopeName}`
  const hasFeatured = clusters.some((c) => c.id === FEATURED_CASE_ID)

  const filterEntries: FilterPillEntry[] = []
  if (filter.status) filterEntries.push({ label: 'Status', value: filter.status })

  function handleRowClick(c: Cluster) {
    showToast({
      type: 'ai',
      title: `Opening cluster ${c.id}`,
      message:
        'Full view: all members with cases, cross-member evidence, batch actions, police coordination letter, raid planning.',
      duration: 5000,
    })
  }

  const aiSummary =
    stats.totalGroups > 0 ? (
      <>
        I've identified{' '}
        <strong className="text-ai-purple">
          {stats.totalGroups} active coordinated theft case{stats.totalGroups > 1 ? 's' : ''}
        </strong>{' '}
        {isStateLevel ? 'across the KVVNL network' : <>at <strong className="text-ai-purple">{scopeName}</strong></>} covering{' '}
        <strong className="text-ai-purple">
          {stats.totalConsumers} connected consumer{stats.totalConsumers > 1 ? 's' : ''}
        </strong>{' '}
        with <strong className="text-ai-purple">{stats.totalExposureStr} estimated revenue exposure</strong>. A case is opened when consumers show:
        (1) <strong className="text-ai-purple">same-window tamper pattern</strong> — drops within days of each other; (2){' '}
        <strong className="text-ai-purple">same DTR or feeder</strong> — physical proximity implies a common operator; (3){' '}
        <strong className="text-ai-purple">identical theft method</strong> — same earth-loading signature, same bypass technique, often a common
        electrician.{' '}
        {stats.largestGroupName && (
          <>
            <strong className="text-ai-purple">
              Priority: {stats.largestGroupName} ({stats.largestGroup} consumers)
            </strong>{' '}
            — recommend immediate batch raid with police coordination.
          </>
        )}
      </>
    ) : (
      <>
        <strong className="text-green">No active coordinated theft cases at {scopeName}</strong> — clean
        slate. Cases are detected weekly from MRI batch analysis. State-wide there are {ALL_CLUSTERS.length} active
        cases; navigate up the scope to view them.
      </>
    )

  return (
    <div className="pb-2">
      <PageHeader
        title="🎯 Coordinated theft cases"
        subtitle={
          <>
            Multiple consumers showing synchronized tamper patterns — flagged for batch raids and police-coordinated
            enforcement · {isStateLevel ? 'showing state-wide totals' : <>filtered to <strong>{scopeName}</strong></>}
          </>
        }
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Map view', message: 'Geographic cluster map — coming soon.', duration: 3000 })}
            >
              🗺️ Map view
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Closed cases', message: 'Archived coordinated theft cases — coming soon.', duration: 3000 })}
            >
              📊 Closed cases
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'Scanning for new cases', message: 'Running coordinated-theft detection on the latest MRI batch...', duration: 3000 })}
            >
              ✦ Scan for new cases
            </button>
          </>
        }
      />

      <ScopeBreadcrumb
        rightActions={
          <span className="flex items-center gap-2">
            <span className="text-[10.5px] font-semibold text-text-mid">
              {stats.totalGroups} case{stats.totalGroups === 1 ? '' : 's'} · {stats.totalConsumers} consumers
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '10px', padding: '3px 9px', color: 'var(--ai-purple)', borderColor: 'rgba(124,58,237,0.3)' }}
              onClick={toggleScopePicker}
            >
              ↕ Change scope
            </button>
          </span>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill
          entries={filterEntries}
          onClear={clearFilter}
          backLabel="Coordinated theft cases"
          onBack={clearFilter}
        />
      )}

      <AiInsightBanner title={`Coordinated theft summary · ${scopeName}`}>{aiSummary}</AiInsightBanner>

      <ClustersKpiStrip stats={stats} isStateLevel={isStateLevel} scopeName={scopeName} onFilter={setFilter} />

      {stats.totalGroups === 0 ? (
        <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
          <div style={{ fontSize: '42px', marginBottom: '8px', opacity: 0.5 }}>✨</div>
          <div className="mb-1.5 text-[14px] font-bold">No coordinated theft cases at {scopeName}</div>
          <div className="mx-auto max-w-[480px] text-[12px] leading-relaxed text-text-mid">
            Coordinated theft cases are rare events detected weekly from MRI batch analysis. State-wide there are{' '}
            {ALL_CLUSTERS.length} active cases — navigate up to UPPCL or KVVNL to view them.
          </div>
          <button type="button" className="btn btn-outline btn-sm mt-3.5" style={{ fontSize: '11px' }} onClick={toggleScopePicker}>
            ↕ Change scope
          </button>
        </div>
      ) : (
        <>
          <ClusterCharts clusters={clusters} scopeSuffix={scopeSuffix} />
          <ClustersTable clusters={clusters} scopeSuffix={scopeSuffix} onRowClick={handleRowClick} />
          {hasFeatured && (
            <ClusterCaseDetail
              onBatchRaid={() =>
                showToast({
                  type: 'ai',
                  title: 'Batch raid created',
                  message: 'Batch raid initiated for all 5 members of CL-2026-042 with police coordination. Raid planning packet generated.',
                  duration: 4000,
                })
              }
            />
          )}
        </>
      )}
    </div>
  )
}
