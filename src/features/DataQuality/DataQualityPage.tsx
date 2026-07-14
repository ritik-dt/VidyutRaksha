import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { AttentionTable } from './components/AttentionTable'
import { CompletenessTable } from './components/CompletenessTable'
import { DqCharts } from './components/DqCharts'
import { DqKpiRow } from './components/DqKpiRow'
import { IngestionPipelineStrip } from './components/IngestionPipelineStrip'
import { useDataQuality } from './hooks/useDataQuality'

const FILTER_LABEL: Record<string, string> = {
  stopped: 'Stopped meters',
  intermittent: 'Intermittent comm',
}

/**
 * Data quality monitoring — MRI ingestion pipeline health, meter communication,
 * and data completeness.
 *
 * Faithful to the prototype's renderDataQuality(): state-level, NOT
 * scope-reactive. The two clickable KPI cards set a filter (matching
 * kpiClick('dataQuality', …)); the prototype shows a pill without filtering
 * anything, so here the filter actually narrows the attention table.
 */
export default function DataQualityPage() {
  const dq = useDataQuality()
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()

  const filterEntries: FilterPillEntry[] = dq.filter
    ? [{ label: 'Comm status', value: FILTER_LABEL[dq.filter] }]
    : []

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="📡 Data quality monitoring"
        subtitle="Real-time health of MRI ingestion pipeline, meter communication, and data completeness"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Configure alerts',
                  message:
                    'Set thresholds for MRI freshness, parse-failure rate, and stopped-meter counts.',
                  duration: 3500,
                })
              }
            >
              ⚙️ Configure alerts
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => {
                showToast({
                  type: 'ai',
                  title: '✦ AI diagnostic',
                  message:
                    'Running root-cause analysis across comm failures, parse errors, and DT-level network health.',
                  duration: 4000,
                })
                logActivity('Ran AI data-quality diagnostic', 'dataQuality')
              }}
            >
              ✦ AI diagnostic
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill entries={filterEntries} onClear={dq.clearFilter} />
      )}

      <AiInsightBanner title={dq.aiInsight.title} className="mb-[14px]">
        <span dangerouslySetInnerHTML={{ __html: dq.aiInsight.bodyHtml }} />
      </AiInsightBanner>

      <DqKpiRow kpis={dq.kpis} onFilter={dq.setFilter} />

      <DqCharts freshness={dq.freshnessChart} commHealth={dq.commHealthChart} />

      <IngestionPipelineStrip stats={dq.pipeline} />

      <AttentionTable rows={dq.attention} title={dq.attentionTitle} />

      <CompletenessTable rows={dq.completeness} />
    </div>
  )
}
