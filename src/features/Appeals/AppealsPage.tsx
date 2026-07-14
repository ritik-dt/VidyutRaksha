import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { useAppeals } from './hooks/useAppeals'
import { AppealsKpiStrip } from './components/AppealsKpiStrip'
import { AppealChartsRow } from './components/AppealChartsRow'
import { AllAppealsTable } from './components/AllAppealsTable'
import { HearingPrepCard } from './components/HearingPrepCard'
import { APPEALS_STATS, FEATURED_APPEAL_ID } from './data/appeals'
import type { Appeal } from './types'

export default function AppealsPage() {
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()
  const { filter, setFilter, clearFilter, resetToDefault, filtered } = useAppeals()

  const filterEntries: FilterPillEntry[] = []
  if (filter.status) filterEntries.push({ label: 'Status', value: filter.status })

  function handleReview(a: Appeal) {
    showToast({
      type: 'info',
      title: `Reviewing ${a.id}`,
      message: `${a.consumer} · ${a.case} · ${a.amount}. Opening full appeal detail with evidence pack and hearing schedule.`,
      duration: 4000,
    })
    logActivity('Reviewed appeal', 'appeals', a.id)
  }

  return (
    <div className="pb-2">
      <PageHeader
        title="⚖️ Appeals & disputes"
        subtitle="Section 127 appeals workflow — consumer disputes of AI-flagged theft cases"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'New appeal',
                  message: 'Opening the new appeal filing form — select case and enter grounds.',
                  duration: 3000,
                })
              }
            >
              + New appeal
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Appeal analytics',
                  message: 'Loading detailed analytics dashboard for appeals — trends, outcomes, ROI.',
                  duration: 3500,
                })
              }
            >
              📊 Appeal analytics
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'AI review assistant',
                  message: 'AI is scanning open appeals and drafting counter-arguments for each.',
                  duration: 4000,
                })
              }
            >
              ✦ AI review assistant
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill
          entries={filterEntries}
          onClear={clearFilter}
          backLabel="Appeals & disputes"
          onBack={resetToDefault}
        />
      )}

      <AiInsightBanner title="AI appeals overview">
        <strong className="text-ai-purple">18 active appeals</strong> representing{' '}
        <strong className="text-ai-purple">₹42.6L</strong> in disputed assessments. Average appeal
        resolution time: <strong className="text-ai-purple">18 days</strong>. Historical outcome:{' '}
        <strong className="text-ai-purple">
          14% upheld fully, 31% reduced, 55% dismissed
        </strong>
        . The most common appeal ground is{' '}
        <strong className="text-ai-purple">"disputed consumption baseline"</strong> (44%) —
        suggests strengthening peer-group documentation in notices.{' '}
        <strong className="text-ai-purple">Priority focus:</strong> {FEATURED_APPEAL_ID} (HEERA
        LAL AGRAWAL) — hearing this Friday, disputed baseline methodology.
      </AiInsightBanner>

      <AppealsKpiStrip stats={APPEALS_STATS} onFilter={setFilter} />

      <AppealChartsRow />

      <AllAppealsTable appeals={filtered} onReview={handleReview} />

      <HearingPrepCard
        onExportBrief={() =>
          showToast({
            type: 'success',
            title: 'Hearing brief exported',
            message: `${FEATURED_APPEAL_ID}_brief.pdf downloaded. Includes claim, counter-argument, and legal precedents.`,
            duration: 3500,
          })
        }
        onPrepareCase={() =>
          showToast({
            type: 'ai',
            title: 'Preparing full case',
            message: 'AI is assembling evidence pack, peer-comparison charts, and citations for the hearing.',
            duration: 4000,
          })
        }
      />
    </div>
  )
}
