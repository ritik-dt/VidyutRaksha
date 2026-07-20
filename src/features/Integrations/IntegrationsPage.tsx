import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { IntKpiRow } from './components/IntKpiRow'
import { SystemCard } from './components/SystemCard'
import { useIntegrations } from './hooks/useIntegrations'

/**
 * Integrations — connected systems, sync status, and health monitoring.
 *
 * Faithful to the prototype's renderIntegrations(): state-level, NOT
 * scope-reactive. Four of the five KPIs are derived from the systems array
 * rather than hardcoded. The KPI cards set a status filter (matching
 * kpiClick('integrations', …)); the prototype shows a pill without filtering
 * anything, so here the filter actually narrows the system cards.
 */
export default function IntegrationsPage() {
  const int = useIntegrations()
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()

  const filterEntries: FilterPillEntry[] = int.filter
    ? [{ label: 'Status', value: int.filter }]
    : []

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="🔌 Integrations"
        subtitle="Connected systems, sync status, and health monitoring"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Add integration',
                  message:
                    'Choose a connector type (REST, SFTP, direct DB), then supply endpoint and credentials.',
                  duration: 3500,
                })
              }
            >
              + Add integration
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'API documentation',
                  message:
                    'Endpoint reference, auth model, rate limits, and payload schemas for every connector.',
                  duration: 3500,
                })
              }
            >
              📄 API documentation
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => {
                const errors = int.allSystems.filter((s) => s.status === 'Error').length
                const warnings = int.allSystems.filter((s) => s.status === 'Warning').length
                showToast({
                  type: 'ai',
                  title: '✦ Health check complete',
                  message: `Probed all ${int.allSystems.length} systems — ${errors} error, ${warnings} warning. GIS connection is still timing out.`,
                  duration: 4000,
                })
                logActivity('Ran integration health check', 'integrations')
              }}
            >
              ✦ Health check
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill entries={filterEntries} onClear={int.clearFilter} />
      )}

      <AiInsightBanner title={int.aiInsight.title} className="mb-[14px]">
        <span dangerouslySetInnerHTML={{ __html: int.aiInsight.bodyHtml }} />
      </AiInsightBanner>

      <IntKpiRow kpis={int.kpis} onFilter={int.setFilter} />

      {int.systems.length === 0 ? (
        <EmptyState
          title="No systems match this filter"
          description="Clear the filter to see all connected systems."
        />
      ) : (
        <div className="grid-2 !gap-[12px]">
          {int.systems.map((s) => (
            <SystemCard
              key={s.name}
              system={s}
              onTest={(sys) =>
                showToast({
                  type: sys.status === 'Error' ? 'error' : 'success',
                  title: sys.status === 'Error' ? 'Connection failed' : 'Connection OK',
                  message:
                    sys.status === 'Error'
                      ? `${sys.name} — ${sys.recordsToday}. Last successful sync ${sys.lastSync}.`
                      : `${sys.name} responded. Last sync ${sys.lastSync} · uptime ${sys.uptime}.`,
                  duration: 3500,
                })
              }
              onViewLogs={(sys) =>
                showToast({
                  type: 'info',
                  title: 'Connector logs',
                  message: `Opening request/response log for ${sys.name} (${sys.type}).`,
                  duration: 3000,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
